import { HeroSection } from '@/components/sections/HeroSection';
import { LoveStorySection } from '@/components/sections/LoveStorySection';
import { EventsSection } from '@/components/sections/EventsSection';
import { GalleryPreview } from '@/components/sections/GalleryPreview';
import { BlessingSection } from '@/components/sections/BlessingSection';

export default function HomePage() {
  return (
    <>
      {/* Cinematic Hero */}
      <HeroSection
        coupleName1="Vinay Kumar"
        coupleName2="Sneha"
        weddingDate="2026-05-06T06:00:00+05:30"
        tagline="Two souls. One journey. Forever together."
      />

      {/* Love Story Timeline */}
      <LoveStorySection />

      {/* Events Grid */}
      <EventsSection />

      {/* Gallery Preview */}
      <GalleryPreview />

      {/* Blessings / Guest Wishes */}
      <BlessingSection />
    </>
  );
}
