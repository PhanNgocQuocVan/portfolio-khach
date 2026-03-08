import { EducationData } from "@/sanity/schemaTypes/queries";
import React, { useRef, useEffect, useState } from "react";

export interface BentoProps {
  items: EducationData[]; // ← nhận data từ ngoài, không hardcode
  textAutoHide?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
  clickEffect?: boolean; // API-compat
  enableMagnetism?: boolean; // API-compat
  enableStars?: boolean; // API-compat
  enableTilt?: boolean; // API-compat
  particleCount?: number; // API-compat
  theme?: "dark" | "light";
}

const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "196, 162, 98";
const MOBILE_BREAKPOINT = 768;

// ─── Tính grid-column cho từng card theo pattern lặp ──────────────────────
// Pattern chuẩn mỗi 5 card (1 chu kỳ):
//   pos 0,1   → hàng đầu: mỗi card 3/6 cột  (2 card × 3 cột)
//   pos 2,3,4 → hàng hai: mỗi card 2/6 cột  (3 card × 2 cột)
//
// Chu kỳ cuối không đủ 5 → chia đều 6 cột cho số card còn lại
function getSmartGridColumn(index: number, total: number): string {
  const cycleIndex = Math.floor(index / 5);
  const posInCycle = index % 5;
  const cycleStart = cycleIndex * 5;
  const remaining = Math.min(5, total - cycleStart);

  // Chu kỳ đủ 5 → layout chuẩn
  if (remaining === 5) {
    const cols = ["1 / 4", "4 / 7", "1 / 3", "3 / 5", "5 / 7"];
    return cols[posInCycle];
  }

  // Special cases cho đẹp hơn
  if (remaining === 1) return "1 / 7"; // 1 card full width
  if (remaining === 2) return posInCycle === 0 ? "1 / 4" : "4 / 7"; // 2 card × 3 cột
  if (remaining === 3) {
    // 3 card × 2 cột
    return ["1 / 3", "3 / 5", "5 / 7"][posInCycle];
  }
  if (remaining === 4) {
    // 4 card: 3+3 / 2+2+2 pattern nhưng chỉ có 4
    // hàng 1: card 0 (3 cột) + card 1 (3 cột), hàng 2: card 2 (3 cột) + card 3 (3 cột)
    return posInCycle % 2 === 0 ? "1 / 4" : "4 / 7";
  }

  return "auto";
}

// ─── Spotlight ────────────────────────────────────────────────────────────
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
          card.style.setProperty(
            "--glow-x",
            `${((e.clientX - r.left) / r.width) * 100}%`,
          );
          card.style.setProperty(
            "--glow-y",
            `${((e.clientY - r.top) / r.height) * 100}%`,
          );
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

// ─── Mobile detection ─────────────────────────────────────────────────────
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

// ─── Image thumbnail ──────────────────────────────────────────────────────
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

// ─── Card content ─────────────────────────────────────────────────────────
const CertCardContent: React.FC<{
  card: EducationData;
  textAutoHide: boolean;
  onImageClick: (src: string) => void;
}> = ({ card, textAutoHide, onImageClick }) => (
  <>
    {card.image && (
      <CertImageThumbnail
        src={card.image}
        alt={card.title}
        onImageClick={onImageClick}
      />
    )}
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

// ─── Main export ──────────────────────────────────────────────────────────
const MagicBento: React.FC<BentoProps> = ({
  items, // ← data từ Sanity
  textAutoHide = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  theme = "dark",
}) => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const isLight = theme === "light";
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  const baseClassName = (withGlow: boolean) =>
    `card flex flex-col justify-between relative min-h-[200px] w-full max-w-full p-4 rounded-[20px] border border-solid font-light overflow-hidden${withGlow ? " card--border-glow" : ""}`;

  const cardStyle = {
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--border-color)",
    color: "var(--white)",
    "--glow-x": "50%",
    "--glow-y": "50%",
    "--glow-intensity": "0",
    "--glow-radius": "200px",
  } as React.CSSProperties;

  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground italic">
        Chưa có bằng cấp nào.
      </div>
    );
  }

  return (
    <>
      <style>{`
        .bento-section {
          --glow-color: ${glowColor};
          --border-color: ${isLight ? "#e8d5a3" : "#3a2e1a"};
          --card-bg: ${isLight ? "#fdf9f3" : "#12100a"};
          --white: ${isLight ? "#1a0a2e" : "hsl(0,0%,100%)"};
          --text-secondary: ${isLight ? "#6b5a3e" : "rgba(255,255,255,0.65)"};
          --label-color: ${isLight ? "#a07840" : "rgba(196,162,98,0.9)"};
          --image-bg: ${isLight ? "#f0e8d4" : "#1a1408"};
          --gold-primary: rgba(196,162,98,1);
          --gold-glow: rgba(196,162,98,0.15);
          --gold-border: rgba(196,162,98,0.6);
        }

        /* ── Grid layout — desktop: 6 cột, pattern lặp ── */
        .card-responsive {
          grid-template-columns: 1fr;
          width: 100%;
          padding: 0.5rem;
        }
        @media (min-width: 600px) {
          .card-responsive { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .card-responsive { grid-template-columns: repeat(6, 1fr); }
        }
        @media (max-width: 599px) {
          .card-responsive { grid-template-columns: 1fr; }
          .card-responsive .card { min-height: 220px; }
        }
        /* Ở tablet (600-1023): reset grid-column về auto để tự flow 2 cột */
        @media (min-width: 600px) and (max-width: 1023px) {
          .card-responsive .card { grid-column: auto !important; }
        }

        .card { cursor: pointer; transition: box-shadow 0.25s ease; }
        .card:hover { box-shadow: 0 4px 16px rgba(196,162,98,0.12); }
        .cert-img { transition: transform 0.4s ease; will-change: transform; }
        .cert-img:hover { transform: scale(1.06); }

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
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          z-index: 1;
        }
        .card--border-glow:hover {
          box-shadow: 0 4px 20px rgba(100,80,30,0.25), 0 0 24px rgba(${glowColor},0.15);
        }

        .text-clamp-1 { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden; }
        .text-clamp-2 { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
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

      <div
        className="bento-section grid gap-2 p-3 w-full max-w-full select-none relative"
        style={{
          fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.5rem)",
          borderRadius: "16px",
        }}
        ref={gridRef}
      >
        <div className="card-responsive grid gap-2">
          {items.map((card, index) => (
            <div
              key={card._id}
              className={baseClassName(enableBorderGlow)}
              style={{
                ...cardStyle,
                // ← inline style chỉ áp dụng ở desktop (>= 1024px)
                // CSS media query bên trên sẽ override thành unset ở mobile
                gridColumn: getSmartGridColumn(index, items.length),
              }}
              onClick={() => card.image && setModalImage(card.image)}
            >
              <CertCardContent
                card={card}
                textAutoHide={textAutoHide}
                onImageClick={setModalImage}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
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
