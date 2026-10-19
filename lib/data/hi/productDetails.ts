import { productDetails, type ProductDetail } from "@/lib/data/productDetails";
import type { Overlay } from "@/lib/i18n/localize";

// Hindi overlay for lib/data/productDetails.ts (keyed by range id).
//
// `whatIs` and `why` are nested objects and the overlay merge is shallow, so
// each range gets COMPLETE objects here. They are built FROM the English
// entries — images, art boxes, crops and widths are carried over untouched —
// with only the copy replaced. Card titles are given in the English order.
//
// The heading renders `lead` (light, line 1) over `name` (bold, line 2).
// Hindi puts "क्या है" after the subject, so the "What is" band reads
// "जानिए / CPVC क्या है?" and the "Why" band "क्यों / CPVC?" (its lead is the
// `products.whyLead` message).

const en = productDetails as Record<string, ProductDetail>;

function hi(
  id: string,
  whatIs: Pick<ProductDetail["whatIs"], "name" | "body" | "alt">,
  whyName: string,
  titles: string[]
): Partial<ProductDetail> {
  const base = en[id];
  if (titles.length !== base.why.cards.length) {
    throw new Error(`productDetails hi overlay: ${id} needs ${base.why.cards.length} card titles`);
  }
  return {
    whatIs: { ...base.whatIs, lead: "जानिए", ...whatIs },
    why: {
      name: whyName,
      cards: base.why.cards.map((card, i) => ({ ...card, title: titles[i] })),
    },
  };
}

export const productDetailsHi: Overlay<ProductDetail> = {
  "cpvc-pipes": hi(
    "cpvc-pipes",
    {
      name: "CPVC क्या है?",
      body: "क्लोरीनेटेड पॉलीविनाइल क्लोराइड (CPVC) PVC रेज़िन के क्लोरीनीकरण से बना एक थर्मोप्लास्टिक है, जिसका उपयोग गर्म और ठंडे पानी के वितरण में होता है। यह 50 से अधिक वर्षों से दुनिया भर में पीने के पानी की आपूर्ति के लिए एक पसंदीदा सामग्री रहा है।",
      alt: "CPVC पॉलिमर श्रृंखला का बॉल-एंड-स्टिक मॉडल",
    },
    "CPVC?",
    [
      "पीने के पानी की लाइनों के लिए सुरक्षित",
      "जंग, स्केल या पिटिंग नहीं",
      "गर्म और ठंडे पानी के लिए निर्मित",
      "अग्नि-मंदक",
      "त्वरित कोल्ड-वेल्ड स्थापना",
    ]
  ),
  "upvc-pipes": hi(
    "upvc-pipes",
    {
      name: "uPVC क्या है?",
      body: "अनप्लास्टिसाइज़्ड पॉलीविनाइल क्लोराइड (uPVC) एक थर्मोप्लास्टिक है, जिसका उपयोग ठंडे पानी की प्लंबिंग, जल आपूर्ति और भूमिगत जल निकासी में होता है। यह जंग, संक्षारण और क्षय का प्रतिरोध करता है, और घरों तथा व्यावसायिक इमारतों के लिए इसमें लेड-फ्री सॉल्वेंट-वेल्ड सिस्टम है।",
      alt: "PVC पॉलिमर श्रृंखला का बॉल-एंड-स्टिक मॉडल",
    },
    "uPVC?",
    [
      "लेड-फ्री, पीने के पानी के लिए सुरक्षित",
      "रसायनों के प्रति प्रतिरोधी",
      "ठंडे पानी और जल निकासी के लिए निर्मित",
      "रखरखाव-मुक्त",
      "त्वरित सॉल्वेंट-वेल्ड स्थापना",
    ]
  ),
  "ugd-pipes": hi(
    "ugd-pipes",
    {
      name: "UGD क्या है?",
      body: "भूमिगत जल निकासी (UGD) पाइप्स और फिटिंग्स की एक प्रणाली है, जो घरेलू सीवेज, वर्षा जल और औद्योगिक अपशिष्ट ले जाती है। पोद्दार के तीन-परत फोम-कोर uPVC पाइप्स इमारतों और नगरपालिका सीवर नेटवर्क के बीच गैर-दबाव जल निकासी के लिए बनाए गए हैं।",
      alt: "पोद्दार UGD पाइप फिटिंग्स — बेंड, एक Y-जंक्शन और कपलर",
    },
    "UGD?",
    [
      "उच्च प्रवाह के लिए चिकना बोर",
      "लीक-प्रूफ जोड़",
      "हल्का, फिर भी भार सहने योग्य",
      "संक्षारण प्रतिरोधी",
      "त्वरित स्थापना",
    ]
  ),
  "swr-pipes": hi(
    "swr-pipes",
    {
      name: "SWR क्या है?",
      body: "मल, अपशिष्ट और वर्षा जल (SWR) सिस्टम uPVC पाइप्स और फिटिंग्स हैं, जो आवासीय, व्यावसायिक और औद्योगिक उपयोगों में मल, अपशिष्ट और वर्षा जल ले जाते हैं। पोद्दार इन्हें रिंग जॉइंट और सॉल्वेंट जॉइंट, दोनों विकल्पों में प्रदान करता है।",
      alt: "पोद्दार SWR पाइप्स और फिटिंग्स",
    },
    "SWR?",
    [
      "उच्च प्रवाह दर के लिए चिकना बोर",
      "लीक-प्रूफ रिंग और सॉल्वेंट जोड़",
      "संक्षारण और घर्षण प्रतिरोधी",
      "मल, अपशिष्ट और वर्षा जल के लिए निर्मित",
      "त्वरित और आसान स्थापना",
    ]
  ),
  "agricultural-pipes": hi(
    "agricultural-pipes",
    {
      name: "AGRI क्या है?",
      body: "Agri एक लेड-फ्री uPVC सॉल्वेंट-वेल्ड सिस्टम है, जो विशेष रूप से कृषि जल आपूर्ति के लिए बनाया गया है। पोद्दार Agri पाइप्स IS 4985:2021 के अनुसार बनाए जाते हैं और विभिन्न दबाव वर्गों में 20 से 315mm तक के आकारों में उपलब्ध हैं।",
      alt: "खेत में एक के ऊपर एक रखे पोद्दार Agri पाइप्स",
    },
    "AGRI?",
    [
      "UV प्रतिरोधी",
      "कोई विषाक्तता, गंध या स्वाद नहीं",
      "100% लीक-प्रूफ जोड़",
      "उच्च दबाव सहने में सक्षम",
      "लागत-कुशल",
    ]
  ),
  tanks: hi(
    "tanks",
    {
      name: "पोद्दार टैंक क्या है?",
      body: "पोद्दार टैंक गोल्ड तीन- और चार-परत वाले जल भंडारण टैंकों की एक श्रृंखला है, जो संग्रहित पानी की सुरक्षा के लिए बनाई गई है। हर परत संदूषण, गर्मी और रोज़मर्रा की टूट-फूट से बचाव करती है, और हर टैंक पर 10 वर्ष की वारंटी है।",
      alt: "दो पोद्दार जल भंडारण टैंक",
    },
    "पोद्दार टैंक?",
    [
      "पीने के पानी के लिए सुरक्षित",
      "100% वर्जिन प्लास्टिक",
      "जीवाणु-रोधी सुरक्षा",
      "शैवाल-रोधी सुरक्षा",
      "कवक-रोधी सुरक्षा",
    ]
  ),
};
