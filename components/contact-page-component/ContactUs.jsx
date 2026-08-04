"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
  FiMessageSquare,
  FiSend,
  FiInfo,
  FiEdit3,
} from "react-icons/fi";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { redirectToThankYou } from "../shared/contactSuccessRedirect";

// Dynamically import the map component with no SSR
const ClientSideMap = dynamic(() => import("./ClientSideMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[420px] w-full bg-[var(--color-surface)] flex items-center justify-center rounded-2xl">
      <p className="text-[var(--color-body)]">Loading map...</p>
    </div>
  ),
});

const FALLBACK_CONTACT = {
  eyebrow: "Contact Us",
  heading: "Connect with",
  address:
    "Plot No 470, Road No 06 (Old 29), DOHS Mirpur, Dhaka Division, Bangladesh",
  phone: "+880 1846-937397",
  email: "info@a2itltd.com",
  mapLat: 23.836236,
  mapLng: 90.358672,
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const InfoBlock = ({ icon, title, children }) => (
  <div className="flex items-start gap-4">
    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-primary)] shadow-sm">
      <span className="text-xl">{icon}</span>
    </div>
    <div>
      <h3 className="text-lg font-bold text-[var(--color-heading)]">
        {title}
      </h3>
      <div className="mt-1 text-[var(--color-body)]">{children}</div>
    </div>
  </div>
);

const FormField = ({
  icon,
  as = "input",
  rows,
  ...props
}) => {
  const Tag = as;
  return (
    <div className="relative border-b border-[var(--color-border)] focus-within:border-[var(--color-primary)] transition-colors">
      <div className="absolute left-0 top-3 text-[var(--color-body)]">
        {icon}
      </div>
      <Tag
        {...props}
        rows={rows}
        className="w-full resize-none bg-transparent py-3 pl-8 pr-2 text-[var(--color-heading)] placeholder-[var(--color-body)] outline-none"
      />
    </div>
  );
};

const ContactUs = () => {
  const router = useRouter();
  const [contact, setContact] = useState(FALLBACK_CONTACT);
  const [position, setPosition] = useState([
    FALLBACK_CONTACT.mapLat,
    FALLBACK_CONTACT.mapLng,
  ]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [siteName, setSiteName] = useState("A2IT Ltd");

  useEffect(() => {
    setIsClient(true);
    let isMounted = true;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/site-settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.settings?.siteName) {
          setSiteName(data.settings.siteName);
        }
      })
      .catch(() => {});

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact-settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.settings) {
          const merged = { ...FALLBACK_CONTACT, ...data.settings };
          setContact(merged);
          setPosition([merged.mapLat, merged.mapLng]);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/send-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();
      if (data.success) {
        redirectToThankYou(router);
        return;
      } else {
        alert("Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[var(--color-primary)]"></div>
          <p className="text-[var(--color-body)]">Loading contact form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Top Info Section */}
      <section className="bg-[var(--color-surface)]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="eyebrow">{contact.eyebrow}</span>
              <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[var(--color-heading)] sm:text-5xl">
                {contact.heading}{" "}
                <span className="text-[var(--color-primary)]">
                  {siteName}
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2"
            >
              <InfoBlock icon={<FiMapPin />} title="Address">
                <p>{contact.address}</p>
              </InfoBlock>

              <InfoBlock icon={<FiPhone />} title="Contact Details">
                <a
                  href={`mailto:${contact.email}`}
                  className="block text-[var(--color-primary)] underline decoration-[var(--color-border)] underline-offset-4 hover:decoration-[var(--color-primary)]"
                >
                  {contact.email}
                </a>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="mt-1 block"
                >
                  {contact.phone}
                </a>
              </InfoBlock>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div
        className="h-24 w-full sm:h-32"
        style={{
          background: `repeating-linear-gradient(135deg, var(--color-ink), var(--color-ink) 2px, var(--color-ink-2) 2px, var(--color-ink-2) 24px)`,
        }}
      />

      {/* Form + Map Section */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="-mt-16 rounded-2xl bg-white p-8 shadow-xl sm:-mt-20 sm:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                icon={<FiUser />}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />

              <FormField
                icon={<FiPhone />}
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
              />

              <FormField
                icon={<FiMail />}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
              />

              <FormField
                icon={<FiInfo />}
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
              />

              <FormField
                icon={<FiEdit3 />}
                as="textarea"
                rows={3}
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you? Feel free to get in touch!"
                required
              />

              <label className="flex items-start gap-3 text-sm text-[var(--color-body)]">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[var(--color-primary)]"
                  required
                />
                <span>
                  I agree that my submitted data is being{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-[var(--color-heading)] underline underline-offset-2 hover:text-[var(--color-primary)]"
                  >
                    collected and stored
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting || !agreed}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <FiSend />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Map */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="-mt-16 overflow-hidden rounded-2xl shadow-xl sm:-mt-20"
          >
            <ClientSideMap
              position={position}
              setPosition={setPosition}
              officeAddress={contact.address}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
