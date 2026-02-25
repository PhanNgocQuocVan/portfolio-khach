"use client";
import { motion } from "framer-motion";

export default function ProjectsSection() {
  const projects = [
    {
      id: 1,
      title: "Project One",
      description: "Description of your first project",
      image: "/images/project-1.jpg",
    },
    {
      id: 2,
      title: "Project Two",
      description: "Description of your second project",
      image: "/images/project-2.jpg",
    },
  ];

  return (
    <section
      id="projects"
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
            Selected Projects
          </h2>
          <h3>
            phần này sẽ có thanh dock như kiểu macbook chứa các icon phần mềm
            cuản bn sau khi chọn 1 phần mềm thì các pj có dùng phàn mềm đó sẽ
            sắp xếp lên các ô ở trên , thanh dock như link
          </h3>
          <a href="https://www.jolyui.dev/docs/components/navigation/dock">
            https://www.jolyui.dev/docs/components/navigation/dock
          </a>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: project.id * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg mb-4 h-80 bg-gray-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold  mb-2">{project.title}</h3>
              <p className="text-gray-400">{project.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
