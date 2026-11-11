"use client";

/**
 * Scroll-driven "programs" scene (replaces the old manifesto block):
 * 1. A lime glow rises behind the promise statement.
 * 2. The upright lines blur away while the italic accent stays sharp.
 * 3. Three program "tickets" tumble up in 3D and land in a row
 *    (a stacked deck on mobile), then the footnote fades in.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

type Program = {
  title: string;
  body: React.ReactNode;
  points: string[];
  label: string;
  value: string;
  foot: string;
  seed: number;
};

const programs: Program[] = [
  {
    title: "Soil Audit",
    body: (
      <>
        We map every zone of your farm and show you <em className="font-display">exactly</em> what your soil is missing.
      </>
    ),
    points: ["21-marker lab analysis", "GPS zone maps", "Agronomist walkthrough"],
    label: "Results in",
    value: "14 days",
    foot: "No guesswork, just data",
    seed: 3,
  },
  {
    title: "Mineral Program",
    body: (
      <>
        A season-long, zone-specific blend that <em className="font-display">feeds the soil</em>, not just the crop.
      </>
    ),
    points: ["Custom chelated blends", "Application schedule", "Mid-season check-in"],
    label: "Runs for",
    value: "1 season",
    foot: "Every gram accounted for",
    seed: 7,
  },
  {
    title: "Season Partner",
    body: (
      <>
        For estates that want soil getting <em className="font-display">better every year</em>, with results they can prove.
      </>
    ),
    points: ["Multi-season soil scores", "Dedicated agronomist", "Yield & ROI reporting"],
    label: "Commitment",
    value: "3+ seasons",
    foot: "Proof in every harvest",
    seed: 11,
  },
];

/* Soil-profile "barcode": bars of varying weight, like strata in a core sample. */
function SoilCode({ seed }: { seed: number }) {
  const bars = useMemo(
    () => Array.from({ length: 34 }, (_, i) => 1 + (Math.abs(Math.floor(Math.sin(seed * 97 + i * 13.37) * 10000)) % 4)),
    [seed],
  );
  return (
    <div className="flex h-11 items-stretch gap-[3px]" aria-hidden>
      {bars.map((w, i) => (
        <span key={i} className="rounded-full bg-forest" style={{ width: w * 1.6, opacity: 0.55 + (w / 4) * 0.45 }} />
      ))}
    </div>
  );
}

function Ticket({ p }: { p: Program }) {
  return (
    <div className="flex w-full flex-col">
      <div className="flex min-h-[270px] flex-col justify-between rounded-[28px] bg-bone p-6 text-forest shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
        <div>
          <h3 className="font-display text-[34px] leading-none italic">{p.title}</h3>
          <p className="mt-3 text-[14px] leading-snug text-forest/80">{p.body}</p>
        </div>
        <ul className="mt-6 grid gap-1.5 text-[13px]">
          {p.points.map((pt) => (
            <li key={pt} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-forest" />
              {pt}
            </li>
          ))}
        </ul>
      </div>
      {/* perforation */}
      <div className="relative mx-6 h-3">
        <span className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-white/30" />
      </div>
      <div className="rounded-[28px] bg-bone p-6 pt-5 text-forest shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between font-mono text-[11px] tracking-wide uppercase">
          <span>{p.label}:</span>
          <span className="font-semibold">{p.value}</span>
        </div>
        <div className="mt-3">
          <SoilCode seed={p.seed} />
        </div>
        <p className="mt-3 font-mono text-[10px] tracking-wide text-forest/70 uppercase">{p.foot}</p>
      </div>
    </div>
  );
}

