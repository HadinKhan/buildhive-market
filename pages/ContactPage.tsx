import React, { useState } from "react";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";

import {
  sendContactMessage,
  ContactFormData,
  validateContactForm,
} from "../src/services/contactService";

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    // Frontend validation
    const validationError = validateContactForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await sendContactMessage(form);
      setSuccess("Your message has been sent!");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (err: any) {
      setError(err?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className="bg-slate-900 py-16 text-center text-white">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">Get in Touch</h1>
        <p className="text-slate-400">
          We'd love to hear from you. Here is how you can reach us.
        </p>
      </div>

      <div className="container mx-auto px-4 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Send us a Message
              </h2>
              <p className="text-gray-500">
                Have a question about a product, order, or partnership? Fill out
                the form below.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {success && (
                <div className="rounded bg-green-100 text-green-700 p-3">
                  {success}
                </div>
              )}
              {error && (
                <div className="rounded bg-red-100 text-red-700 p-3">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+92 300 ..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  aria-label="Subject"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                >
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Bulk Purchase</option>
                  <option>Become a Supplier</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                ></textarea>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:pl-12">
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icons.MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Our Office</h3>
                    <p className="mt-1 text-gray-500 leading-relaxed">
                      123 Construction Avenue, Industrial Zone,
                      <br />
                      Lahore, Pakistan
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icons.Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Phone</h3>
                    <p className="mt-1 text-gray-500">
                      +92 300 1234567
                      <br />
                      +92 42 111 222 333
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icons.Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Email</h3>
                    <p className="mt-1 text-gray-500">
                      support@buildhive.pk
                      <br />
                      sales@buildhive.pk
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icons.Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Business Hours</h3>
                    <p className="mt-1 text-gray-500">
                      Monday - Saturday: 9:00 AM - 8:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Follow Us
              </h3>
              <div className="flex gap-4">
                {[
                  { icon: Icons.Facebook, name: "Facebook" },
                  { icon: Icons.Twitter, name: "Twitter" },
                  { icon: Icons.Linkedin, name: "LinkedIn" },
                  { icon: Icons.Instagram, name: "Instagram" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    title={`Follow us on ${social.name}`}
                    aria-label={`Follow us on ${social.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-primary hover:bg-primary hover:text-white"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
