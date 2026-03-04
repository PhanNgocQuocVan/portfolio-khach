import React, { useRef, useEffect, useState } from "react";

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  theme?: "dark" | "light";
}

const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "196, 162, 98";
const MOBILE_BREAKPOINT = 768;

interface CertCardProps extends BentoCardProps {
  image?: string;
  issuer?: string;
  year?: string;
  type?: "degree" | "certificate";
}

const cardData: CertCardProps[] = [
  {
    color: "var(--card-bg)",
    title: "Bachelor of Computer Science",
    description: "Major in Software Engineering & Artificial Intelligence",
    label: "University Degree",
    issuer: "Vietnam National University",
    year: "2021",
    type: "degree",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
  },
  {
    color: "var(--card-bg)",
    title: "AWS Certified Solutions Architect",
    description:
      "Professional level certification for cloud architecture design",
    label: "Cloud Certification",
    issuer: "Amazon Web Services",
    year: "2023",
    type: "certificate",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  },
  {
    color: "var(--card-bg)",
    title: "Google Professional Data Engineer",
    description: "Designing and building data processing systems on GCP",
    label: "Data Engineering",
    issuer: "Google Cloud",
    year: "2022",
    type: "certificate",
    image:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
  },
  {
    color: "var(--card-bg)",
    title: "Meta React Developer",
    description: "Front-End development with React and advanced UI patterns",
    label: "Frontend",
    issuer: "Meta / Coursera",
    year: "2023",
    type: "certificate",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  },
  {
    color: "var(--card-bg)",
    title: "IELTS Academic",
    description: "Score 7.5 — C1 Proficiency in Academic English",
    label: "Language",
    issuer: "British Council",
    year: "2020",
    type: "certificate",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
  },
];

// ─── Spotlight: rAF-throttled, zero GSAP ──────────────────────────────────
const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    let rafId: number | null = null;
    const section = gridRef.current.closest(
      ".bento-section",
    ) as HTMLElement | null;
    if (!section) return;

    const proximity = spotlightRadius * 0.5;
    const fadeDistance = spotlightRadius * 0.75;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!gridRef.current) return;

        const sectionRect = section.getBoundingClientRect();
        const inside =
          e.clientX >= sectionRect.left &&
          e.clientX <= sectionRect.right &&
          e.clientY >= sectionRect.top &&
          e.clientY <= sectionRect.bottom;

        const cards = gridRef.current.querySelectorAll<HTMLElement>(".card");

        if (!inside) {
          cards.forEach((c) => c.style.setProperty("--glow-intensity", "0"));
          return;
        }

        cards.forEach((card) => {
          const r = card.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dist = Math.max(
            0,
            Math.hypot(e.clientX - cx, e.clientY - cy) -
              Math.max(r.width, r.height) / 2,
          );

          let intensity = 0;
          if (dist <= proximity) intensity = 1;
          else if (dist <= fadeDistance)
            intensity = (fadeDistance - dist) / (fadeDistance - proximity);

          const relX = ((e.clientX - r.left) / r.width) * 100;
          const relY = ((e.clientY - r.top) / r.height) * 100;
          card.style.setProperty("--glow-x", `${relX}%`);
          card.style.setProperty("--glow-y", `${relY}%`);
          card.style.setProperty("--glow-intensity", intensity.toString());
          card.style.setProperty("--glow-radius", `${spotlightRadius}px`);
        });
      });
    };

    const handleMouseLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      gridRef.current
        ?.querySelectorAll<HTMLElement>(".card")
        .forEach((c) => c.style.setProperty("--glow-intensity", "0"));
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

// ─── Grid wrapper ──────────────────────────────────────────────────────────
const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
  bgColor?: string;
}> = ({ children, gridRef, bgColor }) => (
  <div
    className="bento-section grid gap-2 p-3 w-full max-w-full select-none relative"
    style={{
      fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.5rem)",
      backgroundColor: bgColor ?? "transparent",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "100%",
    }}
    ref={gridRef}
  >
    {children}
  </div>
);

