// Type definitions
export interface FormData {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  notes: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  desc: string;
}

// Initial form data
export const INITIAL_FORM_DATA: FormData = {
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "Pakistan",
  notes: "",
};

// Payment methods configuration
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "cod",
    name: "Cash on Delivery",
    desc: "Pay when you receive your order",
  },
  {
    id: "card",
    name: "Credit / Debit Card",
    desc: "Secure payment via Stripe",
  },
];

// Form field configuration
export const CHECKOUT_FORM_FIELDS = {
  CONTACT_SECTION: {
    title: "Contact Information",
    fields: [
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "john@example.com",
        required: true,
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "0300 1234567",
        required: true,
      },
    ],
  },
  SHIPPING_SECTION: {
    title: "Shipping Address",
    fields: [
      {
        name: "full_name",
        label: "Full Name",
        type: "text",
        placeholder: "John Doe",
        required: true,
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "0300 1234567",
        required: true,
      },
      {
        name: "address_line1",
        label: "Street Address",
        type: "text",
        placeholder: "House # 123, Street Name",
        required: true,
      },
      {
        name: "address_line2",
        label: "Apartment, Suite, etc. (optional)",
        type: "text",
        placeholder: "Apartment 4B",
        required: false,
      },
      {
        name: "city",
        label: "City",
        type: "text",
        placeholder: "Karachi",
        required: true,
      },
      {
        name: "state",
        label: "State/Province",
        type: "text",
        placeholder: "Sindh",
        required: true,
      },
      {
        name: "postal_code",
        label: "Postal Code",
        type: "text",
        placeholder: "75500",
        required: true,
      },
      {
        name: "notes",
        label: "Order Notes (optional)",
        type: "textarea",
        placeholder: "Any special instructions for delivery...",
        required: false,
      },
    ],
  },
};

// Required fields for validation
export const REQUIRED_FIELDS = [
  "full_name",
  "phone",
  "address_line1",
  "city",
  "state",
  "postal_code",
];

// Tax rate
export const TAX_RATE = 0.05;

// Breadcrumb links
export const BREADCRUMB_LINKS = [
  { label: "Cart", page: "cart" },
  { label: "Checkout", active: true },
  { label: "Confirmation" },
];
