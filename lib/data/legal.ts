import type { LegalSection } from "@/types";

// Ported verbatim from the poddarpipes.com "coming soon" site's Privacy
// Policy (D:\Projects\poddar-pipes-launching-soon\app\privacy-policy\page.tsx,
// "Last updated: August 7, 2026") — same company, same content, just
// re-platformed here. Three corrections applied for consistency with this
// site's already-verified details (see lib/data/offices.ts and Footer.tsx):
// "Poddar Plumbing Systems" -> "Poddar Plumbing System" (singular — verified
// against the company's own press coverage), "3rd Floor" -> "4th Floor", and
// "hello@poddarpipes.com" -> "poddarpipes@gmail.com" (the one verified inbox
// used everywhere else on this site).
export const privacyPolicyIntro: string[] = [
  `We respect your privacy and are committed to protecting it through our compliance with this privacy policy ("Policy"). This Policy describes the types of information we may collect from you or that you may provide ("Personal Information") on the poddarpipes.com website ("Website" or "Service") and any of its related products and services (collectively, "Services"), and our practices for collecting, using, maintaining, protecting, and disclosing that Personal Information. It also describes the choices available to you regarding our use of your Personal Information and how you can access and update it.`,
  `This Policy is a legally binding agreement between you ("User", "you" or "your") and Poddar Plumbing System Pvt. Ltd. (doing business as "Poddar Pipes", "we", "us" or "our"). If you are entering into this Policy on behalf of a business or other legal entity, you represent that you have the authority to bind such entity to this Policy, in which case the terms "User", "you" or "your" shall refer to such entity.`,
  `If you do not have such authority, or if you do not agree with the terms of this Policy, you must not accept this Policy and may not access and use the Website and Services. By accessing and using the Website and Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Policy.`,
  `This Policy does not apply to the practices of companies that we do not own or control, or to individuals that we do not employ or manage.`,
];

