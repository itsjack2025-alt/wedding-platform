'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Heart, Send, MapPin } from 'lucide-react';

const sampleBlessings = [
  {
    id: '1',
    authorName: 'Priya Sharma',
    message:
      'Wishing Vinay and Sneha a lifetime of love, laughter, and happiness together. You two are truly meant for each other!',
    location: 'Bengaluru',
    isFeatured: true,
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    authorName: 'Rajesh Kumar',
    message:
      'May your journey together be filled with endless joy and boundless love. Congratulations on this beautiful union!',
    location: 'Bidar',
    isFeatured: true,
    createdAt: '2026-01-14',
  },
  {
    id: '3',
    authorName: 'Anita Reddy',
    message:
      'So happy to see two wonderful souls come together. Wishing you both all the love and blessings in the world!',
    location: 'Hyderabad',
    isFeatured: true,
    createdAt: '2026-01-13',
  },
];

export function BlessingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setName('');
    setMessage('');
  };

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 100%, rgba(196,30,58,0.1) 0%, transparent 50%),
          #0f0a0a
        `,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

      <div className="container-narrow" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(196,30,58,0.2), rgba(212,160,23,0.2))',
              border: '1px solid rgba(212,160,23,0.3)',
            }}
          >
            <Heart className="w-7 h-7 text-wedding-primary fill-wedding-primary" />
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
            Leave Your Blessings
          </h2>
          <p className="font-script text-2xl text-wedding-muted">
            Share your wishes with Vinay &amp; Sneha
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Blessing form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div
              className="rounded-2xl p-8 border"
              style={{
                background: 'rgba(26,18,18,0.5)',
                borderColor: 'rgba(212,160,23,0.2)',
              }}
            >
              <h3
                className="font-heading text-xl mb-6 text-wedding-text"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Write Your Blessing
              </h3>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                      style={{
                        background: 'linear-gradient(135deg, rgba(196,30,58,0.3), rgba(212,160,23,0.3))',
                      }}
                    >
                      <Heart className="w-8 h-8 text-gold-400 fill-gold-400" />
                    </motion.div>
                    <p className="font-script text-2xl text-gold-400 mb-2">
                      Thank you for your blessing!
                    </p>
                    <p className="font-body text-wedding-muted text-sm">
                      Your message has been received with love.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-sm text-gold-400 underline underline-offset-4"
                    >
                      Write another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div>
                      <label
                        className="block text-xs tracking-wider uppercase mb-2 text-wedding-muted"
                        htmlFor="name"
                      >
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-black/30 border transition-colors duration-300 focus:outline-none focus:border-gold-400/50 text-wedding-text placeholder:text-wedding-muted/50"
                        style={{ borderColor: 'rgba(212,160,23,0.2)' }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs tracking-wider uppercase mb-2 text-wedding-muted"
                        htmlFor="message"
                      >
                        Your Blessing
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your wishes and blessings..."
                        required
                        rows={4}
                        maxLength={1000}
                        className="w-full px-4 py-3 rounded-lg bg-black/30 border transition-colors duration-300 focus:outline-none focus:border-gold-400/50 text-wedding-text placeholder:text-wedding-muted/50 resize-none"
                        style={{ borderColor: 'rgba(212,160,23,0.2)' }}
                      />
                      <p className="text-right text-xs text-wedding-muted mt-1">
                        {message.length}/1000
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !name.trim() || !message.trim()}
                      className="w-full relative inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                      style={{
                        background: 'linear-gradient(135deg, #c41e3a, #a01830)',
                        boxShadow: '0 4px 20px rgba(196,30,58,0.3)',
                      }}
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          <span className="font-heading text-sm tracking-wider text-white uppercase">
                            Send Blessing
                          </span>
                          <Send className="w-4 h-4 text-white" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Sample blessings preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-5"
          >
            <h3
              className="font-heading text-lg text-wedding-muted"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Recent Blessings
            </h3>

            {sampleBlessings.map((blessing, i) => (
              <motion.div
                key={blessing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="rounded-xl p-5 border"
                style={{
                  background: 'rgba(26,18,18,0.3)',
                  borderColor: 'rgba(212,160,23,0.15)',
                }}
              >
                <p
                  className="font-body text-wedding-text leading-relaxed mb-4"
                  style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.05rem' }}
                >
                  "{blessing.message}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-sm text-gold-400">{blessing.authorName}</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-wedding-muted" />
                      <span className="text-xs text-wedding-muted">{blessing.location}</span>
                    </div>
                  </div>
                  {blessing.isFeatured && (
                    <span
                      className="text-[10px] tracking-wider uppercase px-2 py-1 rounded"
                      style={{
                        background: 'rgba(212,160,23,0.1)',
                        color: '#d4af37',
                        border: '1px solid rgba(212,160,23,0.2)',
                      }}
                    >
                      Featured
                    </span>
                  )}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="text-center pt-4"
            >
              <a
                href="/blessings"
                className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-wedding-accent transition-colors"
              >
                View all blessings
                <Heart className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
