import type { ShowcaseCategory } from "@/lib/data/productShowcase";
import type { Overlay } from "@/lib/i18n/localize";

// Hindi overlay for lib/data/productShowcase.ts (keyed by range id). Only the
// visible / SEO copy is translated; the pill `label` (CPVC, uPVC, AGRI, SWR,
// UGD, TANK), images and layout values stay as they are. `metaTitle` goes
// through the "%s | पोद्दार पाइप्स" template.
export const productShowcaseHi: Overlay<ShowcaseCategory> = {
  "cpvc-pipes": {
    metaTitle: "गर्म और ठंडे पानी के लिए CPVC पाइप्स और फिटिंग्स",
    metaDescription:
      "पोद्दार CPVC पाइप्स और फिटिंग्स: घरों और इमारतों में गर्म और ठंडे पानी के वितरण के लिए संक्षारण-मुक्त पाइपिंग।",
    h1: "पोद्दार CPVC पाइप्स और फिटिंग्स",
    tagline: "गर्म और ठंडे पानी के लिए संक्षारण-मुक्त पाइपिंग।",
    photoAlt: "गहरे स्टूडियो बैकड्रॉप पर तीन पोद्दार CPVC पाइप्स",
  },
  "upvc-pipes": {
    metaTitle: "ठंडे पानी की प्लंबिंग के लिए uPVC पाइप्स और फिटिंग्स",
    metaDescription:
      "पोद्दार uPVC पाइप्स: ठंडे पानी की प्लंबिंग, जल आपूर्ति और जल निकासी के लिए लेड-फ्री, जंग-मुक्त पाइपिंग।",
    h1: "पोद्दार uPVC पाइप्स और फिटिंग्स",
    tagline: "रोज़मर्रा की जल आपूर्ति के लिए टिकाऊ पाइप्स।",
    photoAlt: "गहरे स्टूडियो बैकड्रॉप पर तीन पोद्दार uPVC पाइप्स",
  },
  "agricultural-pipes": {
    metaTitle: "कृषि के लिए uPVC प्रेशर पाइप्स",
    metaDescription:
      "पोद्दार Agri: विशेष रूप से कृषि जल आपूर्ति के लिए बनाए गए लेड-फ्री uPVC प्रेशर पाइप्स।",
    h1: "पोद्दार कृषि uPVC प्रेशर पाइप्स",
    tagline: "कृषि के लिए कुशल जल आपूर्ति।",
    photoAlt: "गहरे स्टूडियो बैकड्रॉप पर पोद्दार कृषि पाइप्स",
  },
  "swr-pipes": {
    metaTitle: "SWR जल निकासी पाइप्स और फिटिंग्स",
    metaDescription:
      "पोद्दार SWR पाइप्स और फिटिंग्स मल, अपशिष्ट जल और वर्षा जल ले जाते हैं, रिंग जॉइंट और सॉल्वेंट जॉइंट विकल्पों के साथ।",
    h1: "पोद्दार SWR जल निकासी पाइप्स और फिटिंग्स",
    tagline: "मल, अपशिष्ट और वर्षा जल की सुचारु निकासी।",
    photoAlt: "गहरे स्टूडियो बैकड्रॉप पर पोद्दार SWR जल निकासी पाइप्स",
  },
  "ugd-pipes": {
    metaTitle: "UGD भूमिगत जल निकासी पाइप्स",
    metaDescription:
      "गैर-दबाव भूमिगत जल निकासी और सीवर लाइनों के लिए पोद्दार UGD तीन-परत फोम-कोर uPVC पाइप्स।",
    h1: "पोद्दार UGD भूमिगत जल निकासी पाइप्स",
    tagline: "कुशल भूमिगत जल निकासी के लिए निर्मित।",
    photoAlt: "गहरे स्टूडियो बैकड्रॉप पर पोद्दार भूमिगत जल निकासी पाइप्स",
  },
  tanks: {
    metaTitle: "जल भंडारण टैंक — 3 और 4 परत",
    metaDescription:
      "पोद्दार Tank गोल्ड तीन- और चार-परत वाले जल भंडारण टैंक, जो संग्रहित पानी की सुरक्षा के लिए बनाए गए हैं।",
    h1: "पोद्दार जल भंडारण टैंक",
    tagline: "हर बूंद के लिए सुरक्षित, टिकाऊ भंडारण।",
    photoAlt: "गहरे स्टूडियो बैकड्रॉप पर दो सफ़ेद पोद्दार जल भंडारण टैंक",
  },
};