export const privacyPolicySections: LegalSection[] = [
  {
    heading: "1. Automatic Collection of Information",
    body: [
      `When you open the Website, our servers automatically record information that your browser sends. This data may include information such as your device's IP address, browser type, and version, operating system type and version, language preferences or the webpage you were visiting before you came to the Website and Services, pages of the Website and Services that you visit, the time spent on those pages, information you search for on the Website, access times and dates, and other statistics.`,
      `Information collected automatically is used only to identify potential cases of abuse and establish statistical information regarding the usage and traffic of the Website and Services. This statistical information is not otherwise aggregated in such a way that would identify any particular User of the system.`,
    ],
  },
  {
    heading: "2. Collection of Personal Information",
    body: [
      `You can access and use the Website and Services without telling us who you are or revealing any information by which someone could identify you as a specific, identifiable individual.`,
      `If, however, you wish to use some of the features offered on the Website, you may be asked to provide certain Personal Information (for example, your name and email address).`,
      `We receive and store any information you knowingly provide to us when you fill any forms on the Website. When required, this information may include the following:`,
      {
        list: [
          "Account details (such as user name, unique user ID, password, etc.)",
          "Contact information (such as email address, phone number, etc.)",
          "Basic personal information (such as name, country of residence, etc.)",
          "Sensitive personal information (such as ethnicity, religious beliefs, mental health, etc.)",
          "Geolocation data of your device (such as latitude and longitude)",
          "Information about other individuals (such as your family members, friends, etc.)",
          "Any other materials you willingly submit to us (such as articles, images, feedback, etc.)",
        ],
      },
      `You can choose not to provide us with your Personal Information, but then you may not be able to take advantage of some of the features on the Website.`,
      `Users who are uncertain about what information is mandatory are welcome to contact us.`,
    ],
  },
  {
    heading: "3. Use and Processing of Collected Information",
    body: [
      `We act as a data controller and a data processor when handling Personal Information, unless we have entered into a data processing agreement with you in which case you would be the data controller and we would be the data processor.`,
      `Our role may also differ depending on the specific situation involving Personal Information.`,
      `We act in the capacity of a data controller when we ask you to submit your Personal Information that is necessary to ensure your access and use of the Website and Services. In such instances, we are a data controller because we determine the purposes and means of the processing of Personal Information.`,
      `We act in the capacity of a data processor in situations when you submit Personal Information through the Website and Services. We do not own, control, or make decisions about the submitted Personal Information, and such Personal Information is processed only in accordance with your instructions. In such instances, the User providing Personal Information acts as a data controller.`,
      `In order to make the Website and Services available to you, or to meet a legal obligation, we may need to collect and use certain Personal Information. If you do not provide the information that we request, we may not be able to provide you with the requested products or services.`,
      `Any of the information we collect from you may be used for the following purposes:`,
      {
        list: [
          "Send product and service updates",
          "Respond to inquiries and offer support",
          "Request user feedback",
          "Improve user experience",
          "Enforce terms and conditions and policies",
          "Protect from abuse and malicious users",
          "Respond to legal requests and prevent harm",
          "Run and operate the Website and Services",
        ],
      },
      `Processing your Personal Information depends on how you interact with the Website and Services, where you are located in the world and if one of the following applies:`,
      {
        list: [
          "You have given your consent for one or more specific purposes.",
          "Provision of information is necessary for the performance of this Policy with you and/or for any pre-contractual obligations thereof.",
          "Processing is necessary for compliance with a legal obligation to which you are subject.",
          "Processing is related to a task that is carried out in the public interest or in the exercise of official authority vested in us.",
          "Processing is necessary for the purposes of the legitimate interests pursued by us or by a third party.",
        ],
      },
      `Note that under some legislations we may be allowed to process information until you object to such processing by opting out, without having to rely on consent or any other of the legal bases.`,
      `In any case, we will be happy to clarify the specific legal basis that applies to the processing, and in particular whether the provision of Personal Information is a statutory or contractual requirement, or a requirement necessary to enter into a contract.`,
    ],
  },
  {
    heading: "4. Disclosure of Information",
    body: [
      `To maintain the highest level of privacy and to protect your Personal Information to the full extent, we do not sell or share your Personal Information with anyone and for any reason.`,
    ],
  },
  {
    heading: "5. Retention of Information",
    body: [
      `We will retain and use your Personal Information for the period necessary to comply with our legal obligations, to enforce our Policy, resolve disputes, and unless a longer retention period is required or permitted by law.`,
      `We may use any aggregated data derived from or incorporating your Personal Information after you update or delete it, but not in a manner that would identify you personally.`,
      `Once the retention period expires, Personal Information shall be deleted.`,
      `Therefore, the right to access, the right to erasure, the right to rectification, and the right to data portability cannot be enforced after the expiration of the retention period.`,
    ],
  },
  {
    heading: "6. Privacy of Children",
    body: [
      `We do not knowingly collect any Personal Information from children under the age of 18.`,
      `If you are under the age of 18, please do not submit any Personal Information through the Website and Services.`,
      `If you have reason to believe that a child under the age of 18 has provided Personal Information to us through the Website and Services, please contact us to request that we delete that child's Personal Information from our Services.`,
      `We encourage parents and legal guardians to monitor their children's Internet usage and to help enforce this Policy by instructing their children never to provide Personal Information through the Website and Services without their permission.`,
      `We also ask that all parents and legal guardians overseeing the care of children take the necessary precautions to ensure that children are instructed to never give out Personal Information when online without their permission.`,
    ],
  },
  {
    heading: "7. Do Not Track Signals",
    body: [
      `Some browsers incorporate a Do Not Track feature that signals to websites you visit that you do not want to have your online activity tracked.`,
      `Tracking is not the same as using or collecting information in connection with a website. For these purposes, tracking refers to collecting personally identifiable information from users who use or visit a website or online service as they move across different websites over time.`,
      `How browsers communicate the Do Not Track signal is not yet uniform.`,
      `As a result, the Website and Services are not yet set up to interpret or respond to Do Not Track signals communicated by your browser.`,
      `Even so, as described in more detail throughout this Policy, we limit our use and collection of your Personal Information.`,
    ],
  },
  {
    heading: "8. Links to Other Resources",
    body: [
      `The Website and Services contain links to other resources that are not owned or controlled by us.`,
      `Please be aware that we are not responsible for the privacy practices of such other resources or third parties.`,
      `We encourage you to be aware when you leave the Website and Services and to read the privacy statements of each and every resource that may collect Personal Information.`,
    ],
  },
  {
    heading: "9. Information Security",
    body: [
      `We secure information you provide on computer servers in a controlled, secure environment, protected from unauthorized access, use, or disclosure.`,
      `We maintain reasonable administrative, technical, and physical safeguards in an effort to protect against unauthorized access, use, modification, and disclosure of Personal Information in our control and custody.`,
      `However, no data transmission over the Internet or wireless network can be guaranteed.`,
      `Therefore, while we strive to protect your Personal Information, you acknowledge that:`,
      {
        list: [
          "There are security and privacy limitations of the Internet which are beyond our control.",
          "The security, integrity, and privacy of any and all information and data exchanged between you and the Website and Services cannot be guaranteed.",
          "Any such information and data may be viewed or tampered with in transit by a third party, despite best efforts.",
        ],
      },
    ],
  },
  {
    heading: "10. Data Breach",
    body: [
      `In the event we become aware that the security of the Website and Services has been compromised or Users' Personal Information has been disclosed to unrelated third parties as a result of external activity, including, but not limited to, security attacks or fraud, we reserve the right to take reasonably appropriate measures, including, but not limited to, investigation and reporting, as well as notification to and cooperation with law enforcement authorities.`,
      `In the event of a data breach, we will make reasonable efforts to notify affected individuals if we believe that there is a reasonable risk of harm to the User as a result of the breach or if notice is otherwise required by law.`,
      `When we do, we will post a notice on the Website.`,
      `In jurisdictions where required, we may also report the breach to relevant authorities in accordance with applicable data protection regulations.`,
    ],
  },
  {
    heading: "11. Changes and Amendments",
    body: [
      `We reserve the right to modify this Policy or its terms related to the Website and Services at any time at our discretion.`,
      `When we do, we will revise the updated date at the bottom of this page, post a notification on the main page of the Website.`,
      `We may also provide notice to you in other ways at our discretion, such as through the contact information you have provided.`,
      `An updated version of this Policy will be effective immediately upon the posting of the revised Policy unless otherwise specified.`,
      `Your continued use of the Website and Services after the effective date of the revised Policy (or such other act specified at that time) will constitute your consent to those changes.`,
      `However, we will not, without your consent, use your Personal Information in a manner materially different than what was stated at the time your Personal Information was collected.`,
    ],
  },
  {
    heading: "12. Acceptance of This Policy",
    body: [
      `You acknowledge that you have read this Policy and agree to all its terms and conditions.`,
      `By accessing and using the Website and Services and submitting your information you agree to be bound by this Policy.`,
      `If you do not agree to abide by the terms of this Policy, you are not authorized to access or use the Website and Services.`,
    ],
  },
  {
    heading: "13. Contacting Us",
    body: [
      `If you have any questions, concerns, or complaints regarding this Policy, the information we hold about you, or if you wish to exercise your rights, we encourage you to contact us using the details below:`,
      `We will attempt to resolve complaints and disputes and make every reasonable effort to honor your wish to exercise your rights as quickly as possible and in any event, within the timescales provided by applicable data protection laws.`,
      `If you believe your concerns have not been adequately addressed, you may escalate the matter to the appropriate data protection authority in your region, in accordance with applicable privacy laws.`,
    ],
  },
];

