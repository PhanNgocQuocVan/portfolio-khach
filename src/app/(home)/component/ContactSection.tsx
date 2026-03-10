"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, ChevronRight, Star, CheckCircle2 } from "lucide-react";
import emailjs from "@emailjs/browser";

// ─── EmailJS config ─────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = "service_9jb3a16";
const EMAILJS_TEMPLATE_NOTIFY = "template_j4hy3r7"; // thông báo về bạn
const EMAILJS_TEMPLATE_THANKYOU = "template_wrzx4fj"; // cảm ơn khách
const EMAILJS_PUBLIC_KEY = "SEFA3GnZWjYcFqLRp";

// ─── Slides data ───────────────────────────────────────────────────────────────
const slides = [
  {
    image:
      "https://truongthang.vn/wp-content/uploads/2025/04/goi-y-noi-that-phong-khach-rong-cho-nha-them-sang-va-dep-3-1.jpg",
    quote:
      "Annie has a rare talent for turning a simple brief into a spatial narrative. Her attention to detail and ability to evoke emotion through interior design is truly exceptional.",
    author: "Ellie Simpson",
    role: "Head of Design, Sisyphus Labs",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    quote:
      "The attention to detail and quality of work exceeded all expectations. Our project was delivered on time and the results speak for themselves.",
    author: "James Carter",
    role: "CEO, Momentum Studio",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    quote:
      "A truly transformative experience. The team understood our vision perfectly and brought it to life in ways we couldn't have imagined.",
    author: "Sarah Nguyen",
    role: "Product Lead, Arclight Co.",
  },
];

// ─── Zod Schema ────────────────────────────────────────────────────────────────
const contactSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "At least 2 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "At least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\d\s\+\-\(\)]{7,20}$/, "Invalid phone number"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "At least 10 characters")
    .max(1000, "Max 1000 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

// ─── FieldError ────────────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
      <span>⚠</span> {message}
    </p>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitError(null);

    // Các biến template dùng chung
    const templateParams = {
      first_name: data.firstName,
      last_name: data.lastName,
      full_name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      message: data.message,
      reply_to: data.email,
    };

    try {
      // Gửi song song cả 2 email
      await Promise.all([
        // 1. Thông báo về bạn
        emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_NOTIFY,
          templateParams,
          EMAILJS_PUBLIC_KEY,
        ),
        // 2. Cảm ơn khách
        emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_THANKYOU,
          templateParams,
          EMAILJS_PUBLIC_KEY,
        ),
      ]);

      setSubmitted(true);
      reset();
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitError("Failed to send message. Please try again later.");
    }
  };

  const inputClass = (hasError: boolean) =>
    [
      "w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 transition-all",
      // light
      "bg-white/20 text-black placeholder:text-black/70 backdrop-blur-sm",
      // dark
      "",
      // border & ring
      hasError
        ? "border-red-400 focus:ring-red-300 dark:border-red-500 dark:focus:ring-red-500/40"
        : "border-white/40 focus:ring-white focus:border-transparent",
    ].join(" ");

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-20
        bg-[#1e2d25]
        transition-colors duration-300"
    >
      <div className="max-w-2xl mx-auto px-6 mb-16 text-white">
        <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-center mb-12 font-palatino">
          Get in Touch
        </h2>
        <p className="text-center max-w-2xl mx-auto">
          Whether you have a specific project in mind or just want to say hi, my
          inbox is always open. Let's create something timeless
        </p>
      </div>
      <div className="max-w-screen-xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden flex shadow-xl dark:shadow-black/50
            bg-white dark:bg-gray-900
            transition-colors duration-300"
          style={{ minHeight: 520 }}
        >
          {/* ── Left: Form ── */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col bg-[#c4a262]">
            {/* Heading */}
            <h2 className="text-3xl font-semibold mb-2 text-gray-900 dark:text-black">
              Let's work together
            </h2>
            <p className="text-sm mb-6 text-black/90">
              Have a project in mind? Tell me more about it and let's start a
              conversation.
            </p>

            {/* ── Success State ── */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center gap-3"
              >
                <CheckCircle2 size={48} className="text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 ">
                  Message sent!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Thanks for reaching out. We'll be in touch within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-sm underline text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-black"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              /* ── Form ── */
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 flex-1"
                noValidate
              >
                {/* First / Last name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-1 text-black"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      placeholder="First name"
                      className={inputClass(!!errors.firstName)}
                      {...register("firstName")}
                    />
                    <FieldError message={errors.firstName?.message} />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-1 text-black"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      placeholder="Last name"
                      className={inputClass(!!errors.lastName)}
                      {...register("lastName")}
                    />
                    <FieldError message={errors.lastName?.message} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1 text-black"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className={inputClass(!!errors.email)}
                    {...register("email")}
                  />
                  <FieldError message={errors.email?.message} />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-1 text-black"
                  >
                    Phone number
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        id="phone"
                        placeholder="555-000-0000"
                        className={inputClass(!!errors.phone)}
                        {...register("phone")}
                      />
                    </div>
                  </div>
                  <FieldError message={errors.phone?.message} />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1 text-black"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Leave us a message..."
                    rows={4}
                    className={`${inputClass(!!errors.message)} resize-none`}
                    {...register("message")}
                  />
                  <FieldError message={errors.message?.message} />
                </div>

                {/* Error message */}
                {submitError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    ⚠ {submitError}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 text-sm font-medium rounded-md transition-colors
                    disabled:opacity-60 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                    bg-[#1e2d25] hover:bg-[#2d4a38] text-white"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send message"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ── Right: Image + Testimonial ── */}
          <div className="hidden md:flex md:w-1/2 relative flex-col">
            <div className="absolute inset-0 overflow-hidden">
              {slides.map((slide, i) => (
                <img
                  key={i}
                  src={slide.image}
                  alt="background"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                  style={{ opacity: i === current ? 1 : 0 }}
                />
              ))}
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Testimonial */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <div
                className="relative overflow-hidden"
                style={{ minHeight: "72px" }}
              >
                {slides.map((slide, i) => (
                  <div
                    key={i}
                    className="transition-all duration-500"
                    style={{
                      opacity: i === current ? 1 : 0,
                      position: i === current ? "relative" : "absolute",
                      inset: 0,
                      transform:
                        i === current ? "translateY(0)" : "translateY(8px)",
                    }}
                  >
                    <p className="text-white text-sm font-medium leading-relaxed mb-3">
                      {slide.quote}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-semibold">
                    — {slides[current].author}
                  </p>
                  <p className="text-white/60 text-xs">
                    {slides[current].role}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1 items-center">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className="rounded-full bg-white transition-all duration-300"
                        style={{
                          width: i === current ? "20px" : "6px",
                          height: "6px",
                          opacity: i === current ? 1 : 0.4,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={prev}
                      className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <ChevronLeft size={14} className="text-white" />
                    </button>
                    <button
                      onClick={next}
                      className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <ChevronRight size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
