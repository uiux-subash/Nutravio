"use client";

/**
 * "Built for every crop" — a scroll-driven list (left) where each crop
 * re-arranges a cluster of field photos (right) into a new 3D formation:
 * ring → grid → carousel → fan → field → stack.
 */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cx } from "../ui";

const crops = [
  {
    name: "Grains",
    minerals: ["Zn", "S", "Mn"],
    line: "Stronger tillers and fuller heads, field after field.",
  },
  {
    name: "Rice",
    minerals: ["Zn", "Si", "Fe"],
    line: "Paddies that stand up to heat, flood and stress.",
  },
  {
    name: "Orchards",
    minerals: ["Ca", "B", "Mg"],
    line: "Firmer fruit, less drop and cleaner packouts.",
  },
  {
    name: "Vines",
    minerals: ["B", "Mg", "Zn"],
    line: "Even fruit set and beautifully balanced sugars.",
  },
  {
    name: "Vegetables",
    minerals: ["Ca", "Mg", "B"],
    line: "Sweeter crops with a longer shelf-life.",
  },
  {
    name: "Oilseeds",
    minerals: ["S", "B", "Mg"],
    line: "Higher oil content and better-filled pods.",
  },
];

const photos = [
  "fields-aerial",
  "sprouts",
  "hands-soil",
  "corn-sky",
  "roots-macro",
  "harvest-aerial",
  "seedlings-dark",
  "mineral-pour",
  "tree-sunset",
  "hands-planting",
  "irrigation",
  "soil-texture",
];
const N = photos.length;

type T = {
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
};

