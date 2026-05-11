'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react';
import { WeddingLogo } from '@/components/branding/WeddingLogos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(196,30,58,0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(212,160,23,0.1) 0%, transparent 50%),
          #0f0a0a
        `,
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px rounded-full bg-gold-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Back to site link */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-wedding-muted hover:text-gold-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to site
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <WeddingLogo style="monogram" variant="gold" size={80} animated />
          <p
            className="mt-4 font-heading text-sm tracking-widest uppercase"
            style={{ color: '#a08060' }}
          >
            Admin Portal
          </p>
        </div>

        {/* Login card */}
        <div
          className="rounded-2xl p-8 border"
          style={{
            background: 'rgba(26,18,18,0.8)',
            borderColor: 'rgba(212,160,23,0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <h1
            className="text-center font-heading text-2xl text-wedding-text mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Welcome Back
          </h1>
          <p className="text-center text-sm text-wedding-muted mb-8">
            Sign in to manage Vinay &amp; Sneha&apos;s wedding memories
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-xs tracking-wider uppercase mb-2 text-wedding-muted"
                htmlFor="email"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                icon={<Mail className="w-4 h-4" />}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label
                className="block text-xs tracking-wider uppercase mb-2 text-wedding-muted"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  icon={<Lock className="w-4 h-4" />}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-wedding-muted hover:text-wedding-text transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg p-3 text-sm"
                style={{
                  background: 'rgba(220,38,38,0.1)',
                  border: '1px solid rgba(220,38,38,0.3)',
                  color: '#f87171',
                }}
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              loading={isLoading}
              className="w-full mt-6"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-6 text-center border-t" style={{ borderColor: 'rgba(212,160,23,0.1)' }}>
            <p className="text-xs text-wedding-muted">
              Default credentials for setup:
            </p>
            <p className="text-xs text-wedding-muted mt-1">
              admin@vinaykumarandsneha.com / wedding2026
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-wedding-muted mt-6">
          Secured with industry-standard encryption
        </p>
      </motion.div>
    </div>
  );
}
