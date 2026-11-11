"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import type { SoilSceneHandle } from "./SoilScene";
import { LogoMark } from "../LogoMark";
import Image from "next/image";
import { ArrowButton, LoopVideo, SproutArrow } from "../ui";

const minerals = [
  { sym: "Ca", no: 20, name: "Calcium", note: "Cell walls & structure", pos: "left-[6%] top-[30%]", line: "right" },
  { sym: "Mg", no: 12, name: "Magnesium", note: "The core of chlorophyll", pos: "right-[6%] top-[24%]", line: "left" },
  { sym: "Zn", no: 30, name: "Zinc", note: "Root & enzyme growth", pos: "left-[9%] bottom-[22%]", line: "right" },
  { sym: "Si", no: 14, name: "Silicon", note: "Drought & stress resilience", pos: "right-[8%] bottom-[26%]", line: "left" },
] as const;

function useFade(p: MotionValue<number>, a: number, b: number, c: number, d: number) {
  return useTransform(p, [a, b, c, d], [0, 1, 1, 0]);
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SoilSceneHandle | null>(null);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useEffect(() => {
    let disposed = false;
    const minDelay = new Promise((r) => setTimeout(r, 900));
    import("./SoilScene").then(({ createSoilScene }) => {
      if (disposed || !canvasRef.current) return;
      let sceneReady: () => void = () => {};
      const sceneP = new Promise<void>((r) => (sceneReady = r));
      sceneRef.current = createSoilScene(canvasRef.current, () => sceneReady());
      Promise.all([minDelay, sceneP]).then(() => !disposed && setReady(true));
    });
    const onMove = (e: PointerEvent) => {
      sceneRef.current?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      disposed = true;
      window.removeEventListener("pointermove", onMove);
      sceneRef.current?.dispose();
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => sceneRef.current?.setProgress(v));

  const aOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);
  const aY = useTransform(scrollYProgress, [0, 0.16], [0, 40]);
  const wordY = useTransform(scrollYProgress, [0, 0.16], [0, -80]);
  const bgScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.12]);
  const darken = useTransform(scrollYProgress, [0.06, 0.24], [0, 1]);
  const hud = useTransform(scrollYProgress, [0.06, 0.14], [0, 1]);
  const bOpacity = useFade(scrollYProgress, 0.24, 0.34, 0.56, 0.64);
  const cOpacity = useTransform(scrollYProgress, [0.7, 0.8], [0, 1]);
  const cScale = useTransform(scrollYProgress, [0.7, 1], [0.94, 1.04]);
  const vignette = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  const barW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} id="top" className="relative h-[340vh] bg-forest" aria-label="Nutravio — living soil">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* landscape */}
        <motion.div style={{ scale: bgScale }} className="absolute inset-0">
          <Image src="/images/hero-fields.jpg" alt="" fill preload sizes="100vw" quality={85} className="object-cover object-[50%_60%]" />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/35 via-transparent via-40% to-forest/70" />

        {/* giant wordmark (sits behind the 3D clod) */}
        <motion.div style={{ opacity: aOpacity, y: wordY }} className="pointer-events-none absolute inset-x-0 top-[17vh] flex justify-center md:top-[18vh]">
          <h1 className="font-display leading-[0.9] tracking-[-0.01em] text-white" style={{ fontSize: "min(15.5vw, 270px)" }}>
            <span className="sr-only">Nutravio: where soil science and field results meet</span>
            <span aria-hidden className="flex">
              {"NUTRAVIO".split("").map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "105%" }}
                    animate={ready ? { y: 0 } : {}}
                    transition={{ duration: 1.1, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>
        </motion.div>

        {/* darkens the landscape as the story moves on */}
        <motion.div style={{ opacity: darken }} className="pointer-events-none absolute inset-0 bg-forest" />
        <div className="pointer-events-none absolute inset-0 grain" />

        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

        {/* Phase A — product card + intro */}
        <motion.div
          style={{ opacity: aOpacity, y: aY }}
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 px-5 pb-8 md:flex-row md:items-end md:justify-between md:px-10 md:pb-12"
        >
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="group flex w-full max-w-[360px] items-stretch gap-4 rounded-[26px] border border-white/40 bg-white/10 p-3 text-bone backdrop-blur-md transition-colors hover:bg-white/20 max-md:order-2"
          >
            <span className="relative block size-[92px] shrink-0 overflow-hidden rounded-[18px] md:size-[108px]">
              <LoopVideo src="/videos/seedling-hands.mp4" poster="/videos/seedling-hands.jpg" label="Video of hands holding soil with a young seedling" className="absolute inset-0 h-full w-full object-cover" />
            </span>
            <span className="flex flex-1 flex-col justify-between py-1 pr-1">
              <span className="text-[16px] leading-snug font-medium md:text-[17px]">
                Soil Audit +<br />
                Mineral Plan
              </span>
              <span className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-wide uppercase text-lime-soft">Free first-zone test</span>
                <span className="grid size-8 place-items-center rounded-full bg-white/15 transition-colors group-hover:bg-lime group-hover:text-forest">
                  <SproutArrow />
                </span>
              </span>
            </span>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.85 }}
            className="flex max-w-[400px] flex-col items-start gap-5 max-md:order-1"
          >
            <p className="eyebrow flex items-center gap-2.5 text-lime-soft">
              <span className="relative inline-flex size-2">
                <span className="pulse-dot absolute inset-0 rounded-full bg-lime" />
                <span className="relative size-2 rounded-full bg-lime" />
              </span>
              Soil health · Agri minerals
            </p>
            <p className="text-[17px] leading-relaxed text-white">
              Lab-grade soil mapping and precision mineral programs that rebuild tired ground, so every acre gives back more than it takes.
            </p>
            <ArrowButton href="#solutions" variant="light">
              Explore solutions
            </ArrowButton>
          </motion.div>
        </motion.div>

        {/* Phase B — mineral callouts */}
        <motion.div style={{ opacity: bOpacity }} className="pointer-events-none absolute inset-0 z-10">
          <p className="eyebrow absolute inset-x-0 top-24 text-center text-lime-soft/80">Inside every handful</p>
          <h2 className="absolute inset-x-0 top-32 px-5 text-center text-[30px] leading-tight font-medium tracking-[-0.02em] text-bone md:text-[44px]">
            Minerals feed the life that feeds your crop.
          </h2>
          {minerals.map((m) => (
            <div key={m.sym} className={`absolute hidden md:flex ${m.pos} items-center gap-4 ${m.line === "left" ? "flex-row-reverse text-right" : ""}`}>
              <div className="relative grid size-[92px] shrink-0 place-items-center rounded-full border border-lime/30 bg-forest/60 backdrop-blur-sm">
                <span className="absolute top-3 font-mono text-[10px] text-lime/70">{m.no}</span>
                <span className="font-display pt-2 text-[34px] leading-none text-lime">{m.sym}</span>
              </div>
              <div>
                <p className="eyebrow text-bone">{m.name}</p>
                <p className="mt-1 text-sm text-bone/60">{m.note}</p>
              </div>
              <span className="h-px w-20 bg-gradient-to-r from-lime/0 via-lime/60 to-lime/0" />
            </div>
          ))}
          {/* mobile mineral strip */}
          <div className="absolute inset-x-5 bottom-24 grid grid-cols-4 gap-2 md:hidden">
            {minerals.map((m) => (
              <div key={m.sym} className="mx-auto flex aspect-square w-full max-w-[78px] flex-col items-center justify-center rounded-full border border-lime/30 bg-forest/70 text-center backdrop-blur-sm">
                <p className="font-display text-2xl leading-none text-lime">{m.sym}</p>
                <p className="mt-1 font-mono text-[8px] text-bone/60 uppercase">{m.name}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Phase C — closing line */}
        <motion.div style={{ opacity: cOpacity, scale: cScale }} className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end bg-gradient-to-t from-forest via-forest/60 via-35% to-transparent to-60% px-5 pb-[14vh] text-center">
          <p className="eyebrow mb-5 text-lime">Our belief</p>
          <h2 className="max-w-[16ch] text-[40px] leading-[1.04] font-medium tracking-[-0.03em] text-bone md:text-[72px]">
            Healthy soil is the <span className="text-lime">first harvest.</span>
          </h2>
        </motion.div>

        <motion.div style={{ opacity: vignette }} className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-transparent via-forest/40 to-forest" />

        {/* bottom HUD */}
        <motion.div style={{ opacity: hud }} className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-center justify-between gap-6 px-5 pb-6 md:px-10">
          <span className="eyebrow flex items-center gap-2 text-bone/60">
            <span className="block h-6 w-px overflow-hidden bg-bone/20">
              <motion.span className="block h-full w-full bg-lime" animate={{ y: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} />
            </span>
            Scroll to explore
          </span>
          <div className="hidden h-px flex-1 bg-bone/10 md:block">
            <motion.div style={{ width: barW }} className="h-px bg-lime" />
          </div>
          <span className="eyebrow hidden text-bone/60 md:block">pH 6.8 · CEC 18.4 · OM 4.2%</span>
        </motion.div>
      </div>

      {/* Intro loader */}
      <motion.div
        aria-hidden
        initial={{ opacity: 1 }}
        animate={ready ? { opacity: 0, pointerEvents: "none" } : {}}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-forest"
      >
        <motion.div animate={{ scale: [0.92, 1, 0.92] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
          <LogoMark className="size-14 text-lime" />
        </motion.div>
        <span className="eyebrow tracking-[0.3em] text-bone/60">Nutravio</span>
      </motion.div>
    </section>
  );
}
