import { useCallback, useEffect, useState } from 'react';

import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { content } from '@/lib/content';

import { Preloader } from '@/components/Preloader';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Intro } from '@/components/Intro';
import { Ecosystem } from '@/components/Ecosystem';
import { Ventures } from '@/components/Ventures';
import { FeaturedVenture } from '@/components/FeaturedVenture';
import { Services } from '@/components/Services';
import { Philosophy } from '@/components/Philosophy';
import { About } from '@/components/About';
import { Vision } from '@/components/Vision';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

/**
 * The Invytra main site, sequenced as one continuous story:
 * ARRIVE → UNDERSTAND → EXPLORE → BELIEVE → IMAGINE → ACT.
 */
export default function App() {
  useSmoothScroll();
  const [booted, setBooted] = useState(false);

  const handleBoot = useCallback(() => setBooted(true), []);

  // If the loading screen is disabled, boot straight into the hero.
  useEffect(() => {
    if (!content.loading.enabled) setBooted(true);
  }, []);

  return (
    <div className="relative">
      {content.loading.enabled && <Preloader onDone={handleBoot} />}
      <Navbar booted={booted} />

      <main id="home" className="relative">
        <Hero booted={booted} />
        <Intro />
        <Ecosystem />
        <Ventures />
        <FeaturedVenture />
        <Services />
        <Philosophy />
        <About />
        <Vision />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
