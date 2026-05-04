// All settings data in one place
export const settingsPageData = {
  sections: {
    notifications: {
      title: "Notifications",
      subtitle: "Control how and when we contact you",
      tone: "purple" as const,
    },
    privacy: {
      title: "Privacy",
      subtitle: "Manage data sharing and visibility",
      tone: "green" as const,
    },
    preferences: {
      title: "Preferences",
      subtitle: "Customize app behavior and display",
      tone: "blue" as const,
    },
    security: {
      title: "Security",
      subtitle: "Protect your account and data",
      tone: "orange" as const,
    },
    data: {
      title: "Data & Export",
      subtitle: "Manage your data and account",
      tone: "purple" as const,
    },
  },

  defaults: {
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: true,
      priceDrop: true,
    },
    privacy: {
      shareWithSuppliers: false,
      publicProjects: false,
      analytics: true,
      thirdPartyCookies: false,
    },
    preferences: {
      defaultCity: "lahore",
      currency: "pkr",
      language: "en",
      unitSystem: "metric",
      compactView: false,
      autoRefresh: true,
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      biometric: false,
      sessionTimeout: true,
    },
  },

  options: {
    cities: [
      { value: "lahore", label: "Lahore" },
      { value: "karachi", label: "Karachi" },
      { value: "islamabad", label: "Islamabad" },
      { value: "rawalpindi", label: "Rawalpindi" },
      { value: "faisalabad", label: "Faisalabad" },
      { value: "multan", label: "Multan" },
      { value: "peshawar", label: "Peshawar" },
      { value: "quetta", label: "Quetta" },
    ],
    currencies: [
      { value: "pkr", label: "Pakistani Rupee (₨)" },
      { value: "usd", label: "US Dollar ($)" },
      { value: "aed", label: "UAE Dirham (د.إ)" },
      { value: "sar", label: "Saudi Riyal (﷼)" },
    ],
    languages: [
      { value: "en", label: "English" },
      { value: "ur", label: "اردو" },
    ],
    unitSystems: [
      { value: "metric", label: "Metric (kg, m²)" },
      { value: "imperial", label: "Imperial (lb, sq ft)" },
    ],
  },
};