// ─── Mobile detection ──────────────────────────────────────────────────────
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

// ─── Image thumbnail ───────────────────────────────────────────────────────
const CertImageThumbnail: React.FC<{
  src: string;
  alt: string;
  onImageClick: (src: string) => void;
}> = ({ src, alt, onImageClick }) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
      onImageClick(src);
    }}
    style={{
      width: "100%",
      flex: 1,
      minHeight: "200px",
      borderRadius: "12px",
      backgroundColor: "var(--image-bg)",
      marginBottom: "12px",
      overflow: "hidden",
      position: "relative",
      cursor: "zoom-in",
    }}
  >
    <img
      src={src}
      alt={alt}
      className="cert-img"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: "8px",
        right: "10px",
        color: "rgba(255,255,255,0.8)",
        fontSize: "11px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        pointerEvents: "none",
        letterSpacing: "0.03em",
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
      Xem ảnh
    </div>
  </div>
);

// ─── Card content ──────────────────────────────────────────────────────────
const CertCardContent: React.FC<{
  card: CertCardProps;
  textAutoHide: boolean;
  onImageClick: (src: string) => void;
}> = ({ card, textAutoHide, onImageClick }) => (
  <>
    <CertImageThumbnail
      src={card.image ?? ""}
      alt={card.title ?? "Certificate"}
      onImageClick={onImageClick}
    />
    <div
      className="card__header flex justify-between gap-3 relative"
      style={{ color: "var(--label-color)" }}
    >
      <span className="card__label text-xs font-medium uppercase tracking-wider">
        {card.label}
      </span>
      <span style={{ color: "var(--text-secondary)", fontSize: "0.7rem" }}>
        {card.year}
      </span>
    </div>
    <div
      className="card__content flex flex-col relative"
      style={{ color: "var(--white)", marginTop: "6px" }}
    >
      <h3
        className={`card__title font-semibold text-sm m-0 mb-1 ${textAutoHide ? "text-clamp-1" : ""}`}
      >
        {card.title}
      </h3>
      <p
        className={`card__description leading-5 ${textAutoHide ? "text-clamp-2" : ""}`}
        style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}
      >
        {card.description}
      </p>
      <p
        style={{
          fontSize: "0.65rem",
          color: "var(--label-color)",
          marginTop: "4px",
          opacity: 0.8,
        }}
      >
        {card.issuer}
      </p>
    </div>
  </>
);

