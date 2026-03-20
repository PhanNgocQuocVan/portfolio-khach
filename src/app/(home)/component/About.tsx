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
import { toYouTubeEmbed } from "@/lib/youtube";

const FALLBACK_VIDEO = "https://www.youtube.com/embed/AmO9d88Ovfs";

export default function About() {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>(FALLBACK_VIDEO);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    "/images/default-thumbnail.png",
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "cv" && _id == "singleton-cv"][0] {
          "url": filecv.asset->url,
          videoUrl,
          "videoThumbnail": videoThumbnail.asset->url
        }`;
        const data = await client.fetch(query);
        if (data?.url) setCvUrl(data.url);
        if (data?.videoUrl) setVideoUrl(toYouTubeEmbed(data.videoUrl));
        if (data?.videoThumbnail) setThumbnailUrl(data.videoThumbnail);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu About:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = () => {
    if (cvUrl) {
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
    <section id="about" className="relative w-full py-12 md:py-20">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <BlurFade delay={0.25} inView>
          <SparklesText className="text-3xl md:text-5xl lg:text-7xl mb-8 md:mb-12 text-center font-palatino">
            About me
          </SparklesText>
        </BlurFade>

        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12 lg:gap-16">
          {/* LEFT — text */}
          <div className="flex-1 flex flex-col justify-center">
            <BlurFade delay={0.25 * 2} inView>
              <p className="text-start text-base md:text-lg text-[#555] dark:text-gray-300 mb-5 md:mb-6">
                A retail interior architect with international experience, I
                operate between spatial design, visualization, and execution.
                Proficient in advanced 3D modeling and rendering, I also bring a
                strong understanding of stakeholder collaboration within
                multicultural and global environments.
              </p>
              <p className="text-start text-base md:text-lg text-[#555] dark:text-gray-300">
                Holding two master's degrees in Interior Architecture, with
                specializations in Global Design and Luxury Scenography, I have
                developed a practice grounded in both narrative sensitivity and
                technical precision.
              </p>
              <p className="text-start text-base md:text-lg text-[#555] dark:text-gray-300 mt-5 md:mt-6">
                Over the past two years at Coty, for Gucci Beauty, I contributed
                to international retail rollouts, gaining extensive exposure to
                brand-driven environments and cross-market coordination.
              </p>
            </BlurFade>
          </div>

          {/* RIGHT — video + download */}
          <div className="flex-1 flex flex-col items-center gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <HeroVideoDialog
                className="block w-full"
                animationStyle="from-center"
                videoSrc={videoUrl}
                thumbnailSrc={thumbnailUrl}
                thumbnailAlt="About video thumbnail"
              />
            </motion.div>

            <BlurFade delay={0.25 * 3} inView>
              <Button
                className="font-semibold py-2 px-5 md:py-3 md:px-6 text-sm md:text-base rounded-full transition cursor-pointer"
                onClick={handleDownload}
                disabled={loading}
              >
                <Download className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                Download CV
              </Button>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}
