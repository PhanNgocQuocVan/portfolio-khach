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
const EMAILJS_TEMPLATE_NOTIFY = "template_j4hy3r7";
const EMAILJS_TEMPLATE_THANKYOU = "template_wrzx4fj";
const EMAILJS_PUBLIC_KEY = "SEFA3GnZWjYcFqLRp";

// ─── Slides data ───────────────────────────────────────────────────────────────
const slides = [
  {
    image:
      "https://truongthang.vn/wp-content/uploads/2025/04/goi-y-noi-that-phong-khach-rong-cho-nha-them-sang-va-dep-3-1.jpg",
    quote:
      "Thi Tu Anh stands out for her strong attention to detail and her ability to manage multiple tasks with precision and reliability. She communicates clearly with different teams and adapts quickly when working with international markets. Responsible and proactive, she approaches every project with a strong willingness to learn and continuously improve.",
    author: "Anna D",
    role: "Senior Merchandising Project Manager, Coty – Gucci Beauty",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    quote:
      "Throughout her internship, Thi Tu Anh showed great creativity and technical ability. She produced precise execution drawings and high-quality 3D models while maintaining a proactive and reliable attitude. She proved to be a dependable designer, capable of contributing effectively to real projects and collaborating smoothly within the team.",
    author: "Axelle D",
    role: "Interior Architect & Project Manager, Morning",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    quote:
      "Thi Tu Anh quickly demonstrated strong professional skills and a proactive mindset. She integrates rapidly into a team, communicates effectively, and approaches each project with creativity and responsibility. Her ability to understand project requirements and translate them into clear design solutions made her a valuable contributor during her time with us.",
    author: "Thu Hang B",
    role: "CEO, Le Vin Decor",
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
    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5">
      <span className="opacity-80">⚠</span> {message}
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
      await Promise.all([
        emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_NOTIFY,
          templateParams,
          EMAILJS_PUBLIC_KEY,
        ),
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

  // Input: light mode nền trắng; dark mode zinc-800
  const inputClass = (hasError: boolean) =>
    [
      "w-full px-3.5 py-2.5 text-sm rounded-lg border transition-all duration-200 focus:outline-none",
      // Light: nền trắng, text đậm, placeholder đủ contrast
      "bg-white text-zinc-900 placeholder:text-zinc-400",
      // Dark: zinc-800 sáng hơn panel
      "dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500",
      // Border: zinc-300 thay vì zinc-200 — đủ contrast WCAG 3:1 cho UI component
      hasError
        ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)] dark:border-red-500/70 dark:focus:border-red-400"
        : "border-zinc-300 focus:border-zinc-500 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] dark:border-zinc-600 dark:focus:border-zinc-400 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)]",
    ].join(" ");

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 md:py-20 transition-colors duration-300"
    >
      {/* Section header */}
      <div className="max-w-2xl mx-auto px-4 md:px-6 mb-10 md:mb-16">
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-center mb-6 md:mb-12 font-palatino text-foreground">
          Get in Touch
        </h2>
        <p className="text-center text-sm md:text-base max-w-2xl mx-auto text-foreground/60">
          Whether you have a specific project in mind or just want to say hi, my
          inbox is always open. Let's create something timeless
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl
            border border-zinc-200 dark:border-white/[0.07]"
          style={{ minHeight: 520 }}
        >
          {/* ── Left: Form panel ── */}
          {/* 
            Dùng gradient từ #0f0f0f → #171717 thay vì màu đen đặc thuần túy
            Tạo cảm giác depth và không bị "dead black"
          */}
          {/* Light: zinc-50 bg / Dark: warm black gradient via inline style set by CSS var trick */}
          <div
            className="w-full md:w-1/2 p-6 md:p-10 flex flex-col relative
              bg-zinc-50 dark:[background:linear-gradient(145deg,#0f0f0f_0%,#161616_60%,#1a1818_100%)]"
          >
            {/* Thin accent line top */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(128,128,128,0.2) 40%, transparent)",
              }}
            />

            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-semibold mb-1.5 tracking-tight text-zinc-900 dark:text-zinc-50">
              Let's work together
            </h2>
            <p className="text-sm mb-7 leading-relaxed text-zinc-500 dark:text-zinc-500">
              Have a project in mind? Tell me more about it and let's start a
              conversation.
            </p>

            {/* Divider */}
            <div className="h-px mb-7 bg-gradient-to-r from-zinc-200 via-zinc-200/50 to-transparent dark:from-zinc-700/60 dark:via-zinc-600/30" />

            {/* ── Success State ── */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex-1 flex flex-col items-center justify-center text-center gap-4"
              >
                {/* Success icon với ring animation */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
                  <CheckCircle2
                    size={48}
                    className="text-emerald-400 relative z-10"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-zinc-900 dark:text-zinc-100">
                    Message sent!
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Thanks for reaching out. I'll be in touch within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-1 text-xs underline underline-offset-4 transition-colors text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
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
                      className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
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
                      className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
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
                    className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
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
                    className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
                  >
                    Phone number
                  </label>
                  <input
                    id="phone"
                    placeholder="555-000-0000"
                    className={inputClass(!!errors.phone)}
                    {...register("phone")}
                  />
                  <FieldError message={errors.phone?.message} />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Tell me about your project..."
                    rows={4}
                    className={`${inputClass(!!errors.message)} resize-none`}
                    {...register("message")}
                  />
                  <FieldError message={errors.message?.message} />
                </div>

                {/* Error */}
                {submitError && (
                  <p
                    className="text-xs rounded-lg px-3.5 py-2.5
                    text-red-600 bg-red-50 border border-red-200
                    dark:text-red-400 dark:bg-red-950/40 dark:border-red-800/40"
                  >
                    ⚠ {submitError}
                  </p>
                )}

                {/* Submit button — off-black ấm (#1c1917 = stone-950) thay vì pure black */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2 active:scale-[0.99]
                    text-white hover:opacity-90
                    dark:text-stone-950 dark:hover:opacity-90"
                  style={{
                    // Light: off-black ấm (stone-950 hơi nâu) — dịu hơn pure black
                    background: "var(--btn-bg, #1c1917)",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      document.documentElement.classList.contains("dark")
                        ? "#f5f5f4"
                        : "#292524";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      document.documentElement.classList.contains("dark")
                        ? "#fafaf9"
                        : "#1c1917";
                  }}
                  ref={(el) => {
                    if (!el) return;
                    const update = () => {
                      const isDark =
                        document.documentElement.classList.contains("dark");
                      // Dark mode: stone-50 (#fafaf9) — trắng ấm, không lạnh
                      el.style.background = isDark ? "#fafaf9" : "#1c1917";
                      el.style.color = isDark ? "#1c1917" : "#ffffff";
                    };
                    update();
                    const observer = new MutationObserver(update);
                    observer.observe(document.documentElement, {
                      attributes: true,
                      attributeFilter: ["class"],
                    });
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white dark:text-zinc-700"
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
                    "Send message →"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ── Right: Image + Testimonial ── */}
          <div className="hidden md:flex md:w-1/2 relative flex-col">
            {/* Background images */}
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
              {/* Multi-layer overlay: rich depth thay vì chỉ 1 lớp đơn */}
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0" />
            </div>

            {/* Testimonial block */}
            <div className="absolute bottom-0 left-0 right-0 p-7">
              {/* Glassmorphism card */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: "rgba(10, 10, 10, 0.55)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <div
                  className="relative overflow-hidden"
                  style={{ minHeight: "80px" }}
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
                          i === current ? "translateY(0)" : "translateY(10px)",
                      }}
                    >
                      <p className="text-zinc-200 text-xs leading-relaxed mb-4 font-light">
                        "{slide.quote}"
                      </p>
                    </div>
                  ))}
                </div>

                {/* Author + Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <p className="text-white text-xs font-semibold tracking-wide">
                      — {slides[current].author}
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      {slides[current].role}
                    </p>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center gap-3">
                    {/* Dots */}
                    <div className="flex gap-1 items-center">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrent(i)}
                          className="rounded-full bg-white transition-all duration-300"
                          style={{
                            width: i === current ? "18px" : "5px",
                            height: "5px",
                            opacity: i === current ? 0.9 : 0.3,
                          }}
                        />
                      ))}
                    </div>
                    {/* Arrow buttons */}
                    <div className="flex gap-1.5">
                      <button
                        onClick={prev}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150
                          hover:bg-white/15 active:scale-95"
                        style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                      >
                        <ChevronLeft size={13} className="text-white" />
                      </button>
                      <button
                        onClick={next}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150
                          hover:bg-white/15 active:scale-95"
                        style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                      >
                        <ChevronRight size={13} className="text-white" />
                      </button>
                    </div>
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