function useLayout() {
  const [l, setL] = useState({ mobile: false, w: 320, h: 900 });
  useEffect(() => {
    const on = () => {
      const mobile = window.innerWidth < 768;
      setL({ mobile, h: window.innerHeight, w: mobile ? Math.min(330, window.innerWidth - 56) : Math.min(330, window.innerWidth * 0.27) });
    };
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return l;
}

// Each card tumbles in from below with its own spin, then lands flat.
const starts = [
  { rx: 55, ry: -35, rz: -28, x: -0.9 },
  { rx: 70, ry: 20, rz: 14, x: 0.15 },
  { rx: 50, ry: 40, rz: 32, x: 0.9 },
];

function FlyingCard({ i, p, prog, layout }: { i: number; p: Program; prog: MotionValue<number>; layout: { mobile: boolean; w: number; h: number } }) {
  const { mobile, w, h } = layout;
  const a = mobile ? 0.2 + i * 0.16 : 0.2 + i * 0.07;
  const b = a + (mobile ? 0.2 : 0.3);
  const s = starts[i];
  const gap = 22;
  const finalX = mobile ? 0 : (i - 1) * (w + gap);
  const finalY = mobile ? i * 16 : 0;

  const y = useTransform(prog, [a, b], [h * 1.1, finalY]);
  const x = useTransform(prog, [a, b], [s.x * w, finalX]);
  const rotateX = useTransform(prog, [a, b], [s.rx, 0]);
  const rotateY = useTransform(prog, [a, b], [s.ry, 0]);
  const rotateZ = useTransform(prog, [a, b], [s.rz, 0]);
  const scale = useTransform(prog, [a, b], [0.85, 1]);

  return (
    <motion.div
      style={{ x, y, rotateX, rotateY, rotateZ, scale, width: w, marginLeft: -w / 2, zIndex: 10 + i }}
      className="absolute top-0 left-1/2 will-change-transform [transform-style:preserve-3d]"
    >
      <Ticket p={p} />
    </motion.div>
  );
}

export function Programs() {
  const ref = useRef<HTMLElement>(null);
  const layout = useLayout();
  const { scrollYProgress: prog } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // glow mound rises then floods the frame
  const glowScale = useTransform(prog, [0, 0.35], [0.7, 2.6]);
  const glowY = useTransform(prog, [0, 0.35], ["35%", "0%"]);
  const glowOpacity = useTransform(prog, [0, 0.1, 0.35], [0.55, 0.85, 0.7]);

  // statement: upright lines blur first, italic accent holds, then all recede
  const plainBlur = useTransform(prog, [0.08, 0.22], ["blur(0px)", "blur(10px)"]);
  const plainOpacity = useTransform(prog, [0.08, 0.22], [1, 0.35]);
  const accentBlur = useTransform(prog, [0.3, 0.42], ["blur(0px)", "blur(10px)"]);
  const textOpacity = useTransform(prog, [0.3, 0.45], [1, 0]);
  const textScale = useTransform(prog, [0, 0.45], [1, 0.94]);

  const capOpacity = useTransform(prog, [0.62, 0.72], [0, 1]);
  const capY = useTransform(prog, [0.62, 0.72], [20, 0]);

  return (
    <section ref={ref} className="relative h-[420vh] bg-forest" aria-label="Our programs">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* glow */}
        <motion.div
          style={{ scale: glowScale, y: glowY, opacity: glowOpacity }}
          className="pointer-events-none absolute inset-x-[-10%] bottom-[-35%] h-[110%] rounded-[50%] bg-[radial-gradient(closest-side,#7fbf4d_0%,#3e6f2a_45%,rgba(15,31,16,0)_100%)] blur-2xl"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_120%,rgba(198,241,157,0.25),transparent_70%)]" />

        {/* statement */}
        <motion.div style={{ opacity: textOpacity, scale: textScale }} className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <motion.div style={{ filter: plainBlur, opacity: plainOpacity }} className="mb-4 flex flex-wrap items-center justify-center gap-2">
            {["No guesswork", "No blanket dosing", "No spreadsheets"].map((t) => (
              <span key={t} className="eyebrow rounded-full bg-forest/50 px-4 py-2 text-lime line-through decoration-lime/60 backdrop-blur-md">
                {t}
              </span>
            ))}
          </motion.div>
          <h2 className="max-w-[18ch] text-[40px] leading-[1.02] tracking-[-0.02em] md:text-[76px]">
            <motion.span style={{ filter: plainBlur, opacity: plainOpacity }} className="block">
              Just real, measured
              <br />
              soil health, delivered
            </motion.span>
            <motion.span style={{ filter: accentBlur }} className="block text-lime">
              season after season.
            </motion.span>
          </h2>
        </motion.div>

        {/* tickets */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5">
          <motion.p style={{ opacity: capOpacity }} className="font-display mb-6 rounded-[50%] border border-bone/40 px-6 py-1.5 text-[17px] text-bone italic">
            Our programs
          </motion.p>
          <div className="relative w-full [perspective:1400px]" style={{ height: layout.mobile ? 470 + 32 : 470 }}>
            {programs.map((p, i) => (
              <FlyingCard key={p.title} i={i} p={p} prog={prog} layout={layout} />
            ))}
          </div>
          <motion.div style={{ opacity: capOpacity, y: capY }} className="mt-8 max-w-md text-center">
            <p className="font-display text-[17px] text-lime italic">Every plan is lab-verified.</p>
            <p className="mt-1 text-[13px] leading-relaxed text-bone/70">
              No matter the program, every recommendation traces back to a sample, a lab result and a field trial.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
