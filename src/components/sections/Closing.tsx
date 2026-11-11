"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LogoMark } from "../LogoMark";
import { Wordmark } from "../Nav";
import { ArrowButton, Eyebrow, LoopVideo, Reveal, SproutArrow } from "../ui";

/* ── Case studies ───────────────────────────────────────────────── */
const cases = [
  {
    video: "/videos/harvest.mp4",
    poster: "/videos/harvest.jpg",
    alt: "Aerial video of a tractor harvesting a crop field",
    title: "Green Valley Grains: rebuilding 3,200 hectares of zinc-starved wheat ground",
    metric: "+21%",
    metricLabel: "wheat yield in season two",
  },
  {
    video: "/videos/soil-hands.mp4",
    poster: "/videos/soil-hands.jpg",
    alt: "Video of gloved hands holding rich dark soil",
    title: "Hillcrest Orchards: how boron and calcium turned a 40% fruit-drop into record packouts",
    metric: "−38%",
    metricLabel: "fruit drop before harvest",
  },
];

export function CaseStudies() {
  return (
    <section id="results" className="bg-bone px-5 py-28 text-forest md:px-10 md:py-36" aria-labelledby="results-title">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Reveal>
              <Eyebrow>Case studies</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="results-title" className="mt-6 max-w-[26ch] text-[32px] leading-[1.1] font-medium tracking-[-0.03em] md:text-[44px]">
                See how growers rebuild their soil and prove results.
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {cases.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <a href="#contact" className="group block overflow-hidden rounded-[28px] bg-white">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <LoopVideo src={c.video} poster={c.poster} label={c.alt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
                  <div className="absolute bottom-4 left-4 rounded-2xl bg-forest/85 px-5 py-3.5 text-bone backdrop-blur-md">
                    <p className="text-[34px] leading-none font-semibold tracking-tight text-lime">{c.metric}</p>
                    <p className="eyebrow mt-1.5 text-[10px] text-bone/70">{c.metricLabel}</p>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-6 p-6 md:p-7">
                  <div>
                    <Eyebrow className="text-forest/60">Success story</Eyebrow>
                    <h3 className="mt-4 text-[20px] leading-snug font-medium tracking-[-0.01em] md:text-[22px]">{c.title}</h3>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-forest text-lime transition-colors duration-500 group-hover:bg-lime group-hover:text-forest">
                    <SproutArrow className="size-4" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Insights ───────────────────────────────────────────────────── */
const posts = [
  { img: "/images/sprouts.jpg", tag: "Research & insights", date: "Oct 2026", title: "Why trace minerals are the missing link in regenerative farming" },
  { img: "/images/irrigation.jpg", tag: "Field notes", date: "Sep 2026", title: "Water, salinity and calcium: managing soil through a dry season" },
  { img: "/images/tree-sunset.jpg", tag: "News & media", date: "Aug 2026", title: "Nutravio opens its second soil lab to serve growers across the region" },
];

export function Insights() {
  return (
    <section id="insights" className="bg-bone px-5 pb-28 text-forest md:px-10 md:pb-36" aria-labelledby="insights-title">
      <div className="mx-auto max-w-[1400px] border-t border-forest/10 pt-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Reveal>
              <Eyebrow>Latest news & insights</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="insights-title" className="mt-6 text-[32px] leading-[1.1] font-medium tracking-[-0.03em] md:text-[44px]">
                Insights from the ground up.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <ArrowButton href="#insights" variant="dark" className="max-md:hidden">
              See all
            </ArrowButton>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-5">
          {posts.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <a href="#insights" className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
                  <Image src={p.img} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
                </div>
                <div className="mt-5 flex items-center justify-between font-mono text-[11px] tracking-wide text-forest/60 uppercase">
                  <span>{p.tag}</span>
                  <span>{p.date}</span>
                </div>
                <h3 className="mt-3 text-[20px] leading-snug font-medium tracking-[-0.01em] decoration-forest/30 underline-offset-4 group-hover:underline">{p.title}</h3>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact CTA ────────────────────────────────────────────────── */
const fieldCls =
  "w-full rounded-full border border-bone/15 bg-forest/40 px-5 py-3.5 text-[15px] text-bone placeholder:text-bone/40 outline-none transition-colors focus:border-lime focus:bg-forest/70";

export function Contact() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: connect to email / CRM endpoint
    setSent(true);
  };
  return (
    <section id="contact" className="relative isolate overflow-hidden px-5 py-28 md:px-10 md:py-40" aria-labelledby="contact-title">
      <Image src="/images/corn-sky.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest via-forest/75 to-forest" />
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow className="text-lime">Let&apos;s talk</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="contact-title" className="mt-6 text-[44px] leading-[1.02] font-medium tracking-[-0.035em] md:text-[72px]">
              Turn soil data into
              <br />
              <span className="text-lime">harvest results.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-md text-[17px] leading-relaxed text-bone/70">
              Book a free soil audit. An agronomist will review your fields, sample the zones that matter and send you a mineral plan within 14 days.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <ul className="mt-10 grid max-w-md gap-4">
              {["Free first-zone soil test", "Plan from a certified agronomist", "No obligation, no blanket products"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-bone/80">
                  <LogoMark className="size-4 text-lime" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="lg:col-span-5 lg:col-start-8">
          <div className="relative overflow-hidden rounded-[32px] border border-bone/10 bg-forest/70 p-6 backdrop-blur-xl md:p-8">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[420px] flex-col items-start justify-center gap-5">
                  <LogoMark className="size-12 text-lime" />
                  <h3 className="text-[30px] leading-tight font-medium tracking-tight">Thanks — we&apos;ll be in touch within one working day.</h3>
                  <p className="text-bone/60">Meanwhile, grab a recent soil test if you have one. It helps us start faster.</p>
                </motion.div>
              ) : (
                <motion.form key="form" exit={{ opacity: 0, y: -10 }} onSubmit={onSubmit} className="grid gap-3">
                  <p className="eyebrow mb-2 text-[11px] text-bone/60">Request a soil audit</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="sr-only" htmlFor="name">Full name</label>
                    <input id="name" name="name" required placeholder="Full name" className={fieldCls} autoComplete="name" />
                    <label className="sr-only" htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" required placeholder="Email" className={fieldCls} autoComplete="email" />
                  </div>
                  <label className="sr-only" htmlFor="farm">Farm or company</label>
                  <input id="farm" name="farm" placeholder="Farm or company" className={fieldCls} autoComplete="organization" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="sr-only" htmlFor="size">Farm size</label>
                    <div className="relative">
                    <select id="size" name="size" defaultValue="" className={`${fieldCls} appearance-none pr-12`} required>
                      <option value="" disabled>
                        Farm size
                      </option>
                      <option>Under 50 ha</option>
                      <option>50 – 500 ha</option>
                      <option>500 – 2,000 ha</option>
                      <option>2,000+ ha</option>
                    </select>
                    <svg viewBox="0 0 12 12" className="pointer-events-none absolute top-1/2 right-5 size-3 -translate-y-1/2 text-bone/60" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <label className="sr-only" htmlFor="crop">Main crop</label>
                    <div className="relative">
                    <select id="crop" name="crop" defaultValue="" className={`${fieldCls} appearance-none pr-12`} required>
                      <option value="" disabled>
                        Main crop
                      </option>
                      <option>Grains & cereals</option>
                      <option>Oilseeds & pulses</option>
                      <option>Orchards & vines</option>
                      <option>Vegetables</option>
                      <option>Other</option>
                    </select>
                    <svg viewBox="0 0 12 12" className="pointer-events-none absolute top-1/2 right-5 size-3 -translate-y-1/2 text-bone/60" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                  <label className="sr-only" htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={4} placeholder="What's happening in your fields?" className={`${fieldCls} resize-none !rounded-3xl`} />
                  <ArrowButton type="submit" variant="lime" className="mt-3 w-full justify-between">
                    Send request
                  </ArrowButton>
                  <p className="mt-1 text-xs text-bone/40">We reply within one working day. Your details are never shared.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Footer mark: logo + wordmark scaled to fill the exact container width ── */
function FooterMark() {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fs, setFs] = useState<number | null>(null);
  useEffect(() => {
    const box = boxRef.current,
      text = textRef.current;
    if (!box || !text) return;
    const LOGO = 0.78, // logo width relative to font size
      GAP = 0.06;
    const fit = () => {
      text.style.fontSize = "100px";
      const t = text.getBoundingClientRect().width / 100;
      const next = box.clientWidth / (LOGO + GAP + t);
      text.style.fontSize = `${next}px`;
      setFs(next);
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={boxRef} className="pointer-events-none mt-20 w-full select-none" aria-hidden>
      <div className="flex items-end" style={{ gap: fs ? fs * 0.06 : undefined, opacity: fs ? 1 : 0 }}>
        <LogoMark className="shrink-0 text-lime" style={{ width: fs ? fs * 0.78 : 0, marginBottom: fs ? fs * 0.02 : 0 }} />
        <span ref={textRef} className="font-display leading-[0.74] whitespace-nowrap text-bone/[0.07]" style={{ fontSize: fs ?? 100 }}>
          NUTRAVIO
        </span>
      </div>
    </div>
  );
}

/* ── Footer ─────────────────────────────────────────────────────── */
const footerCols = [
  { title: "Solutions", links: ["Row crops & grains", "Orchards & specialty", "Soil audits"] },
  { title: "Science", links: ["Soil mapping", "Mineral blends", "Field trials"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
  { title: "Follow", links: ["LinkedIn", "Instagram", "YouTube"] },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest px-5 pt-24 pb-8 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Wordmark />
            <p className="mt-6 max-w-xs text-bone/50">Soil health and agri minerals, grounded in science and proven in the field.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:col-span-8">
            {footerCols.map((c) => (
              <div key={c.title}>
                <p className="eyebrow text-[11px] text-lime">{c.title}</p>
                <ul className="mt-5 grid gap-3">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#top" className="text-[15px] text-bone/70 transition-colors hover:text-lime">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <FooterMark />

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-bone/10 pt-6 font-mono text-[11px] tracking-wide text-bone/40 uppercase md:flex-row">
          <span>© {new Date().getFullYear()} Nutravio. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#top" className="hover:text-lime">Privacy policy</a>
            <a href="#top" className="hover:text-lime">Terms of use</a>
            <a href="#top" className="hover:text-lime">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
