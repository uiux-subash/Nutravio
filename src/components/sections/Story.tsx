"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import { ArrowButton, cx, Eyebrow, LoopVideo, Parallax, Reveal, ScrollWords } from "../ui";

/* ── Statement over glowing seedlings ───────────────────────────── */
const chips = [
  { text: "Soil organic matter +0.6% in two seasons", pos: "left-[4%] top-[62%]" },
  { text: "Zinc deficiency found in 1 of 3 fields tested", pos: "right-[6%] top-[18%]" },
  { text: "Fertilizer waste down 27% per hectare", pos: "right-[12%] bottom-[22%]" },
  { text: "Root mass +34% vs. untreated control", pos: "left-[34%] bottom-[17%]" },
];

export function Statement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-forest" aria-label="What we do">
      <motion.div style={{ scale }} className="absolute inset-0 -z-10">
        <Image src="/images/seedlings-dark.jpg" alt="" fill sizes="100vw" className="object-cover opacity-70" quality={75} />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest via-forest/40 to-forest" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/80 via-transparent to-transparent" />

      <div className="relative mx-auto grid min-h-[130svh] max-w-[1400px] grid-cols-12 items-center gap-6 px-5 py-32 md:px-10">
        <p className="eyebrow col-span-12 self-start text-lime-soft/80 md:col-span-3 md:pt-6">
          Real-time,
          <br />
          lab-verified
          <br />
          soil intelligence
        </p>
        <ScrollWords
          text="Nutravio turns complex soil chemistry into clear, field-ready mineral plans — so you grow measurable results, not just reports."
          accent={["measurable", "results"]}
          className="font-display col-span-12 text-[34px] leading-[1.08] font-medium tracking-[-0.03em] text-bone md:col-span-9 md:text-[58px] lg:text-[68px]"
        />
      </div>

      {chips.map((c, i) => (
        <Reveal key={c.text} delay={i * 0.12} className={`absolute hidden lg:block ${c.pos}`}>
          <div className="flex max-w-[280px] items-center gap-3 rounded-full border border-bone/10 bg-forest/50 py-2 pr-5 pl-2 backdrop-blur-md">
            <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-lime/90 text-forest">
              <span className="pulse-dot absolute inset-0 rounded-full bg-lime/60" />
              <svg viewBox="0 0 16 16" className="relative size-3.5" fill="currentColor" aria-hidden>
                <circle cx="8" cy="8" r="2" />
                <circle cx="3" cy="3" r="1" />
                <circle cx="13" cy="3" r="1" />
                <circle cx="3" cy="13" r="1" />
                <circle cx="13" cy="13" r="1" />
              </svg>
            </span>
            <p className="font-mono text-[11px] leading-snug tracking-wide text-bone/80 uppercase">{c.text}</p>
          </div>
        </Reveal>
      ))}
    </section>
  );
}

/* ── Vision + stats ─────────────────────────────────────────────── */
function Counter({ to, suffix = "", prefix = "", decimals = 0 }: { to: number; suffix?: string; prefix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setVal(t < 1 ? Math.round(to * (1 - Math.pow(1 - t, 3))) : to);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      setVal(to);
    };
  }, [inView, to]);
  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

const stats = [
  { to: 48000, suffix: "+", label: "Hectares mapped", note: "across 9 growing regions" },
  { to: 1200, suffix: "+", label: "Growers on program", note: "from family farms to estates" },
  { to: 18, prefix: "+", suffix: "%", label: "Average yield lift", note: "vs. conventional NPK only" },
  { to: 27, prefix: "−", suffix: "%", label: "Less input waste", note: "through zone-based dosing" },
];

