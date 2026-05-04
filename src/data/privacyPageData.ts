export interface PrivacySection {
  heading: string;
  paragraphs?: string[];
  subSections?: Array<{
    heading: string;
    listItems: string[];
  }>;
  listItems?: string[];
}

export const privacyPageData = {
  badge: "Legal",
  title: "Privacy Policy",
  subtitle:
    "Learn how BuildHive Market collects, uses, and protects your information.",
  sections: [
    {
      heading: "1. Information We Collect",
      paragraphs: [
        "At BuildHive Market, we collect several types of information to provide and improve our services:",
      ],
      subSections: [
        {
          heading: "Personal Information",
          listItems: [
            "Name, email address, and phone number",
            "Billing and shipping addresses",
            "Payment information (processed securely through third-party payment processors)",
            "Account credentials",
            "Profile picture (optional)",
          ],
        },
        {
          heading: "Usage Information",
          listItems: [
            "Browsing history on our website",
            "Search queries and product views",
            "Purchase history and order details",
            "Device information and IP address",
            "Cookies and similar tracking technologies",
          ],
        },
      ],
    },
    {
      heading: "2. How We Use Your Information",
      paragraphs: ["We use the information we collect for various purposes:"],
      listItems: [
        "Process and fulfill your orders",
        "Communicate with you about your orders and account",
        "Provide customer support and respond to inquiries",
        "Send promotional emails and marketing communications (with your consent)",
        "Improve our website, products, and services",
        "Detect and prevent fraud and abuse",
        "Comply with legal obligations",
        "Analyze usage patterns and optimize user experience",
      ],
    },
    {
      heading: "3. Information Sharing and Disclosure",
      paragraphs: [
        "We do not sell your personal information to third parties. We may share your information in the following circumstances:",
      ],
      listItems: [
        "Service Providers: We share information with trusted third-party service providers who assist us in operating our website, processing payments, and delivering products.",
        "Legal Requirements: We may disclose information when required by law or to protect our rights, property, or safety.",
        "Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.",
        "With Your Consent: We may share information with third parties when you give us explicit permission to do so.",
      ],
    },
    {
      heading: "4. Data Security",
      paragraphs: [
        "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:",
        "However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security.",
      ],
      listItems: [
        "Encryption of sensitive data in transit and at rest",
        "Regular security audits and vulnerability assessments",
        "Restricted access to personal information on a need-to-know basis",
        "Secure payment processing through PCI-DSS compliant providers",
      ],
    },
    {
      heading: "5. Your Rights and Choices",
      paragraphs: [
        "You have several rights regarding your personal information:",
        "To exercise any of these rights, please contact us at privacy@buildhive.com.",
      ],
      listItems: [
        "Access: Request a copy of the personal information we hold about you",
        "Correction: Update or correct inaccurate personal information",
        "Deletion: Request deletion of your personal information (subject to legal obligations)",
        "Opt-out: Unsubscribe from marketing communications at any time",
        "Data Portability: Request a copy of your data in a machine-readable format",
        "Object: Object to processing of your personal information for certain purposes",
      ],
    },
    {
      heading: "6. Cookies and Tracking Technologies",
      paragraphs: [
        "We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookies through your browser settings, but please note that disabling cookies may affect the functionality of our website.",
        "Types of cookies we use:",
      ],
      listItems: [
        "Essential Cookies: Required for basic website functionality",
        "Performance Cookies: Help us understand how visitors use our website",
        "Functional Cookies: Remember your preferences and settings",
        "Marketing Cookies: Track your browsing to deliver relevant advertisements",
      ],
    },
    {
      heading: "7. Third-Party Links",
      paragraphs: [
        "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.",
      ],
    },
    {
      heading: "8. Children's Privacy",
      paragraphs: [
        "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 13, we will take steps to delete that information promptly.",
      ],
    },
    {
      heading: "9. Changes to This Privacy Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the new policy on this page and updating the Last updated date.",
      ],
    },
    {
      heading: "10. Contact Us",
      paragraphs: [
        "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:",
      ],
    },
  ] as PrivacySection[],
  contact: {
    email: "privacy@buildhive.com",
    phone: "+92 300 1234567",
    address: "Islamabad, Pakistan",
  },
};
