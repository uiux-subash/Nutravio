import { Nav } from "@/components/Nav";
import { Hero } from "@/components/hero/Hero";
import { Science, Solutions, Statement, Vision } from "@/components/sections/Story";
import { Programs } from "@/components/sections/Programs";
import { Crops } from "@/components/sections/Crops";
import { Solves } from "@/components/sections/Platform";
import { CaseStudies, Contact, Footer, Insights } from "@/components/sections/Closing";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Vision />
        <Solutions />
        <Science />
        <Programs />
        <Solves />
        <Crops />
        <CaseStudies />
        <Insights />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
