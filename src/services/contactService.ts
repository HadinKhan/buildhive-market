import api from "./api";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const sendContactMessage = async (
  data: ContactFormData
): Promise<ContactResponse> => {
  try {
    const response = await api.post<ContactResponse>("/contact", data);
    return response.data;
  } catch (error: any) {
    console.error("[Contact] Error:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to send contact message"
    );
  }
};

// Frontend validation for contact form
export function validateContactForm(form: ContactFormData): string | null {
  if (!form.name || form.name.trim().length < 2)
    return "Name must be at least 2 characters.";
  if (form.name && form.name.length > 100)
    return "Name cannot exceed 100 characters.";
  if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
    return "Please enter a valid email address.";
  if (!form.subject || form.subject.trim().length < 5)
    return "Subject must be at least 5 characters.";
  if (form.subject && form.subject.length > 200)
    return "Subject cannot exceed 200 characters.";
  if (!form.message || form.message.trim().length < 10)
    return "Message must be at least 10 characters.";
  if (form.message && form.message.length > 2000)
    return "Message cannot exceed 2000 characters.";
  if (form.phone && !/^((\+92|0)?[0-9]{10})$/.test(form.phone))
    return "Phone number must be a valid Pakistani number.";
  return null;
}
