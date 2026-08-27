import { useCallback, useEffect, useState } from 'react';

import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { content } from '@/lib/content';

import { Preloader } from '@/components/Preloader';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { Intro } from '@/components/Intro';
import { Businesses } from '@/components/Businesses';
import { Work } from '@/components/Work';
import { Reviews } from '@/components/Reviews';
import { About } from '@/components/About';
import { Vision } from '@/components/Vision';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

/**
 * The Invytra parent site: ARRIVE → UNDERSTAND → EXPLORE (3 businesses) →
 * BELIEVE (reviews/about) → IMAGINE → ACT.
 */
export default function App() {
  useSmoothScroll();
  const [booted, setBooted] = useState(false);

  const handleBoot = useCallback(() => setBooted(true), []);

  useEffect(() => {
    if (!content.loading.enabled) setBooted(true);
  }, []);

  // Drop the static HTML boot screen once React owns the DOM.
  useEffect(() => {
    document.getElementById('boot')?.remove();
  }, []);

  return (
    <div className="relative">
      {content.loading.enabled && <Preloader onDone={handleBoot} />}
      <Navbar booted={booted} />

      <main id="home" className="relative">
        <Hero booted={booted} />
        <Marquee />
        <Intro />
        <Businesses />
        <Work />
        <Reviews />
        <About />
        <Vision />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
