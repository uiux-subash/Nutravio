"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="square" />
    </svg>
  );
}

type BtnVariant = "lime" | "ghost" | "dark" | "light";
/**
 * "Seed bloom" hover: the round arrow seed swells until it fills the pill,
 * the label rolls up to a new line, and the arrow shoots out as a fresh one sprouts in.
 */
const btnStyles: Record<BtnVariant, { wrap: string; fill: string; hoverText: string; box: string; boxHover: string }> = {
  lime: { wrap: "bg-lime text-forest", fill: "bg-forest", hoverText: "group-hover:text-lime", box: "bg-forest text-lime", boxHover: "group-hover:bg-lime group-hover:text-forest" },
  ghost: { wrap: "border border-bone/25 text-bone", fill: "bg-lime", hoverText: "group-hover:text-forest", box: "bg-bone/10 text-bone", boxHover: "group-hover:bg-forest group-hover:text-lime" },
  dark: { wrap: "bg-forest text-bone", fill: "bg-lime", hoverText: "group-hover:text-forest", box: "bg-lime text-forest", boxHover: "group-hover:bg-forest group-hover:text-lime" },
  light: { wrap: "bg-bone text-forest", fill: "bg-forest", hoverText: "group-hover:text-lime", box: "bg-forest text-lime", boxHover: "group-hover:bg-lime group-hover:text-forest" },
};

/** Two stacked arrows: one flies out up-right, the other sprouts in from bottom-left. */
export function SproutArrow({ className = "size-3.5" }: { className?: string }) {
  return (
    <span className={cx("relative block overflow-hidden", className)}>
      <Arrow className="absolute inset-0 size-full -rotate-45 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-[140%] group-hover:-translate-y-[140%]" />
      <Arrow className="absolute inset-0 size-full -translate-x-[140%] translate-y-[140%] -rotate-45 transition-transform delay-75 duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
    </span>
  );
}

/** Label that rolls up to a duplicate line on hover. */
export function RollText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx("relative block overflow-hidden", className)}>
      <span className="block transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );
}

export function ArrowButton({
  href,
  children,
  variant = "lime",
  className = "",
  type,
  onClick,
}: {
  href?: string;
  children: ReactNode;
  variant?: BtnVariant;
  className?: string;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  const s = btnStyles[variant];
  const inner = (
    <>
      {/* the seed that blooms to fill the pill */}
      <span
        aria-hidden
        className={cx(
          "absolute top-1/2 right-1.5 -z-10 size-9 -translate-y-1/2 scale-0 rounded-full transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[14]",
          s.fill,
        )}
      />
      <RollText className={cx("eyebrow pl-1 transition-colors duration-300", s.hoverText)}>{children}</RollText>
      <span
        className={cx(
          "grid size-9 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-500 group-active:scale-90",
          s.box,
          s.boxHover,
        )}
      >
        <SproutArrow />
      </span>
    </>
  );
  const cls = cx(
    "group relative isolate inline-flex h-12 items-center gap-4 overflow-hidden rounded-full py-1.5 pr-1.5 pl-5 transition-[transform,border-color] duration-300 hover:border-transparent active:scale-[0.98]",
    s.wrap,
    className,
  );
  if (href)
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  return (
    <button type={type ?? "button"} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("eyebrow flex items-center gap-2.5", className)}>
      <span className="inline-block size-1.5 rounded-full bg-current" />
      {children}
    </p>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 28,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

/** Words light up one by one as the block scrolls through the viewport. */
export function ScrollWords({ text, className = "", accent = [] }: { text: string; className?: string; accent?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const start = i / words.length;
        const isAccent = accent.some((a) => w.toLowerCase().includes(a));
        return (
          <span key={i} className={isAccent ? "text-lime" : undefined}>
            <Word progress={scrollYProgress} range={[start, start + 1 / words.length]}>
              {w}
            </Word>
          </span>
        );
      })}
    </p>
  );
}

/** Simple parallax wrapper for images. */
export function Parallax({ children, amount = 80, className = "" }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  return (
    <div ref={ref} className={cx("relative overflow-hidden", className)}>
      <motion.div style={{ y, top: -amount, bottom: -amount }} className="absolute inset-x-0">
        <div className="relative h-full w-full">{children}</div>
      </motion.div>
    </div>
  );
}

/* Muted looping video that only plays while on screen. */
export function LoopVideo({ src, poster, label, className }: { src: string; poster: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} className={className} />;
}