// Drafted fresh — no Terms & Conditions page exists on the launching-soon
// site to port. Standard-form terms for an informational/catalogue site
// (product info + inquiry forms + newsletter, no online checkout), matched
// in tone and defined-terms ("Website", "Services", "User") to the Privacy
// Policy above so the two read as a pair. NOT reviewed by legal/business —
// flagged as a draft on the page itself.
export const termsOfServiceIntro: string[] = [
  `These Terms of Service ("Terms") govern your access to and use of the poddarpipes.com website ("Website") and any related products, tools, and services (collectively, "Services") provided by Poddar Plumbing System Pvt. Ltd. (doing business as "Poddar Pipes", "we", "us" or "our").`,
  `By accessing or using the Website and Services, you ("User", "you" or "your") agree to be bound by these Terms. If you are using the Website and Services on behalf of a business or other legal entity, you represent that you have the authority to bind that entity, in which case "you" refers to that entity.`,
  `If you do not agree to these Terms, please do not access or use the Website and Services.`,
];

export const termsOfServiceSections: LegalSection[] = [
  {
    heading: "1. Use of the Website",
    body: [
      `The Website and Services are provided for the purpose of sharing information about Poddar Pipes' piping systems, products, manufacturing, and related business activities, and for facilitating inquiries, quote requests, newsletter subscriptions, and similar interactions.`,
      `You agree to use the Website and Services only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use and enjoyment of the Website by, any third party.`,
      `You must not attempt to gain unauthorized access to the Website, the server on which it is hosted, or any server, computer, or database connected to it, and you must not attack the Website via a denial-of-service attack or any similar disruptive means.`,
    ],
  },
  {
    heading: "2. Intellectual Property Rights",
    body: [
      `Unless otherwise stated, we (or our licensors) own the intellectual property rights in the Website and all material on it, including but not limited to text, graphics, logos, product imagery, and the underlying design and code.`,
      `Subject to the license below, all these intellectual property rights are reserved.`,
      `You may view, download for caching purposes only, and print pages from the Website for your own personal, non-commercial use, subject to the restrictions set out below and elsewhere in these Terms.`,
      {
        list: [
          "You must not republish material from this Website without our prior written consent.",
          "You must not sell, rent, or sub-license material from this Website.",
          "You must not reproduce, duplicate, or copy material from this Website for commercial purposes.",
          "You must not use this Website in any way that damages, or may damage, the Website or impair its availability or accessibility.",
        ],
      },
    ],
  },
  {
    heading: "3. Product Information & Accuracy",
    body: [
      `We make reasonable efforts to ensure that product specifications, dimensions, standards references, catalogues, and other technical information on the Website are accurate and up to date.`,
      `However, specifications and availability may change without prior notice, and content on the Website is provided for general informational purposes only. It does not constitute a binding offer, quotation, or warranty of fitness for a particular application.`,
      `For a project-specific quotation, dealer availability, or confirmation of current specifications, please contact us directly through the Contact page before making purchasing or installation decisions.`,
    ],
  },
  {
    heading: "4. Forms, Inquiries & Submissions",
    body: [
      `When you submit information through a form on the Website — including inquiry forms, the newsletter subscription, or any other contact mechanism — you confirm that the information you provide is accurate and that you have the right to provide it.`,
      `You agree not to submit any content that is unlawful, defamatory, misleading, or that infringes the rights of any third party.`,
      `We may use submissions in accordance with our Privacy Policy to respond to your inquiry, provide requested information, or improve our Services.`,
    ],
  },
  {
    heading: "5. Third-Party Links",
    body: [
      `The Website may contain links to third-party websites or resources that are not owned or controlled by us, including news coverage, social media platforms, or partner sites.`,
      `We are not responsible for the content, accuracy, or practices of any linked third-party resource, and inclusion of a link does not imply endorsement.`,
      `You access any third-party website at your own risk and subject to that website's own terms and policies.`,
    ],
  },
  {
    heading: "6. Disclaimer of Warranties",
    body: [
      `The Website and Services are provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, to the fullest extent permitted by applicable law.`,
      `We do not warrant that the Website will be uninterrupted, timely, secure, or error-free, or that any defects will be corrected.`,
      `Nothing in these Terms affects any statutory rights or product warranties that apply to physical products purchased through our dealer network, which are governed separately by the applicable product warranty terms.`,
    ],
  },
  {
    heading: "7. Limitation of Liability",
    body: [
      `To the maximum extent permitted by applicable law, Poddar Plumbing System Pvt. Ltd. shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of, or inability to use, the Website and Services.`,
      `Nothing in these Terms shall exclude or limit liability for death, personal injury, fraud, or any other liability that cannot be excluded or limited under applicable law.`,
    ],
  },
  {
    heading: "8. Indemnification",
    body: [
      `You agree to indemnify and hold us harmless from any claims, losses, liabilities, damages, and expenses (including reasonable legal fees) arising out of your misuse of the Website and Services or your violation of these Terms.`,
    ],
  },
  {
    heading: "9. Governing Law & Jurisdiction",
    body: [
      `These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.`,
      `Subject to applicable law, any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts at Bengaluru, Karnataka.`,
    ],
  },
  {
    heading: "10. Changes to These Terms",
    body: [
      `We reserve the right to modify these Terms at any time at our discretion.`,
      `When we do, we will revise the "Last updated" date at the top of this page. Continued use of the Website and Services after any change constitutes your acceptance of the revised Terms.`,
    ],
  },
  {
    heading: "11. Contact Us",
    body: [
      `If you have any questions about these Terms, please contact us using the details below:`,
    ],
  },
];
