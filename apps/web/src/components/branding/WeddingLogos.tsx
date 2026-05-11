'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type LogoVariant = 'gold' | 'white' | 'dark' | 'outline' | 'minimal';
type LogoStyle = 'monogram' | 'crest' | 'signature' | 'wordmark' | 'floral';

interface WeddingMonogramProps {
  variant?: LogoVariant;
  size?: number;
  animated?: boolean;
  className?: string;
}

// ============================================================
// VS Monogram — Primary Logo
// ============================================================
export function WeddingMonogram({ variant = 'gold', size = 120, animated = false, className }: WeddingMonogramProps) {
  const getColors = () => {
    switch (variant) {
      case 'gold':
        return { primary: '#d4af37', secondary: '#f5d06a', stroke: '#c4980f', glow: 'rgba(212,160,23,0.4)' };
      case 'white':
        return { primary: '#f5f0e6', secondary: '#ffffff', stroke: 'rgba(245,240,230,0.5)', glow: 'rgba(245,240,230,0.2)' };
      case 'dark':
        return { primary: '#1a1212', secondary: '#2a1515', stroke: 'rgba(26,18,18,0.5)', glow: 'rgba(196,30,58,0.2)' };
      case 'outline':
        return { primary: 'transparent', secondary: '#d4af37', stroke: '#d4af37', glow: 'transparent' };
      case 'minimal':
        return { primary: '#a08060', secondary: '#c41e3a', stroke: 'rgba(160,128,96,0.3)', glow: 'transparent' };
    }
  };

  const colors = getColors();
  const isOutline = variant === 'outline';

  const content = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#f5d06a" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
        <linearGradient id="gold-gradient-vertical" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5d06a" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#c4980f" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="soft-glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer decorative ring */}
      {!isOutline && (
        <circle
          cx="60"
          cy="60"
          r="56"
          stroke={colors.primary}
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
        />
      )}

      {/* Decorative dots */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 60 + 50 * Math.cos(rad);
        const y = 60 + 50 * Math.sin(rad);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="1.5"
            fill={colors.primary}
            opacity="0.6"
          />
        );
      })}

      {/* Heart in center top */}
      <path
        d="M60 28 C60 24 56 20 52 20 C46 20 43 26 43 30 C43 40 60 48 60 48 C60 48 77 40 77 30 C77 26 74 20 68 20 C64 20 60 24 60 28Z"
        fill={variant === 'gold' ? 'url(#gold-gradient)' : colors.secondary}
        filter="url(#soft-glow)"
        opacity="0.9"
      />

      {/* V Letterform */}
      <text
        x="28"
        y="88"
        fontFamily='"Playfair Display", serif'
        fontSize="48"
        fontWeight="400"
        fill={isOutline ? colors.stroke : 'url(#gold-gradient-vertical)'}
        filter={variant === 'gold' ? 'url(#glow)' : undefined}
      >
        V
      </text>

      {/* S Letterform */}
      <text
        x="62"
        y="88"
        fontFamily='"Playfair Display", serif'
        fontSize="48"
        fontWeight="400"
        fill={isOutline ? colors.stroke : 'url(#gold-gradient-vertical)'}
        filter={variant === 'gold' ? 'url(#glow)' : undefined}
      >
        S
      </text>

      {/* Connecting flourish under letters */}
      <path
        d="M32 94 Q60 100 88 94"
        stroke={colors.primary}
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />

      {/* Small decorative elements */}
      <circle cx="52" cy="95" r="1" fill={colors.primary} opacity="0.4" />
      <circle cx="68" cy="95" r="1" fill={colors.primary} opacity="0.4" />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn('flex items-center justify-center', className)}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={cn('flex items-center justify-center', className)}>{content}</div>;
}