export function Vision() {
  return (
    <section id="vision" className="relative bg-forest px-5 py-28 md:px-10 md:py-40" aria-labelledby="vision-title">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <Eyebrow className="text-lime">Our vision</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="vision-title" className="mt-6 text-[36px] leading-[1.05] font-semibold tracking-[-0.03em] text-bone md:text-[52px]">
                From depleted ground to mineral-rich, <span className="text-lime">living soil.</span>
              </h2>
            </Reveal>
          </div>
          <div className="flex flex-col justify-end gap-8 md:col-span-5">
            <Reveal delay={0.16}>
              <p className="max-w-[25rem] text-[17px] leading-relaxed text-bone/70">
                Blanket fertilizing has stripped soils of the trace minerals crops rely on. We find what each field lacks, restore its balance and revive the soil life that does the rest.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <ArrowButton href="#science" variant="ghost">
                How it works
              </ArrowButton>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 border-t border-bone/10 md:mt-28 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="border-b border-bone/10 py-8 pr-4 lg:border-b-0 lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0">
              <p className="text-[44px] leading-none font-medium tracking-[-0.04em] text-lime md:text-[64px]">
                <Counter to={s.to} suffix={s.suffix} prefix={s.prefix} />
              </p>
              <p className="eyebrow mt-5 text-bone">{s.label}</p>
              <p className="mt-1 text-sm text-bone/50">{s.note}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Solutions: interactive program switcher ───────────────────── */
const solutions = [
  {
    tag: "Row crops & grains",
    title: "Broadacre mineral programs that lift yield, field by field.",
    body: "Zone-mapped calcium, sulfur and zinc blends for wheat, maize, rice and oilseeds, applied once and working all season.",
    crops: ["Wheat", "Maize", "Rice", "Oilseeds"],
    minerals: ["Ca", "S", "Zn"],
    stat: "+18%",
    statLabel: "average yield lift",
    img: "/images/wheat-field.jpg",
    alt: "A golden wheat field ready for harvest under a blue sky",
  },
  {
    tag: "Orchards & specialty",
    title: "High-value crop nutrition for fruit, vines and vegetables.",
    body: "Chelated boron, magnesium and silicon programs that sharpen fruit set, sugar, shelf-life and stress resilience.",
    crops: ["Apples", "Citrus", "Vines", "Vegetables"],
    minerals: ["B", "Mg", "Si"],
    stat: "−38%",
    statLabel: "fruit drop before harvest",
    img: "/images/apple-orchard.jpg",
    alt: "An apple tree heavy with ripe red fruit in an orchard",
  },
];

const AUTO_MS = 7000;

export function Solutions() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const run = inView && !paused;

  useEffect(() => {
    if (!run) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % solutions.length), AUTO_MS);
    return () => clearTimeout(id);
  }, [run, active]);

  const s = solutions[active];

  return (
    <section ref={ref} id="solutions" className="relative bg-forest px-5 pb-28 md:px-10 md:pb-40" aria-labelledby="solutions-title">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <Eyebrow className="text-lime">Our solutions</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="solutions-title" className="mt-6 max-w-[18ch] text-[34px] leading-[1.06] font-medium tracking-[-0.03em] md:text-[48px]">
                Restoring what the soil was built to do.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <p className="max-w-sm text-bone/60">Two programs, one principle: test first, then feed the soil exactly what it lacks, nothing more.</p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            className="mt-14 grid gap-4 rounded-[36px] bg-forest-2 p-3 md:p-4 lg:grid-cols-12"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* program list */}
            <div className="flex flex-col gap-3 max-lg:order-2 lg:col-span-5">
              {solutions.map((p, i) => {
                const on = i === active;
                return (
                  <div
                    key={p.tag}
                    className={cx(
                      "relative overflow-hidden rounded-[28px] transition-colors duration-500",
                      on ? "bg-forest-3" : "bg-transparent hover:bg-white/[0.04]",
                    )}
                  >
                    <button
                      onClick={() => setActive(i)}
                      aria-expanded={on}
                      className="flex w-full items-center gap-4 p-5 text-left md:p-7"
                    >
                      <span
                        className={cx(
                          "grid size-11 shrink-0 place-items-center rounded-full font-mono text-[13px] transition-colors duration-500",
                          on ? "bg-lime text-forest" : "bg-white/[0.06] text-bone/60",
                        )}
                      >
                        0{i + 1}
                      </span>
                      <span className="flex-1">
                        <span className={cx("eyebrow block text-[11px] transition-colors", on ? "text-lime" : "text-bone/50")}>{p.tag}</span>
                        <span className={cx("font-display mt-1.5 block text-[24px] leading-[1.12] tracking-[-0.01em] md:text-[30px]", on ? "text-bone" : "text-bone/60")}>
                          {p.title}
                        </span>
                      </span>
                    </button>

                    <div className={cx("grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,1,.36,1)]", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                      <div className="overflow-hidden">
                        <div className="px-5 pb-6 md:px-7 md:pb-7 md:pl-[88px]">
                          <p className="text-[15px] leading-relaxed text-bone/70">{p.body}</p>
                          <ul className="mt-5 flex flex-wrap gap-2">
                            {p.crops.map((c) => (
                              <li key={c} className="eyebrow rounded-full bg-white/[0.07] px-3.5 py-2 text-[11px] text-bone/75">
                                {c}
                              </li>
                            ))}
                          </ul>
                          <ArrowButton href="#contact" variant="lime" className="mt-6">
                            Explore program
                          </ArrowButton>
                        </div>
                      </div>
                    </div>

                    {/* auto-advance progress */}
                    {on && (
                      <span className="absolute inset-x-7 bottom-0 h-[2px] overflow-hidden rounded-full bg-white/10">
                        <motion.span
                          key={`${active}-${run}`}
                          className="block h-full origin-left bg-lime"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: run ? 1 : 0 }}
                          transition={{ duration: run ? AUTO_MS / 1000 : 0.3, ease: "linear" }}
                        />
                      </span>
                    )}
                  </div>
                );
              })}
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/10 p-5 md:px-7">
                <p className="text-[15px] text-bone/70">Not sure which program fits your farm?</p>
                <a href="#contact" className="eyebrow flex items-center gap-2 text-[12px] text-lime underline-offset-4 hover:underline">
                  Book a free soil audit <span aria-hidden>→</span>
                </a>
              </div>
            </div>

            {/* media panel */}
            <div className="relative isolate aspect-square overflow-hidden rounded-[28px] sm:aspect-[4/3] max-lg:order-1 lg:col-span-7 lg:aspect-auto lg:min-h-[600px]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={s.img}
                  className="absolute inset-0 -z-10"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image src={s.img} alt={s.alt} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-forest/80 via-transparent to-forest/30" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="absolute inset-0 flex flex-col justify-between p-4 md:p-6"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <div className="flex items-start justify-end gap-3">
                    <div className="flex gap-1.5 rounded-full border border-white/25 bg-white/15 p-1.5 backdrop-blur-md">
                      {s.minerals.map((m) => (
                        <span key={m} className="font-display grid size-9 place-items-center rounded-full bg-forest/70 text-[15px] text-lime">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="self-end rounded-[20px] border border-white/25 bg-white/15 px-4 py-3 text-white backdrop-blur-md md:rounded-[24px] md:px-6 md:py-5">
                    <p className="text-[30px] leading-none font-medium tracking-[-0.03em] md:text-[52px]">{s.stat}</p>
                    <p className="eyebrow mt-2 text-[11px] text-white/80">{s.statLabel}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Science (sticky split) ─────────────────────────────────────── */
const science = [
  {
    tag: "Lab-grade soil mapping",
    title: "We map 21 soil markers per zone — from pH and CEC to trace zinc and boron — at lab accuracy, not guesswork.",
    img: "/images/roots-macro.jpg",
    video: "/videos/soil-lab.mp4",
    poster: "/videos/soil-lab.jpg",
    alt: "A gloved hand holding a soil sample in a test tube in the lab",
    points: ["GPS-gridded sampling", "Accredited lab chemistry", "Microbial activity index"],
  },
  {
    tag: "Chelated mineral blends",
    title: "Our slow-release, chelated minerals stay where roots can reach them — so less washes away and more ends up in the crop.",
    img: "/images/mineral-pour.jpg",
    video: "/videos/mineral-pellets.mp4",
    poster: "/videos/mineral-pellets.jpg",
    alt: "A hand holding slow-release mineral pellets",
    points: ["Zone-specific prescriptions", "Organic-certified options", "Season-long release"],
  },
];

export function Science() {
  return (
    <section id="science" className="relative bg-forest px-5 py-28 md:px-10 md:py-32" aria-labelledby="science-title">
      <div className="mx-auto grid max-w-[1400px] gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <Reveal>
              <Eyebrow className="text-lime">Our science</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="science-title" className="mt-6 text-[40px] leading-[1.02] font-semibold tracking-[-0.035em] md:text-[60px]">
                Lab precision.
                <br />
                Field proven.
                <br />
                <span className="text-lime">Grower trusted.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-8 max-w-sm text-bone/60">
                Every recommendation is traceable back to a sample, a lab result and a field trial. No black boxes — just chemistry you can check.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="flex flex-col gap-24 md:col-span-7 md:gap-32">
          {science.map((s) => (
            <article key={s.tag}>
              <Parallax amount={50} className="aspect-[4/3] rounded-[28px]">
                {s.video ? (
                  <LoopVideo src={s.video} poster={s.poster!} label={s.alt} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <Image src={s.img} alt={s.alt} fill sizes="(min-width:768px) 55vw, 100vw" className="object-cover" />
                )}
              </Parallax>
              <Reveal>
                <Eyebrow className="mt-8 text-lime">{s.tag}</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="mt-4 text-[22px] leading-[1.3] font-semibold tracking-[-0.015em] md:text-[28px]">{s.title}</p>
              </Reveal>
              <Reveal delay={0.12}>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {s.points.map((p) => (
                    <li key={p} className="eyebrow rounded-full bg-bone/[0.06] px-4 py-2.5 text-[11px] text-bone/75">
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
