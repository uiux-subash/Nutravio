"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { LogoMark } from "./LogoMark";
import { Arrow, ArrowButton, cx } from "./ui";

const links = [
  {
    label: "Solutions",
    href: "#solutions",
    children: [
      { tag: "Row crops & grains", label: "Broadacre mineral programs", href: "#solutions" },
      { tag: "Orchards & specialty", label: "High-value crop nutrition", href: "#solutions" },
    ],
  },
  { label: "Science", href: "#science" },
  { label: "Minerals", href: "#crops" },
  { label: "Results", href: "#results" },
  { label: "Insights", href: "#insights" },
];

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={cx("flex items-center gap-2", className)}>
      <LogoMark className="size-[22px] text-lime" />
      <span className="font-display text-[19px] leading-none tracking-[0.02em] text-bone">NUTRAVIO</span>
    </span>
  );
}

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400 && !open);
  });

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5"
      >
        <nav
          className={cx(
            "mx-auto flex h-16 items-center justify-between rounded-full pr-2 pl-5 transition-colors duration-500",
            "bg-forest/75 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl",
          )}
          aria-label="Main"
        >
          <a href="#top" aria-label="Nutravio home">
            <Wordmark />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.label} className="group relative">
                <a href={l.href} className="eyebrow flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] text-bone/80 transition-colors hover:text-lime">
                  {l.label}
                  {l.children && (
                    <svg viewBox="0 0 10 10" className="size-2.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 4l3 3 3-3" />
                    </svg>
                  )}
                </a>
                {l.children && (
                  <div className="invisible absolute top-full left-1/2 w-[440px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                    <div className="grid grid-cols-2 gap-2 rounded-[28px] bg-forest-2/95 p-2 backdrop-blur-xl">
                      {l.children.map((c) => (
                        <a key={c.tag} href={c.href} className="group/item rounded-[22px] p-5 transition-colors hover:bg-lime hover:text-forest">
                          <span className="eyebrow block text-[11px] text-lime group-hover/item:text-forest">{c.tag}</span>
                          <span className="mt-3 block text-[15px] leading-snug">{c.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ArrowButton href="#contact" variant="lime" className="max-sm:hidden">
              Let&apos;s talk
            </ArrowButton>
            <button
              className="grid size-12 place-items-center rounded-full border border-bone/15 transition-colors hover:border-lime/60 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-3 w-4">
                <span className={cx("absolute left-0 h-px w-4 bg-bone transition-all duration-300", open ? "top-1.5 rotate-45" : "top-0")} />
                <span className={cx("absolute left-0 h-px w-4 bg-bone transition-all duration-300", open ? "top-1.5 -rotate-45" : "top-3")} />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-forest px-5 pt-28 pb-8 lg:hidden"
          >
            <ul className="flex flex-col">
              {links.map((l, i) => (
                <motion.li key={l.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                  <a href={l.href} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-bone/10 py-5 text-[32px] font-medium tracking-tight">
                    {l.label}
                    <Arrow className="size-5 text-lime" />
                  </a>
                </motion.li>
              ))}
            </ul>
            <div onClick={() => setOpen(false)}>
              <ArrowButton href="#contact" variant="lime" className="h-14 w-full justify-between">
                Let&apos;s talk
              </ArrowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
