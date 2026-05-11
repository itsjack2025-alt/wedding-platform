'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart } from 'lucide-react';

const storyEntries = [
  {
    title: 'The First Meeting',
    description:
      'Where it all began — a chance encounter that changed everything. Neither of us knew that this moment would be the first page of our forever story.',
    date: 'June 2024',
    icon: '✨',
  },
  {
    title: 'The First Conversation',
    description:
      'What started as polite hellos soon turned into late-night conversations that never seemed to end. Every call felt like coming home.',
    date: 'July 2024',
    icon: '💫',
  },
  {
    title: 'Falling In Love',
    description:
      "It wasn't a single moment — it was a thousand little things. Shared laughter, quiet understanding, and a feeling that this was exactly where we were meant to be.",
    date: 'September 2024',
    icon: '💕',
  },
  {
    title: 'The Proposal',
    description:
      'Under a sky full of stars, with trembling hands and a heart full of love, the most important question was asked — and the most beautiful answer was given.',
    date: 'December 2024',
    icon: '💍',
  },
  {
    title: 'The Engagement',
    description:
      "Surrounded by our families' blessings and love, we took our first step toward forever — two rings, infinite promises, and a joy that knows no bounds.",
    date: 'January 2026',
    icon: '🎊',
  },
  {
    title: 'The Wedding',
    description:
      'Two souls, one journey. The day we have dreamed of, planned for, and waited for — finally here. May 2026.',
    date: 'May 2026',
    icon: '🪔',
  },
];

function StoryCard({
  entry,
  index,
}: {
  entry: (typeof storyEntries)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative flex items-center gap-8 mb-12 last:mb-0">
      {/* Left side — content or empty */}
      <div className={`flex-1 ${isLeft ? 'text-right pr-8' : ''}`}>
        {isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <StoryContent entry={entry} />
          </motion.div>
        ) : (
          <div />
        )}
      </div>

      {/* Center line */}
      <div className="relative flex flex-col items-center">
        {/* Timeline node */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl border-2"
          style={{
            background: 'linear-gradient(135deg, #c41e3a, #a01830)',
            borderColor: '#d4af37',
            boxShadow: '0 0 20px rgba(196,30,58,0.4)',
          }}
        >
          <span>{entry.icon}</span>
        </motion.div>

        {/* Connecting line */}
        <div className="w-px flex-1 bg-gradient-to-b from-gold-400/50 via-gold-400/20 to-transparent min-h-[60px]" />
      </div>

      {/* Right side */}
      <div className={`flex-1 ${!isLeft ? 'text-left pl-8' : ''}`}>
        {!isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <StoryContent entry={entry} />
          </motion.div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

function StoryContent({ entry }: { entry: (typeof storyEntries)[0] }) {
  return (
    <div className="group">
      <p
        className="text-xs tracking-widest uppercase mb-2"
        style={{ color: '#d4af37', fontFamily: 'var(--font-body)' }}
      >
        {entry.date}
      </p>
      <h3
        className="font-heading text-2xl sm:text-3xl mb-3 text-wedding-text group-hover:text-gold-400 transition-colors duration-300"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {entry.title}
      </h3>
      <p
        className="font-body text-wedding-muted leading-relaxed max-w-md"
        style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.05rem' }}
      >
        {entry.description}
      </p>
    </div>
  );
}

export function LoveStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });

  return (
    <section
      id="our-story"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(196,30,58,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 50%, rgba(212,160,23,0.06) 0%, transparent 50%),
          #0f0a0a
        `,
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

      <div className="container-narrow" ref={sectionRef}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <Heart className="w-5 h-5 text-wedding-primary fill-wedding-primary" />
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: '#d4af37' }}
            >
              Our Love Story
            </span>
            <Heart className="w-5 h-5 text-wedding-primary fill-wedding-primary" />
          </motion.div>

          <h2
            className="font-display text-4xl sm:text-5xl md:text-6xl mb-4"
            style={{
              fontFamily: 'var(--font-cinzel)',
              background: 'linear-gradient(135deg, #f5f0e6, #d4af37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            From First Hello
          </h2>
          <p className="font-script text-2xl text-wedding-muted">
            To Forever Hello
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {storyEntries.map((entry, index) => (
            <StoryCard key={entry.title} entry={entry} index={index} />
          ))}
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16 pt-16 border-t border-wedding-border"
        >
          <p
            className="font-script text-3xl text-gold-400 mb-4"
          >
            "And they lived happily ever after..."
          </p>
          <p className="font-body text-wedding-muted text-sm">
            Starting May 6th, 2026
          </p>
        </motion.div>
      </div>
    </section>
  );
}
