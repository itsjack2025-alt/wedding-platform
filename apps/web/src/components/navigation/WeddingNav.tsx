'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WeddingMonogram } from '@/components/branding/WeddingLogos';

const navLinks = [
  { href: '/our-story', label: 'Our Story' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/videos', label: 'Videos' },
  { href: '/blessings', label: 'Blessings' },
];

export function WeddingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-wedding-border py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="container-wide">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="transition-transform duration-300 group-hover:scale-105">
                <WeddingMonogram variant={isScrolled ? 'white' : 'gold'} size={40} />
              </div>
              <div className="hidden sm:block">
                <p className={cn(
                  'font-heading text-sm tracking-widest transition-colors duration-300',
                  isScrolled ? 'text-wedding-text' : 'text-gold-400'
                )}>
                  VINAY <span className="text-wedding-primary">&amp;</span> SNEHA
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'relative font-body text-sm tracking-wide transition-colors duration-300 group',
                      isScrolled ? 'text-wedding-muted hover:text-wedding-text' : 'text-wedding-text/80 hover:text-gold-400'
                    )}
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-400 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Couple name — desktop only */}
              <div className="hidden xl:flex items-center gap-2">
                <Heart className="w-4 h-4 text-wedding-primary fill-wedding-primary animate-pulse" />
                <span className={cn(
                  'font-script text-lg transition-colors duration-300',
                  isScrolled ? 'text-wedding-muted' : 'text-gold-400'
                )}>
                  Forever & Forever
                </span>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'lg:hidden p-2 rounded-lg transition-colors duration-300',
                  isScrolled ? 'text-wedding-text hover:bg-white/10' : 'text-gold-400 hover:bg-white/5'
                )}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-wedding-surface border-l border-wedding-border p-8 pt-24"
            >
              <nav className="flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block font-heading text-2xl text-wedding-text hover:text-gold-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-12 pt-8 border-t border-wedding-border">
                <WeddingMonogram variant="gold" size={60} className="mx-auto" />
                <p className="text-center font-script text-wedding-muted mt-4">
                  Two souls. One journey.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
