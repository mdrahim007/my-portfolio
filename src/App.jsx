import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CanvasBackground from './components/CanvasBackground';
import Navbar from './components/Navbar';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { Experience } from './components/Experience';
import { ProjectShowcases } from './components/ProjectShowcases';
import { DocumentationAndFeedback } from './components/DocumentationAndFeedback';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { CustomCursor } from './components/CustomCursor';
import { WhatsAppButton } from './components/BackToTop';
import { TiltEffect } from './components/TiltEffect';
import { IntroScreen } from './components/IntroScreen';
import { HireMeButton } from './components/HireMeButton';


gsap.registerPlugin(ScrollTrigger);

function App() {
  const [showIntro, setShowIntro] = useState(true);
  useEffect(() => {
    // ─── Lenis smooth scroll ────────────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      window.__lenis = null;
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <>
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
      <Navbar />
      <HireMeButton />
      <CustomCursor />
      <TiltEffect />
      <CanvasBackground />
      <main>
        <Hero />
        <BentoGrid />
        <Experience />
        <ProjectShowcases />
        <DocumentationAndFeedback />
        <About />
        <Contact />
      </main>
      <WhatsAppButton />

    </>
  );
}

export default App;
