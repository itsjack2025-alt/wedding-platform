'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

const events = [
  {
    slug: 'reception-bengaluru',
    name: 'Reception',
    location: 'Bengaluru',
    venue: 'Gowramma Ramaiah Kalyana Mandira',
    date: '2026-05-05T18:00:00+05:30',
    endTime: '23:00',
    type: 'reception',
    color: '#c41e3a',
    description: 'An elegant evening reception celebrating the union of Vinay and Sneha.',
    gradient: 'linear-gradient(135deg, rgba(196,30,58,0.3), rgba(196,30,58,0.05))',
    featured: true,
  },
  {
    slug: 'muhurtham',
    name: 'Muhurtham Ceremony',
    location: 'Bengaluru',
    venue: 'Gowramma Ramaiah Kalyana Mandira',
    date: '2026-05-06T11:30:00+05:30',
    endTime: '14:00',
    type: 'wedding',
    color: '#d4af37',
    description: 'The sacred Muhurtham ceremony — the heart of our wedding celebration.',
    gradient: 'linear-gradient(135deg, rgba(212,160,23,0.3), rgba(212,160,23,0.05))',
    featured: true,
  },
  {
    slug: 'reception-bidar',
    name: 'Reception',
    location: 'Bidar',
    venue: 'Nandi Function Hall',
    date: '2026-05-09T19:00:00+05:30',
    endTime: '23:00',
    type: 'reception',
    color: '#c41e3a',
    description: 'A warm reception celebrating with extended family and our beloved community.',
    gradient: 'linear-gradient(135deg, rgba(196,30,58,0.25), rgba(196,30,58,0.05))',
    featured: false,
  },
];

function EventCard({
  event,
  index,
}: {
  event: (typeof events)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/events/${event.slug}`} className="group block">
        <div
          className="relative rounded-2xl overflow-hidden border transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
          style={{
            borderColor: `${event.color}30`,
            background: event.gradient,
          }}
        >
          {/* Accent top bar */}
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, transparent, ${event.color}, transparent)` }}
          />

          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs tracking-wider uppercase mb-3"
                  style={{
                    background: `${event.color}15`,
                    color: event.color,
                    border: `1px solid ${event.color}30`,
                  }}
                >
                  {event.type}
                </span>
                <h3
                  className="font-heading text-2xl sm:text-3xl text-wedding-text group-hover:text-gold-400 transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {event.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4" style={{ color: event.color }} />
                  <span className="font-body text-sm text-wedding-muted">{event.location}</span>
                </div>
              </div>

              {event.featured && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] tracking-wider uppercase"
                  style={{ background: `${event.color}15`, color: event.color }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: event.color }} />
                  Featured
                </span>
              )}
            </div>

            {/* Date & Time */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-wedding-muted" />
                <span className="font-body text-sm text-wedding-text">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-wedding-muted" />
                <span className="font-body text-sm text-wedding-muted">
                  {formattedTime} — {event.endTime} IST
                </span>
              </div>
            </div>

            {/* Venue */}
            <p className="font-body text-sm text-wedding-muted mb-6 italic">
              {event.venue}
            </p>

            {/* Countdown */}
            <div className="mb-6">
              <CountdownTimer targetDate={event.date} />
            </div>

            {/* CTA */}
            <div
              className="flex items-center gap-2 text-sm font-heading transition-colors duration-300 group-hover:gap-3"
              style={{ color: event.color }}
            >
              <span className="tracking-wider uppercase text-xs">View Details</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function EventsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      id="events"
      className="relative py-24 md:py-32"
      style={{
        background: `
          radial-gradient(ellipse at 50% 0%, rgba(212,160,23,0.08) 0%, transparent 50%),
          #0f0a0a
        `,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

      <div className="container-wide" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-xs tracking-widest uppercase mb-4"
            style={{ color: '#d4af37' }}
          >
            Save the Dates
          </span>
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
            Wedding Events
          </h2>
          <p className="font-script text-2xl text-wedding-muted">
            Three celebrations. One love story.
          </p>
        </motion.div>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <EventCard key={event.slug} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
