"use client";
import { motion } from "framer-motion";

export default function ExperienceSection() {
  const experiences = [
    {
      id: 1,
      company: "Company Name",
      position: "Position",
      period: "2023 - Present",
      description: "Description of your role and achievements",
    },
    {
      id: 2,
      company: "Previous Company",
      position: "Previous Position",
      period: "2021 - 2023",
      description: "Description of your previous role",
    },
  ];

  return (
    <section
      id="experience"
      className="relative min-h-screen w-full flex items-center justify-center py-20 "
    >
      <div className="max-w-screen-xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-light  mb-12">Experience</h2>
          <h3>làm tương tự link này </h3>
          <a href="https://changelog-magicui.vercel.app/">
            https://changelog-magicui.vercel.app/
          </a>
        </motion.div>

        <div className="space-y-8">
          {experiences.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: exp.id * 0.1 }}
              viewport={{ once: true }}
              className="border-b border-gray-700 pb-8"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-2xl font-semibold ">{exp.position}</h3>
                  <p className="text-gray-400 text-sm">{exp.company}</p>
                </div>
                <span className="text-gray-400 text-sm whitespace-nowrap ml-4">
                  {exp.period}
                </span>
              </div>
              <p className="text-gray-400 mt-4">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
