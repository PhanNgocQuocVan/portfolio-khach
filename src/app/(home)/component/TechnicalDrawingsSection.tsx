"use client";
import { motion } from "framer-motion";

export default function TechnicalDrawingsSection() {
  const drawings = [
    {
      id: 1,
      title: "Drawing One",
      category: "Architecture",
      image: "/images/drawing-1.jpg",
    },
    {
      id: 2,
      title: "Drawing Two",
      category: "Design",
      image: "/images/drawing-2.jpg",
    },
  ];

  return (
    <section
      id="TechnicalDrawings"
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
            Technical Drawings
          </h2>
          <h3>
            phần này sẽ chứa ảnh bản vẻ của bạn sau đó chuyển thành thi công
            thực tế hư trong link , befor after
          </h3>
          <a href="https://www.jolyui.dev/docs/components/creative/image-comparison">
            https://www.jolyui.dev/docs/components/creative/image-comparison
          </a>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {drawings.map((drawing) => (
            <motion.div
              key={drawing.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: drawing.id * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden rounded-lg mb-4 h-96 bg-gray-900">
                <img
                  src={drawing.image}
                  alt={drawing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold  mb-1">{drawing.title}</h3>
              <p className="text-gray-400 text-sm">{drawing.category}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
