'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Images, Film, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { WeddingLogo } from '@/components/branding/WeddingLogos';
import { CountdownTimer } from './CountdownTimer';

interface HeroSectionProps {
  videoUrl?: string;
  posterUrl?: string;
  coupleName1?: string;
  coupleName2?: string;
  weddingDate?: string;
  tagline?: string;
}

export function HeroSection({
  videoUrl,
  posterUrl,
  coupleName1 = 'Vinay Kumar',
  coupleName2 = 'Sneha',
  weddingDate = '2026-05-06T06:00:00+05:30',
  tagline = 'Two souls. One journey. Forever together.',
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const { scrollY } = useScroll();
  const videoScale = useTransform(scrollY, [0, 600], [1, 1.15]);
  const overlayOpacity = useTransform(scrollY, [0, 400], [0.5, 0.85]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const contentY = useTransform(scrollY, [0, 400], [0, -80]);

  // Handle video autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {
        // Autoplay blocked — that's fine, show poster
      });
    }
  }, [isMuted, isVideoLoaded]);

  const handleWatchStory = () => {
    // Smooth scroll to story section or open video modal
    document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreMemories = () => {
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[700px] overflow-hidden"
    >
      {/* Video Background */}
      <motion.div
        className="absolute inset-0 scale-110 origin-center"
        style={{ scale: videoScale }}
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={videoUrl}
            poster={posterUrl}
            muted={isMuted}
            loop
            playsInline
            autoPlay
            onLoadedData={() => setIsVideoLoaded(true)}
          />
        ) : (
          /* Cinematic gradient fallback when no video */
          <div
            className="w-full h-full"
            style={{
              background: `
                radial-gradient(ellipse at 30% 20%, rgba(196,30,58,0.4) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(212,160,23,0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, rgba(26,18,18,0.8) 0%, #0f0a0a 100%)
              `,
            }}
          >
            {/* Animated particles / stars effect */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-px h-px rounded-full bg-gold-400"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>

            {/* Decorative circles */}
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
              style={{
                background: 'radial-gradient(circle, #d4af37, transparent)',
                transform: 'translate(-50%, -50%)',
              }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5"
              style={{
                background: 'radial-gradient(circle, #c41e3a, transparent)',
                transform: 'translate(50%, 50%)',
              }}
            />
          </div>
        )}

        {/* Gradient overlay — intensifies on scroll */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom,
                rgba(0,0,0,0.3) 0%,
                rgba(0,0,0,0.4) 30%,
                rgba(0,0,0,0.6) 60%,
                rgba(15,10,10,1) 100%
              )
            `,
            opacity: overlayOpacity,
          }}
        />

        {/* Bottom fade to content */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{
            background: 'linear-gradient(to top, #0f0a0a, transparent)',
          }}
        />
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Pre-title badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-6"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs tracking-widest uppercase"
            style={{
              borderColor: 'rgba(212,160,23,0.4)',
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(8px)',
              color: '#d4af37',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            Wedding Celebrations 2026
          </span>
        </motion.div>

        {/* Animated Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <WeddingLogo style="monogram" variant="gold" size={100} animated />
        </motion.div>

        {/* Couple Names */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-display tracking-wide"
            style={{
              fontFamily: 'var(--font-cinzel)',
              background: 'linear-gradient(135deg, #f5f0e6 0%, #d4af37 40%, #f5d06a 60%, #d4af37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {coupleName1}
          </h1>
          <motion.div
            className="flex items-center justify-center gap-4 my-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <span className="block h-px w-16 sm:w-24" style={{ background: 'linear-gradient(to right, transparent, #d4af37)' }} />
            <span className="font-script text-2xl sm:text-3xl text-wedding-primary">&amp;</span>
            <span className="block h-px w-16 sm:w-24" style={{ background: 'linear-gradient(to left, transparent, #d4af37)' }} />
          </motion.div>
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-display tracking-wide"
            style={{
              fontFamily: 'var(--font-cinzel)',
              background: 'linear-gradient(135deg, #d4af37 0%, #f5d06a 40%, #d4af37 60%, #f5f0e6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {coupleName2}
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="font-script text-xl sm:text-2xl text-wedding-muted mb-8"
        >
          {tagline}
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mb-10"
        >
          <CountdownTimer targetDate={weddingDate} />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={handleWatchStory}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #c41e3a, #a01830)',
              boxShadow: '0 4px 30px rgba(196,30,58,0.4)',
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Play className="w-5 h-5 text-white fill-white" />
            <span className="relative font-heading text-sm tracking-wider text-white uppercase">
              Watch Our Story
            </span>
          </button>

          <button
            onClick={handleExploreMemories}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full border transition-all duration-300 hover:scale-105"
            style={{
              borderColor: 'rgba(212,160,23,0.5)',
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="absolute inset-0 bg-gold-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            <Images className="w-5 h-5 text-gold-400" />
            <span className="relative font-heading text-sm tracking-wider text-gold-400 uppercase">
              Explore Memories
            </span>
          </button>
        </motion.div>

        {/* Mute toggle */}
        {videoUrl && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-24 right-4 sm:top-8 sm:right-8 p-3 rounded-full border transition-all duration-300 hover:bg-white/5"
            style={{ borderColor: 'rgba(212,160,23,0.3)', background: 'rgba(0,0,0,0.3)' }}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-wedding-muted" />
            ) : (
              <Volume2 className="w-5 h-5 text-gold-400" />
            )}
          </motion.button>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={handleExploreMemories}
        >
          <span className="text-[10px] tracking-widest uppercase text-wedding-muted">
            Scroll
          </span>
          <ChevronDown className="w-5 h-5 text-wedding-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
