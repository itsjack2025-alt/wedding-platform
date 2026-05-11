'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Instagram, Youtube } from 'lucide-react';
import { WeddingMonogram } from '@/components/branding/WeddingLogos';
import { WeddingLogo } from '@/components/branding/WeddingLogos';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/videos', label: 'Videos' },
  { href: '/blessings', label: 'Blessings' },
];

export function WeddingFooter() {
  const weddingDate = new Date('2026-05-06T06:00:00+05:30');
  const formattedDate = weddingDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <footer className="relative bg-wedding-surface border-t border-wedding-border">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

      <div className="container-wide section-padding">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
          {/* Logo & tagline */}
          <div className="md:col-span-1 text-center md:text-left">
            <WeddingLogo style="monogram" variant="gold" size={60} className="mb-4" />
            <p className="font-script text-xl text-wedding-accent mb-2">
              Vinay Kumar &amp; Sneha
            </p>
            <p className="font-body text-wedding-muted text-sm">
              Two souls. One journey. Forever together.
            </p>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <h3 className="font-heading text-sm tracking-widest text-gold-400 mb-6 uppercase">
              Explore
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-wedding-muted hover:text-wedding-text transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Wedding details */}
          <div className="text-center md:text-right">
            <h3 className="font-heading text-sm tracking-widest text-gold-400 mb-6 uppercase">
              Save the Date
            </h3>
            <div className="space-y-2">
              <p className="font-body text-wedding-text">
                <span className="text-wedding-primary font-heading">Muhurtham</span>
              </p>
              <p className="font-body text-wedding-muted text-sm">{formattedDate}</p>
              <p className="font-body text-wedding-muted text-sm">
                Gowramma Ramaiah Kalyana Mandira
              </p>
              <p className="font-body text-wedding-muted text-sm">Bengaluru, Karnataka</p>
            </div>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="pt-8 border-t border-wedding-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social links */}
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-wedding-muted hover:text-gold-400 transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-wedding-muted hover:text-gold-400 transition-colors duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <div className="flex items-center gap-2 text-wedding-muted text-xs">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-wedding-primary fill-wedding-primary animate-pulse" />
              <span>for Vinay &amp; Sneha</span>
              <span className="mx-2">•</span>
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
