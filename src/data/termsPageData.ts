export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  listItems?: string[];
}

export const termsPageData = {
  badge: "Legal",
  title: "Terms of Service",
  subtitle:
    "Please review these terms carefully before using BuildHive Market.",
  sections: [
    {
      heading: "1. Acceptance of Terms",
      paragraphs: [
        "By accessing and using BuildHive Market, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.",
      ],
    },
    {
      heading: "2. Use License",
      paragraphs: [
        "Permission is granted to temporarily download one copy of the materials on BuildHive Market for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
      ],
      listItems: [
        "Modify or copy the materials",
        "Use the materials for any commercial purpose or for any public display",
        "Attempt to reverse engineer any software contained on BuildHive Market",
        "Remove any copyright or other proprietary notations from the materials",
        "Transfer the materials to another person or mirror the materials on any other server",
      ],
    },
    {
      heading: "3. Product Information",
      paragraphs: [
        "We strive to provide accurate product descriptions and pricing information. However, we do not warrant that product descriptions, pricing, or other content on our site is accurate, complete, reliable, current, or error-free. If a product offered by BuildHive Market is not as described, your sole remedy is to return it in unused condition.",
      ],
    },
    {
      heading: "4. Account Registration",
      paragraphs: [
        "To access certain features of our service, you may be required to register for an account. You agree to:",
      ],
      listItems: [
        "Provide accurate, current, and complete information during registration",
        "Maintain and promptly update your account information",
        "Maintain the security of your password and accept all risks of unauthorized access",
        "Notify us immediately of any unauthorized use of your account",
      ],
    },
    {
      heading: "5. Orders and Payment",
      paragraphs: [
        "All orders placed through BuildHive Market are subject to acceptance and availability. We reserve the right to refuse any order for any reason. Prices are subject to change without notice. Payment must be received by us prior to our acceptance of an order.",
      ],
    },
    {
      heading: "6. Shipping and Delivery",
      paragraphs: [
        "We will arrange for shipment of ordered products to you. Title and risk of loss pass to you upon our delivery to the carrier. Shipping and delivery dates are estimates only and cannot be guaranteed.",
      ],
    },
    {
      heading: "7. Returns and Refunds",
      paragraphs: [
        "Our return and refund policy allows you to return products within 30 days of receipt for a full refund, provided the products are in their original condition and packaging. Custom-made or personalized items may not be eligible for return.",
      ],
    },
    {
      heading: "8. Limitation of Liability",
      paragraphs: [
        "In no event shall BuildHive Market or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on BuildHive Market's website.",
      ],
    },
    {
      heading: "9. Privacy",
      paragraphs: [
        "Your use of BuildHive Market is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices.",
      ],
    },
    {
      heading: "10. Modifications to Terms",
      paragraphs: [
        "BuildHive Market may revise these Terms of Service at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these Terms of Service.",
      ],
    },
    {
      heading: "11. Contact Information",
      paragraphs: [
        "If you have any questions about these Terms of Service, please contact us at:",
      ],
    },
  ] as LegalSection[],
  contact: {
    email: "support@buildhive.com",
    phone: "+92 300 1234567",
    address: "Islamabad, Pakistan",
  },
};
