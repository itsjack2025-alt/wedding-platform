'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/branding/ThemeProvider';
import { getTimeUntil } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const { isDark } = useTheme();
  const [timeLeft, setTimeLeft] = useState(getTimeUntil(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntil(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  return (
    <div className={`flex items-center gap-3 sm:gap-6 ${className ?? ''}`}>
      {units.map(({ value, label }, i) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className="relative"
            style={{
              minWidth: i === 0 ? '4rem' : '3rem',
              minHeight: i === 0 ? '4rem' : '3rem',
            }}
          >
            {/* Number card */}
            <div
              className="absolute inset-0 rounded-lg border"
              style={{
                borderColor: 'rgba(212,160,23,0.3)',
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(8px)',
              }}
            />
            {/* Gold accent top */}
            <div
              className="absolute -top-px left-2 right-2 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
              }}
            />
            {/* Number */}
            <div className="relative flex items-center justify-center w-full h-full">
              <span
                className="font-display text-2xl sm:text-3xl text-gold-400 tabular-nums"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                {String(value).padStart(2, '0')}
              </span>
            </div>
          </div>
          {/* Label */}
          <span
            className="mt-1.5 text-[10px] sm:text-xs tracking-widest uppercase"
            style={{ color: 'rgba(160,128,96,0.8)', fontFamily: 'var(--font-body)' }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
