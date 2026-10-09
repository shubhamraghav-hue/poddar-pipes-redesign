# Website forms → Google Sheet (+ email)

The site has three forms — **Become a Partner** (dealers & distributors, in
the pop-up), the **Contact** form (/contact and its pop-up) and the **footer
newsletter**. Each submission is saved as a row in one Google Sheet and emailed to your inbox. The sheet opens in Excel or
downloads as `.xlsx` at any time (File → Download → Microsoft Excel).

```
Visitor submits a form
      │
      ▼
Website server (/api/enquiry, /api/newsletter)
  • checks the fields, blocks spam bots, rate-limits
      │  (secret-protected HTTPS call)
      ▼
Google Apps Script attached to the sheet  (Code.gs in this folder)
  • adds a row to the right tab ──► Google Sheet
  • emails the submission ───────► hello@poddarpipes.com  (Reply = answers the visitor)
```

Tabs are created automatically on the first submission:

| Tab | Comes from | Columns |
|---|---|---|
| **Partners** | "Become a Partner" pop-up (navbar, product pages, /products, CTA bands) | Submitted at, Contact name, Company, Business email, Phone / WhatsApp, Website / social, Country, State, City, Business type, Years in business, Coverage area, Message, Page |
| **Enquiries** | Contact form (/contact, "Talk to our team", calculator) — type is always "General" | Submitted at, Enquiry type, Name, Email, Mobile, Company, City, Pincode, Message, Page |
| **Newsletter** | Footer signup | Submitted at, Email, Page |

> **Updating an existing deployment:** the "Partners" tab was added on
> 2026-10-09. If your script was deployed before that, paste the new
> `Code.gs`, then **Deploy → Manage deployments → ✏️ → Version: New version →
> Deploy** (same URL). Until then partner rows still save — in an "Other" tab.

Cost: free. Google's limits — 100 notification emails/day on a personal Gmail
account, 1,500/day on Google Workspace — are far above normal enquiry volume.
Rows are always saved even if the email limit is hit.

---

## One-time setup (≈10 minutes, by whoever owns the company Google account)

Use the Google account that should own the data (ideally the
`hello@poddarpipes.com` Workspace account).

1. **Create the sheet.** Go to <https://sheets.new>, name it
   *"Poddar Pipes — Website submissions"*.
2. **Add the script.** In the sheet: **Extensions → Apps Script**. Delete the
   sample code, paste the whole of `Code.gs` from this folder, click **Save**.
3. **Set the two settings.** In Apps Script: **Project Settings** (gear icon) →
   **Script Properties** → **Add script property**:
   - `SECRET` — a long random password, e.g. generate one at
     <https://www.random.org/strings/> (24+ letters/digits). Keep it; the
     website needs the same value.
   - `NOTIFY_EMAIL` — where notifications go, e.g. `hello@poddarpipes.com`
     (several: comma-separated). Leave it out to only save rows.
4. **Authorise and test.** Back in the editor, choose the function
   **`testSetup`** in the toolbar and click **Run**. Google asks for
   permission ("Google hasn't verified this app" → *Advanced* → *Go to …* →
   *Allow*) — this is your own script. A test row appears in an
   **Enquiries** tab and a test email arrives. Delete the test row.
5. **Publish it.** **Deploy → New deployment** → type **Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   → **Deploy** → copy the **Web app URL** (ends in `/exec`).
   ("Anyone" only lets the website *send* to it; nobody can read the sheet
   through it, and every call must carry the SECRET.)
6. **Connect the website.** In Vercel → the project → **Settings →
   Environment Variables** (Production), add:
   - `SHEETS_WEBHOOK_URL` = the `/exec` URL
   - `SHEETS_WEBHOOK_SECRET` = the same SECRET as step 3
   Redeploy. Submit a test enquiry on the live site and check the sheet.

### Changing the script later
Edit the code, then **Deploy → Manage deployments → ✏️ → Version: New
version → Deploy**. The URL stays the same. (Saving alone does not update the
live web app.)

### Sharing and Excel
- Share the sheet with the sales team (Share button) — view or edit access.
- Excel: **File → Download → Microsoft Excel (.xlsx)**, or open the sheet's
  link in Excel for the web.
- Add filters/colour/“Status” columns freely to the right of the existing
  columns — new submissions keep appending below.

## Optional: a second email channel (Resend)
The website can also send each submission through Resend
(`RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL`). With both set,
a submission counts as delivered if **either** succeeds. Not needed if the
sheet's NOTIFY_EMAIL is set.

## Why not Google Forms?
Google Forms has no supported way for a website to submit into it — the
workarounds post to the form's internal URL, break silently when the form is
edited, and bypass the site's spam protection and validation. The sheet above
is the same "responses spreadsheet" a Google Form gives you, without those
problems, and the site keeps its own designed forms.

## If something goes wrong
- Visitors see "We couldn't send your message — call or email us" instead of a
  false "sent", and the error is in Vercel's function logs (`[forms] …`).
- `Google Sheet rejected the submission: unauthorized` → the SECRET in Vercel
  and in Script Properties differ.
- Opening the `/exec` URL in a browser shows `{"ok":true,"service":"poddar-forms"…}`
  when the deployment is live.
