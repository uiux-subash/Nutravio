"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { LogoMark } from "../LogoMark";
import { Eyebrow, Reveal } from "../ui";

/* ── Nutravio Solves (lime) ─────────────────────────────────────── */
const steps = [
  {
    title: "Map every field with lab-grade soil chemistry",
    icon: <path d="M4 20V8l8-4 8 4v12M4 14h16M9 20v-6M15 20v-6" />,
  },
  {
    title: "Prescribe precise mineral blends for each zone",
    icon: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7.5 15h9" />,
  },
  {
    title: "Apply slow-release, chelated minerals that stay put",
    icon: <path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11zM9 15a3 3 0 0 0 3 3" />,
  },
  {
    title: "Measure progress with season-over-season soil scores",
    icon: <path d="M4 20h16M6 16l4-5 3 3 5-7M18 7h-3M18 7v3" />,
  },
];

export function Solves() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  return (
    <section ref={ref} className="relative overflow-hidden bg-lime px-5 py-28 text-forest md:px-10 md:py-36" aria-labelledby="solves-title">
      <motion.div style={{ rotate }} className="pointer-events-none absolute -right-40 -bottom-40 text-forest/[0.06] md:-right-20" aria-hidden>
        <LogoMark className="size-[620px]" />
      </motion.div>
      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <Reveal>
              <Eyebrow>Nutravio solves</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="solves-title" className="mt-6 text-[36px] leading-[1.05] font-medium tracking-[-0.03em] md:text-[52px]">
                The biggest problem in modern farming: tired soil.
              </h2>
            </Reveal>
          </div>
          <div className="flex flex-col justify-end md:col-span-5 md:col-start-8">
            <Reveal delay={0.16}>
              <p className="max-w-md text-[17px] leading-relaxed text-forest/75">
                We&apos;re not just feeding the crop. We&apos;re rebuilding the ground, restoring the minerals and soil life that every harvest depends on.
              </p>
            </Reveal>
          </div>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-forest/15 bg-forest/15 md:mt-24 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group flex h-full min-h-[260px] flex-col justify-between bg-lime p-6 transition-colors duration-500 hover:bg-forest hover:text-lime md:p-7"
            >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">0{i + 1}</span>
                  <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {s.icon}
                  </svg>
                </div>
                <h3 className="max-w-[18ch] text-[19px] leading-snug font-medium">{s.title}</h3>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
