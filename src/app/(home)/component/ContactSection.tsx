"use client";
import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative min-h-screen w-full flex items-center justify-center py-20 "
    >
      <div className="max-w-screen-xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-6xl font-light  mb-8">
            Get In Touch
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Have a project in mind? Let's work together to create something
            amazing.
          </p>
          <h3>
            phần này chứa form đẻ người dùng có thể gửi tin nhắn đến gmail của
            bn và chứa thông tin các mạng xả hội của bn như zalo fb ....
          </h3>

          <motion.a
            href="mailto:your-email@example.com"
            whileHover={{ scale: 1.05 }}
            className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Send Me an Email
          </motion.a>

          <div className="mt-16 flex justify-center gap-8">
            <a
              href="#"
              className="text-gray-400 hover: transition-colors text-sm"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-gray-400 hover: transition-colors text-sm"
            >
              Twitter/X
            </a>
            <a
              href="#"
              className="text-gray-400 hover: transition-colors text-sm"
            >
              Instagram
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
