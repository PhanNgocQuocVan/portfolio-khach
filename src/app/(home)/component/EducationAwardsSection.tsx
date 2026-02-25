"use client";
import { motion } from "framer-motion";

export default function EducationAwardsSection() {
  const educationAwards = [
    {
      id: 1,
      type: "Education",
      title: "Degree or Certification",
      institution: "University/School Name",
      year: "2020",
    },
    {
      id: 2,
      type: "Award",
      title: "Award Name",
      organization: "Organization Name",
      year: "2022",
    },
  ];

  return (
    <section
      id="Education&Awards"
      className="relative min-h-screen w-full flex items-center justify-center py-20 "
    >
      <div className="max-w-screen-xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-light  mb-12">
            Education & Awards
          </h2>
          <h3>phần này chứa các chứng chỉ , bằng cấp của bn</h3>
          <a href="https://www.jolyui.dev/docs/components/surfaces/bento-grid">
            https://www.jolyui.dev/docs/components/surfaces/bento-grid
          </a>
        </motion.div>

        <div className="space-y-8">
          {educationAwards.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: item.id * 0.1 }}
              viewport={{ once: true }}
              className="border-l-2 border-gray-700 pl-6"
            >
              <span className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                {item.type}
              </span>
              <h3 className="text-2xl font-semibold  mb-1">{item.title}</h3>
              <p className="text-gray-400 mb-2">
                {item.institution || item.organization}
              </p>
              <p className="text-gray-500 text-sm">{item.year}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
