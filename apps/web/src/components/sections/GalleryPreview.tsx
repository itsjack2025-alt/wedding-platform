'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Images, ArrowRight, Heart } from 'lucide-react';

const previewImages = [
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    alt: 'Wedding ceremony',
    span: 'col-span-1 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80',
    alt: 'Couple portrait',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=80',
    alt: 'Wedding decorations',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80',
    alt: 'Bridal portrait',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=600&q=80',
    alt: 'Wedding rings',
    span: 'col-span-1 row-span-1',
  },
];

export function GalleryPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: `
          linear-gradient(to bottom, #0f0a0a 0%, rgba(26,18,18,0.5) 50%, #0f0a0a 100%)
        `,
      }}
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

      <div className="container-wide" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Images className="w-5 h-5 text-gold-400" />
              <span className="text-xs tracking-widest uppercase text-gold-400">
                Memories Captured
              </span>
            </div>
            <h2
              className="font-display text-4xl sm:text-5xl md:text-6xl"
              style={{
                fontFamily: 'var(--font-cinzel)',
                background: 'linear-gradient(135deg, #f5f0e6, #d4af37)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Gallery Preview
            </h2>
          </div>

          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 hover:scale-105"
            style={{
              borderColor: 'rgba(212,160,23,0.4)',
              background: 'rgba(0,0,0,0.3)',
            }}
          >
            <span className="font-heading text-sm tracking-wider text-gold-400 uppercase">
              View All Photos
            </span>
            <ArrowRight className="w-4 h-4 text-gold-400 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Masonry-style grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]"
        >
          {previewImages.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className={`relative rounded-xl overflow-hidden group cursor-pointer ${img.span}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Heart on hover */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-12 mt-12 pt-12 border-t border-wedding-border"
        >
          {[
            { value: '500+', label: 'Photos' },
            { value: '3', label: 'Events' },
            { value: '10+', label: 'Videos' },
            { value: '∞', label: 'Memories' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <p
                className="font-display text-3xl text-gold-400"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                {stat.value}
              </p>
              <p className="font-body text-wedding-muted text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