function rand(i: number, k: number) {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

/** Rounded so server and client render identical transforms. */
function formation(f: number, i: number, W: number, H: number): T {
  const t = rawFormation(f, i, W, H);
  const r = (n: number) => Math.round(n * 100) / 100;
  return {
    x: r(t.x),
    y: r(t.y),
    z: r(t.z),
    rotateX: r(t.rotateX),
    rotateY: r(t.rotateY),
    rotateZ: r(t.rotateZ),
    scale: r(t.scale),
  };
}

/** Target transform for card i in formation f (W/H = card size). */
function rawFormation(f: number, i: number, W: number, H: number): T {
  const base: T = {
    x: 0,
    y: 0,
    z: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
  };
  switch (f) {
    case 0: {
      // ring
      const a = (i / N) * Math.PI * 2 - Math.PI / 2;
      const R = W * 2.15;
      return {
        ...base,
        x: Math.cos(a) * R,
        y: Math.sin(a) * R,
        rotateZ: (a * 180) / Math.PI + 90,
      };
    }
    case 1: {
      // tilted grid 4×3
      const c = i % 4,
        r = Math.floor(i / 4);
      return {
        ...base,
        x: (c - 1.5) * (W + 14),
        y: (r - 1) * (H + 14),
        rotateX: 18,
        rotateZ: -6,
        scale: 0.92,
      };
    }
    case 2: {
      // carousel arc
      const t = i / (N - 1) - 0.5;
      return {
        ...base,
        x: t * W * 6.2,
        y: Math.pow(t * 2, 2) * -H * 0.55 + H * 0.2,
        z: -Math.abs(t) * 260,
        rotateY: t * -70,
        rotateZ: t * 18,
      };
    }
    case 3: {
      // fan
      const t = i - (N - 1) / 2;
      return {
        ...base,
        x: t * 16,
        y: Math.abs(t) * 5,
        z: i * 2,
        rotateZ: t * 7,
        scale: 1.25,
      };
    }
    case 4: {
      // balanced scatter: a loose, jittered 4×3 "brick" grid with depth,
      // so cards spread evenly across the stage instead of clumping
      const c = i % 4,
        r = Math.floor(i / 4);
      const cellW = W * 1.45,
        cellH = H * 1.2;
      return {
        ...base,
        x: (c - 1.5) * cellW + (r % 2 ? 0.35 : -0.35) * W + (rand(i, 1) - 0.5) * W * 0.4,
        y: (r - 1) * cellH + (rand(i, 2) - 0.5) * H * 0.35,
        z: (rand(i, 3) - 0.5) * 220,
        rotateX: (rand(i, 4) - 0.5) * 16,
        rotateY: (rand(i, 5) - 0.5) * 24,
        rotateZ: (rand(i, 6) - 0.5) * 26,
        scale: 0.85 + rand(i, 7) * 0.25,
      };
    }
    default: {
      // stacked trail
      const k = N - 1 - i;
      return {
        ...base,
        x: k * -11 + W * 0.3,
        y: k * 9 - H * 0.15,
        z: -k * 6,
        rotateZ: (i % 2 ? 1 : -1) * Math.min(k, 3) * 1.2,
        scale: 1.7,
      };
    }
  }
}

function useCard() {
  const [s, setS] = useState({ W: 120, H: 160, mobile: false });
  useEffect(() => {
    const on = () => {
      const mobile = window.innerWidth < 1024;
      const W = mobile
        ? Math.min(78, window.innerWidth * 0.18)
        : Math.min(124, window.innerWidth * 0.085);
      setS({ W, H: W * 1.33, mobile });
    };
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return s;
}

export function Crops() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { W, H } = useCard();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setActive(
      Math.min(crops.length - 1, Math.max(0, Math.floor(p * crops.length))),
    ),
  );

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top =
      el.offsetTop +
      ((i + 0.5) / crops.length) * (el.offsetHeight - window.innerHeight);
    const lenis = (
      window as unknown as {
        lenis?: { scrollTo: (y: number, o?: object) => void };
      }
    ).lenis;
    if (lenis) lenis.scrollTo(top, { duration: 1.2 });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  const spin =
    active === 0
      ? { rotateZ: 360 }
      : active === 2
        ? { rotateY: [0, -8, 0, 8, 0] }
        : active === 4
          ? { rotateZ: [0, 1.5, 0, -1.5, 0], y: [0, -10, 0, 10, 0] }
          : { rotateZ: 0, rotateY: 0, y: 0 };
  const spinT =
    active === 0
      ? { duration: 60, repeat: Infinity, ease: "linear" as const }
      : active === 2 || active === 4
        ? { duration: 10, repeat: Infinity, ease: "easeInOut" as const }
        : { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      ref={ref}
      id="crops"
      className="relative h-[520vh] bg-bone text-forest"
      aria-labelledby="crops-title"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="mx-auto flex h-full max-w-[1400px] flex-col px-6 md:px-12 lg:flex-row lg:px-20 xl:px-24">
          {/* list */}
          <div className="relative z-10 flex flex-col justify-end pt-24 pb-6 lg:w-[46%] lg:justify-center lg:py-0">
            {/* ruler */}
            <div
              className="absolute top-1/2 left-0 hidden h-[70%] -translate-y-1/2 flex-col justify-between lg:flex"
              aria-hidden
            >
              {Array.from({ length: 34 }).map((_, i) => (
                <span
                  key={i}
                  className={cx(
                    "h-px bg-forest/25",
                    i % 5 === 0 ? "w-3" : "w-1.5",
                  )}
                />
              ))}
            </div>
            <div className="lg:pl-12">
              <p className="eyebrow flex items-center gap-2.5 text-forest/60">
                <span className="inline-block size-1.5 rounded-full bg-current" />
                Built for every crop
              </p>
              <h2 id="crops-title" className="mt-3 max-w-[18ch] max-sm:mb-4 text-[28px] leading-[1.08] tracking-[-0.02em] md:text-[36px] lg:mt-4 lg:text-[40px]">
                The right minerals for every crop.
              </h2>
              <p className="mt-3 mb-5 max-w-sm text-[15px] leading-relaxed text-forest/65 max-sm:hidden lg:mb-8">
                Every crop draws on a different mix of minerals. Scroll through to see what each one needs most.
              </p>
              <ul className="font-display">
                {crops.map((c, i) => {
                  const d = Math.abs(i - active);
                  return (
                    <li key={c.name}>
                      <button
                        onClick={() => goTo(i)}
                        className={cx(
                          "flex items-center gap-3 text-left text-[28px] leading-[1.12] tracking-[-0.02em] transition-all duration-500 md:text-[44px] lg:text-[52px]",
                          i === active
                            ? "text-forest"
                            : d === 1
                              ? "text-forest/45"
                              : d === 2
                                ? "text-forest/30"
                                : "text-forest/20",
                        )}
                        aria-current={i === active}
                      >
                        <span
                          className={cx(
                            "inline-block overflow-hidden font-sans transition-all duration-500",
                            i === active
                              ? "w-[0.95em] opacity-100"
                              : "w-0 opacity-0",
                          )}
                          aria-hidden
                        >
                          →
                        </span>
                        {c.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-5 min-h-[76px] lg:mt-8">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center"
                >
                  <div className="flex gap-1.5">
                    {crops[active].minerals.map((m) => (
                      <span
                        key={m}
                        className="font-display grid size-10 place-items-center rounded-full bg-forest text-[17px] text-lime"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <p className="max-w-xs text-[15px] leading-snug text-forest/70">
                    {crops[active].line}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* stage */}
          <div className="relative flex-1 [perspective:1600px] max-lg:scale-[0.8]">
            <motion.div
              animate={spin}
              transition={spinT}
              className="absolute top-1/2 left-1/2 size-0 [transform-style:preserve-3d]"
            >
              {photos.map((src, i) => {
                const t = formation(active, i, W, H);
                return (
                  <motion.div
                    key={src}
                    initial={false}
                    animate={t}
                    transition={{
                      type: "spring",
                      stiffness: 70,
                      damping: 17,
                      mass: 0.9,
                      delay: i * 0.025,
                    }}
                    className="absolute overflow-hidden rounded-2xl bg-forest/10 shadow-[0_18px_40px_-18px_rgba(15,31,16,0.55)]"
                    style={{ width: W, height: H, left: -W / 2, top: -H / 2 }}
                  >
                    <Image
                      src={`/images/${src}.jpg`}
                      alt=""
                      fill
                      sizes="220px"
                      className="object-cover"
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
