/**
 * Poddar Pipes — website form receiver (Google Apps Script).
 *
 * Every form on poddarpipes.com (enquiry pop-up, /contact, product enquiries,
 * newsletter) POSTs here from the website's server. This script:
 *
 *   1. checks the shared secret,
 *   2. appends the submission as a row in this spreadsheet — one tab per form
 *      ("Enquiries", "Partners", "Newsletter"), headers
 *      created automatically and extended if the website adds a field,
 *   3. emails it to NOTIFY_EMAIL (optional) with Reply-To set to the visitor.
 *
 * The row is the record: if the email fails, the row is still written and the
 * website still reports success.
 *
 * SETUP: see README.md next to this file. In short — paste this into
 * Extensions → Apps Script of the spreadsheet, set the Script Properties
 * SECRET (and NOTIFY_EMAIL), run `testSetup` once to authorise, then
 * Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone)
 * and give the /exec URL + SECRET to the website (SHEETS_WEBHOOK_URL /
 * SHEETS_WEBHOOK_SECRET).
 */

var TIMESTAMP_HEADER = "Submitted at";
// "Product enquiries" / "Careers" are kept so older rows and cached pages
// still land correctly; the website now sends Enquiries, Partners, Newsletter.
var ALLOWED_TABS = ["Enquiries", "Partners", "Newsletter", "Product enquiries", "Careers"];

function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty("SECRET");

  var data;
  try {
    data = JSON.parse(e && e.postData ? e.postData.contents : "");
  } catch (err) {
    return reply_({ ok: false, error: "bad_json" });
  }
  if (!secret || !data || data.secret !== secret) {
    return reply_({ ok: false, error: "unauthorized" });
  }
  if (!Array.isArray(data.rows) || data.rows.length === 0) {
    return reply_({ ok: false, error: "no_rows" });
  }

  var tab = ALLOWED_TABS.indexOf(data.form) >= 0 ? data.form : "Other";

  // One writer at a time, so two submissions arriving together can't
  // interleave their header/row writes.
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    appendRow_(tab, data.rows);
  } finally {
    lock.releaseLock();
  }

  var mailError = null;
  var to = props.getProperty("NOTIFY_EMAIL");
  if (to) {
    try {
      sendMail_(to, data);
    } catch (err) {
      mailError = String(err).slice(0, 200);
    }
  }
  return reply_({ ok: true, mailError: mailError });
}

/** A quick "is it deployed?" check: open the /exec URL in a browser. */
function doGet() {
  return reply_({ ok: true, service: "poddar-forms", time: new Date().toISOString() });
}

/** Run once from the editor: authorises Sheets + Mail and writes a test row. */
function testSetup() {
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty("SECRET")) {
    throw new Error("Set the SECRET script property first (Project Settings → Script Properties).");
  }
  var res = doPost({
    postData: {
      contents: JSON.stringify({
        secret: props.getProperty("SECRET"),
        form: "Enquiries",
        subject: "TEST — website form setup",
        replyTo: "",
        rows: [
          ["Enquiry type", "General"],
          ["Name", "Setup test"],
          ["Message", "If you can read this row (and got the email), the setup works. You can delete this row."],
        ],
      }),
    },
  });
  Logger.log(res.getContent());
}

/* ------------------------------------------------------------------ helpers */

function appendRow_(tabName, rows) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);

  var labels = [TIMESTAMP_HEADER];
  var values = {};
  values[TIMESTAMP_HEADER] = new Date();
  for (var i = 0; i < rows.length; i++) {
    var label = String(rows[i][0]).slice(0, 80);
    if (labels.indexOf(label) < 0) labels.push(label);
    values[label] = safeCell_(rows[i][1]);
  }

  var header = [];
  if (sheet.getLastRow() > 0 && sheet.getLastColumn() > 0) {
    header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  }
  if (header.length === 0) {
    header = labels;
    sheet.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  } else {
    // A field the website added later gets a new column at the end.
    var missing = labels.filter(function (l) { return header.indexOf(l) < 0; });
    if (missing.length) {
      sheet.getRange(1, header.length + 1, 1, missing.length).setValues([missing]).setFontWeight("bold");
      header = header.concat(missing);
    }
  }

  sheet.appendRow(header.map(function (h) { return h in values ? values[h] : ""; }));
}

/**
 * Text that starts with = + - @ would be run as a formula when the sheet (or
 * its Excel download) is opened — a visitor could inject one. Prefixing an
 * apostrophe stores it as plain text.
 */
function safeCell_(v) {
  var s = v == null ? "" : String(v).slice(0, 5000);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function sendMail_(to, data) {
  var lines = data.rows.map(function (r) { return r[0] + ":\n" + (r[1] || "—") + "\n"; });
  var html = data.rows
    .map(function (r) {
      return '<tr><th align="left" valign="top" style="padding:8px;border-bottom:1px solid #e5e5e5;color:#606060;width:160px">' +
        esc_(r[0]) + '</th><td style="padding:8px;border-bottom:1px solid #e5e5e5;white-space:pre-wrap">' +
        (r[1] ? esc_(r[1]) : "&mdash;") + "</td></tr>";
    })
    .join("");
  var options = {
    name: "Poddar Pipes Website",
    htmlBody:
      '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222">' +
      '<h2 style="font-size:18px;color:#171796;margin:0 0 12px">' + esc_(data.subject) + "</h2>" +
      '<table cellspacing="0" style="border-collapse:collapse;max-width:640px;width:100%">' + html + "</table>" +
      '<p style="color:#888;font-size:12px">Saved to the "' + esc_(data.form || "") +
      '" tab of the website submissions sheet. Reply to this email to answer the sender.</p></div>',
  };
  if (data.replyTo) options.replyTo = String(data.replyTo);
  MailApp.sendEmail(to, String(data.subject || "Website form").replace(/[\r\n]+/g, " ").slice(0, 200), lines.join("\n"), options);
}

function esc_(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