// ─── Main export ───────────────────────────────────────────────────────────
const MagicBento: React.FC<BentoProps> = ({
  textAutoHide = true,
  enableStars = true, // API-compat only – particles removed
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount, // API-compat only – unused
  enableTilt = false, // API-compat only – 3D tilt removed
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true, // API-compat only – ripple removed
  enableMagnetism = true, // API-compat only – magnetism removed
  theme = "dark",
}) => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const handleCardClick = (img?: string) => {
    if (img) setModalImage(img);
  };

  const isLight = theme === "light";
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  const baseClassName = (withGlow: boolean) =>
    `card flex flex-col justify-between relative min-h-[200px] w-full max-w-full p-4 rounded-[20px] border border-solid font-light overflow-hidden${
      withGlow ? " card--border-glow" : ""
    }`;

  const cardStyle = {
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--border-color)",
    color: "var(--white)",
    "--glow-x": "50%",
    "--glow-y": "50%",
    "--glow-intensity": "0",
    "--glow-radius": "200px",
  } as React.CSSProperties;

  return (
    <>
      <style>{`
        .bento-section {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
          --glow-radius: 200px;
          --glow-color: ${glowColor};
          --border-color: ${isLight ? "#e8d5a3" : "#3a2e1a"};
          --background-dark: ${isLight ? "#faf6ee" : "#0c0a05"};
          --card-bg: ${isLight ? "#fdf9f3" : "#12100a"};
          --white: ${isLight ? "#1a0a2e" : "hsl(0, 0%, 100%)"};
          --text-secondary: ${isLight ? "#6b5a3e" : "rgba(255,255,255,0.65)"};
          --label-color: ${isLight ? "#a07840" : "rgba(196,162,98,0.9)"};
          --image-bg: ${isLight ? "#f0e8d4" : "#1a1408"};
          --image-icon: ${isLight ? "#c4a262" : "#6b4e1a"};
          --gold-primary: rgba(196, 162, 98, 1);
          --gold-glow: rgba(196, 162, 98, 0.15);
          --gold-border: rgba(196, 162, 98, 0.6);
        }

        /* ── Grid layout ── */
        .card-responsive {
          grid-template-columns: 1fr;
          width: 90%;
          margin: 0 auto;
          padding: 0.5rem;
        }
        @media (min-width: 600px) {
          .card-responsive { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .card-responsive { grid-template-columns: repeat(6, 1fr); }
          .card-responsive .card:nth-child(1) { grid-column: 1 / 4; }
          .card-responsive .card:nth-child(2) { grid-column: 4 / 7; }
          .card-responsive .card:nth-child(3) { grid-column: 1 / 3; }
          .card-responsive .card:nth-child(4) { grid-column: 3 / 5; }
          .card-responsive .card:nth-child(5) { grid-column: 5 / 7; }
        }
        @media (max-width: 599px) {
          .card-responsive { grid-template-columns: 1fr; width: 90%; margin: 0 auto; padding: 0.5rem; }
          .card-responsive .card { width: 100%; min-height: 220px; }
        }

        /* ── Card hover – CSS only, zero JS ── */
        .card {
          cursor: pointer;
          transition: box-shadow 0.25s ease;
        }
        .card:hover {
          box-shadow: 0 4px 16px rgba(196, 162, 98, 0.12);
        }

        /* ── Image zoom – CSS only ── */
        .cert-img {
          transition: transform 0.4s ease;
          will-change: transform;
        }
        .cert-img:hover { transform: scale(1.06); }

        /* ── Border glow (spotlight CSS-variable driven) ── */
        .card--border-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 6px;
          background: radial-gradient(
            var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
            transparent 60%
          );
          border-radius: inherit;
          -webkit-mask: linear-gradient(#fff 0 0) content-box,
                        linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          z-index: 1;
        }
        .card--border-glow:hover {
          box-shadow: 0 4px 20px rgba(100, 80, 30, 0.25),
                      0 0 24px rgba(${glowColor}, 0.15);
        }

        /* ── Text clamp ── */
        .text-clamp-1 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .text-clamp-2 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Modal ── */
        .modal-overlay { cursor: pointer; }
        .modal-content { cursor: default; }
      `}</style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef} bgColor="transparent">
        <div className="card-responsive grid gap-2">
          {cardData.map((card, index) => (
            <div
              key={index}
              className={baseClassName(enableBorderGlow)}
              style={cardStyle}
              onClick={() => handleCardClick(card.image)}
            >
              <CertCardContent
                card={card}
                textAutoHide={textAutoHide}
                onImageClick={setModalImage}
              />
            </div>
          ))}
        </div>
      </BentoCardGrid>

      {modalImage && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "24px",
          }}
          onClick={() => setModalImage(null)}
        >
          <div
            className="modal-content"
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow:
                "0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage}
              alt="Certificate"
              style={{
                display: "block",
                maxWidth: "90vw",
                maxHeight: "85vh",
                width: "auto",
                height: "auto",
                objectFit: "contain",
              }}
            />
            <button
              onClick={() => setModalImage(null)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "white",
                fontSize: "18px",
                lineHeight: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}
            >
              ×
            </button>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "rgba(255,255,255,0.45)",
              fontSize: "12px",
              pointerEvents: "none",
            }}
          >
            Bấm ra ngoài để đóng
          </div>
        </div>
      )}
    </>
  );
};

export default MagicBento;
