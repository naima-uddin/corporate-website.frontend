"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiUser, FiMessageSquare, FiSend } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { redirectToThankYou } from "./contactSuccessRedirect";

const ContactFormCard = ({
  subject = "Service Inquiry",
  title = "Interested in this service?",
  subtitle = "Send us a message and our team will get back to you shortly.",
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/send-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            type: "service_inquiry",
            subject,
          }),
        },
      );

      const data = await res.json();
      if (data.success) {
        redirectToThankYou(router);
        return;
      }
      alert("Failed to send message.");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-xl border border-[var(--color-border)] bg-white shadow-sm overflow-hidden"
    >
      <div className="px-6 sm:px-8 py-6 border-b border-[var(--color-border)]">
        <h3 className="text-xl font-bold text-[var(--color-heading)]">{title}</h3>
        <p className="mt-1 text-sm text-[var(--color-body)]">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-[var(--color-heading)]">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-primary)]">
                <FiUser />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="pl-10 w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-heading)]">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-primary)]">
                <FiMail />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="pl-10 w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-heading)]">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-primary)]">
              <FiPhone />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+880 1234 567890"
              className="pl-10 w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="message" className="block text-sm font-medium text-[var(--color-heading)]">
            Your Message
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 text-[var(--color-primary)]">
              <FiMessageSquare />
            </div>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about your project..."
              className="pl-10 w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all"
              required
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-70"
        >
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              <FiSend className="inline mr-2" />
              Send Message
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ContactFormCard;