// ============================================================
// Wedding Crest — Ceremonial Shield
// ============================================================
export function WeddingCrest({ variant = 'gold', size = 120, animated = false, className }: WeddingMonogramProps) {
  const colors = variant === 'gold'
    ? { primary: '#d4af37', secondary: '#c41e3a', text: '#f5f0e6' }
    : variant === 'white'
    ? { primary: '#f5f0e6', secondary: '#c41e3a', text: '#ffffff' }
    : { primary: '#1a1212', secondary: '#c41e3a', text: '#1a1212' };

  const content = (
    <svg width={size} height={size * 1.2} viewBox="0 0 120 144" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="crest-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#f5d06a" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
      </defs>

      {/* Shield shape */}
      <path
        d="M10 10 L110 10 L110 80 Q110 120 60 140 Q10 120 10 80 Z"
        stroke={colors.primary}
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />

      {/* Inner shield */}
      <path
        d="M20 20 L100 20 L100 75 Q100 110 60 128 Q20 110 20 75 Z"
        stroke={colors.primary}
        strokeWidth="0.5"
        fill={variant === 'gold' ? 'rgba(212,160,23,0.05)' : 'transparent'}
        opacity="0.4"
      />

      {/* Monogram inside shield */}
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fontFamily='"Cinzel Decorative", serif'
        fontSize="36"
        fontWeight="700"
        fill="url(#crest-gold)"
      >
        VS
      </text>

      {/* Banner above */}
      <path
        d="M15 5 L105 5 L100 15 L60 12 L20 15 Z"
        fill={colors.primary}
        opacity="0.8"
      />

      {/* Names on banner */}
      <text x="60" y="12" textAnchor="middle" fontFamily="sans-serif" fontSize="6" fill={colors.text} fontWeight="600">
        VINAY &amp; SNEHA
      </text>

      {/* Decorative corners */}
      <circle cx="10" cy="10" r="3" fill={colors.primary} opacity="0.6" />
      <circle cx="110" cy="10" r="3" fill={colors.primary} opacity="0.6" />
      <circle cx="60" cy="138" r="3" fill={colors.primary} opacity="0.6" />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={cn('flex items-center justify-center', className)}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={cn('flex items-center justify-center', className)}>{content}</div>;
}

// ============================================================
// Wedding Signature — Script Logo
// ============================================================
export function WeddingSignature({ variant = 'gold', size = 200, animated = false, className }: WeddingMonogramProps) {
  const strokeColor = variant === 'gold' ? '#d4af37' : variant === 'white' ? '#f5f0e6' : '#1a1212';

  const content = (
    <svg width={size} height={size * 0.5} viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="signature-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#f5d06a" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
      </defs>

      {/* Vinay signature */}
      <text
        x="100"
        y="45"
        textAnchor="end"
        fontFamily='"Dancing Script", cursive'
        fontSize="28"
        fill={variant === 'gold' ? 'url(#signature-gold)' : strokeColor}
        opacity="0.95"
      >
        Vinay
      </text>

      {/* Ampersand */}
      <text
        x="100"
        y="70"
        textAnchor="middle"
        fontFamily='"Playfair Display", serif'
        fontSize="20"
        fill={variant === 'gold' ? '#c41e3a' : strokeColor}
        opacity="0.8"
      >
        &amp;
      </text>

      {/* Sneha signature */}
      <text
        x="100"
        y="95"
        textAnchor="start"
        fontFamily='"Dancing Script", cursive'
        fontSize="28"
        fill={variant === 'gold' ? 'url(#signature-gold)' : strokeColor}
        opacity="0.95"
      >
        Sneha
      </text>

      {/* Underline flourish */}
      <path
        d="M30 50 Q100 55 170 50"
        stroke={strokeColor}
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn('flex items-center justify-center', className)}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={cn('flex items-center justify-center', className)}>{content}</div>;
}

// ============================================================
// Wedding Wordmark — Full Name Logo
// ============================================================
export function WeddingWordmark({ variant = 'gold', size = 200, animated = false, className }: WeddingMonogramProps) {
  const textColor = variant === 'gold' ? '#d4af37' : variant === 'white' ? '#f5f0e6' : '#1a1212';

  const content = (
    <svg width={size} height={size * 0.3} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Vinay Kumar */}
      <text
        x="100"
        y="28"
        textAnchor="middle"
        fontFamily='"Playfair Display", serif'
        fontSize="22"
        fontWeight="400"
        letterSpacing="3"
        fill={textColor}
      >
        VINAY KUMAR
      </text>

      {/* Heart separator */}
      <path
        d="M94 38 C94 36 96 34 98 34 C100 34 102 36 102 38 C102 42 100 44 100 44 C100 44 98 42 98 38 C98 36 96 34 94 38Z"
        fill={textColor}
        opacity="0.7"
      />

      {/* Sneha */}
      <text
        x="100"
        y="54"
        textAnchor="middle"
        fontFamily='"Playfair Display", serif'
        fontSize="22"
        fontWeight="400"
        letterSpacing="3"
        fill={textColor}
      >
        SNEHA
      </text>

      {/* Decorative lines */}
      <line x1="10" y1="30" x2="78" y2="30" stroke={textColor} strokeWidth="0.5" opacity="0.3" />
      <line x1="122" y1="30" x2="190" y2="30" stroke={textColor} strokeWidth="0.5" opacity="0.3" />
      <line x1="10" y1="52" x2="78" y2="52" stroke={textColor} strokeWidth="0.5" opacity="0.3" />
      <line x1="122" y1="52" x2="190" y2="52" stroke={textColor} strokeWidth="0.5" opacity="0.3" />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={cn('flex items-center justify-center', className)}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={cn('flex items-center justify-center', className)}>{content}</div>;
}

// ============================================================
// Wedding Floral — Decorative Floral Monogram
// ============================================================
export function WeddingFloral({ variant = 'gold', size = 120, animated = false, className }: WeddingMonogramProps) {
  const petalColor = variant === 'gold' ? '#d4af37' : variant === 'white' ? '#f5f0e6' : '#c41e3a';
  const textColor = variant === 'gold' ? '#d4af37' : variant === 'white' ? '#f5f0e6' : '#1a1212';

  const content = (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 60 + 35 * Math.cos(rad);
        const y = 60 + 35 * Math.sin(rad);
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="12"
            ry="20"
            fill={petalColor}
            opacity="0.15"
            transform={`rotate(${angle + 90} ${x} ${y})`}
          />
        );
      })}

      {/* Inner petals */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 60 + 22 * Math.cos(rad);
        const y = 60 + 22 * Math.sin(rad);
        return (
          <ellipse
            key={`inner-${i}`}
            cx={x}
            cy={y}
            rx="8"
            ry="14"
            fill={petalColor}
            opacity="0.25"
            transform={`rotate(${angle + 90} ${x} ${y})`}
          />
        );
      })}

      {/* Center circle */}
      <circle cx="60" cy="60" r="18" fill={petalColor} opacity="0.2" />
      <circle cx="60" cy="60" r="14" fill={petalColor} opacity="0.3" />

      {/* VS text in center */}
      <text
        x="60"
        y="66"
        textAnchor="middle"
        fontFamily='"Playfair Display", serif'
        fontSize="14"
        fontWeight="600"
        fill={textColor}
        letterSpacing="1"
      >
        VS
      </text>

      {/* Small decorative dots */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 60 + 50 * Math.cos(rad);
        const y = 60 + 50 * Math.sin(rad);
        return (
          <circle
            key={`dot-${i}`}
            cx={x}
            cy={y}
            r="2"
            fill={petalColor}
            opacity="0.5"
          />
        );
      })}
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn('flex items-center justify-center', className)}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={cn('flex items-center justify-center', className)}>{content}</div>;
}

// ============================================================
// Animated Loading Logo
// ============================================================
export function WeddingLoader({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('flex flex-col items-center justify-center gap-6', className)}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.5 },
          visible: { opacity: 1, scale: 1 },
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <WeddingMonogram variant="gold" size={80} />
      </motion.div>

      <motion.div
        className="flex items-center gap-1"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gold-400"
            variants={{
              hidden: { opacity: 0, scale: 0 },
              visible: { opacity: 0.7, scale: 1 },
            }}
            animate={{
              opacity: [0.3, 0.9, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// Wedding Logo — Smart component that renders the active logo style
// ============================================================
export function WeddingLogo({
  style = 'monogram',
  variant = 'gold',
  size = 120,
  animated = false,
  className,
}: {
  style?: LogoStyle;
  variant?: LogoVariant;
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  const props = { variant, size, animated, className };

  switch (style) {
    case 'monogram':
      return <WeddingMonogram {...props} />;
    case 'crest':
      return <WeddingCrest {...props} />;
    case 'signature':
      return <WeddingSignature {...props} />;
    case 'wordmark':
      return <WeddingWordmark {...props} />;
    case 'floral':
      return <WeddingFloral {...props} />;
    default:
      return <WeddingMonogram {...props} />;
  }
}
