"use client";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { SparklesText } from "@/components/ui/sparkles-text";
import { client } from "@/sanity/lib/client";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function About() {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Truy vấn lấy file CV mới nhất từ Sanity
    const fetchCV = async () => {
      try {
        const query = `*[_type == "cv" && _id == "singleton-cv"][0] {
  "url": filecv.asset->url
}`;
        const data = await client.fetch(query);
        if (data?.url) {
          setCvUrl(data.url);
        }
      } catch (error) {
        console.error("Lỗi lấy CV:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, []);
  const handleDownload = () => {
    if (cvUrl) {
      // Mở file PDF trong tab mới hoặc tự động tải về
      window.open(`${cvUrl}?dl=`, "_blank");
      toast.success("CV is downloading...", { position: "top-right" });
    } else {
      toast.warning(
        "CV is not available at the moment. Please try again later.",
        { position: "top-center" },
      );
    }
  };
  return (
    <section id="about" className="relative w-full py-20 ">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* heading & intro */}
        <div>
          <BlurFade delay={0.25} inView>
            <SparklesText className="text-4xl md:text-7xl mb-6 text-center font-palatino">
              About me
            </SparklesText>
          </BlurFade>
          <BlurFade delay={0.25 * 2} inView>
            <p className="text-center text-lg max-w-4xl mx-auto mb-8 ">
              A retail interior architect with international experience, I
              operate between spatial design, visualization, and execution.
              Proficient in advanced 3D modeling and rendering, I also bring a
              strong understanding of stakeholder collaboration within
              multicultural and global environments.
              <br />
              Holding two master’s degrees in Interior Architecture, with
              specializations in Global Design and Luxury Scenography, I have
              developed a practice grounded in both narrative sensitivity and
              technical precision.
            </p>
          </BlurFade>
        </div>

        {/* image */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <HeroVideoDialog
            className="block"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/AmO9d88Ovfs"
            thumbnailSrc="https://wallpapercave.com/wp/wp6514888.jpg"
            thumbnailAlt="Dummy Video Thumbnail"
          />
        </motion.div>

        {/* second paragraph & button */}
        <BlurFade delay={0.25} inView>
          <p className="text-center text-lg max-w-4xl mx-auto mb-8">
            Over the past two years at Coty, for Gucci Beauty, I contributed to
            international retail rollouts, gaining extensive exposure to
            brand-driven environments and cross-market coordination.
          </p>
          <div className="flex justify-center">
            <Button
              className=" font-semibold py-3 px-6 rounded-full transition cursor-pointer"
              onClick={handleDownload}
              disabled={loading}
            >
              <Download />
              Download CV
            </Button>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
