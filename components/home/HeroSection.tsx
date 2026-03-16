'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  const { t, lang } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; vx: number; vy: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden grain-overlay">
      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-bg via-brand-bg to-[#0D1020]" />

      {/* Animated gold line left margin */}
      <div className="absolute left-8 top-1/4 bottom-1/4 w-px">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full bg-gradient-to-b from-transparent via-brand-gold to-transparent origin-top"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-mono px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                AI Strategist · Trainer · Entrepreneur
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className={cn(
                'font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6',
                lang === 'kh' && 'font-khmer text-4xl md:text-5xl'
              )}
            >
              <span className="text-brand-cream">{lang === 'kh' ? 'ការគិតពី' : 'AI Thinking'}</span>
              <br />
              <span className="gold-text">{lang === 'kh' ? 'AI' : 'for Cambodia\'s'}</span>
              <br />
              <span className="text-brand-cream">{lang === 'kh' ? 'សម្រាប់អនាគត' : 'Future'}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-brand-muted text-lg md:text-xl leading-relaxed mb-10 max-w-md"
            >
              {t('hero.sub')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/blog" className="btn-primary text-base px-8 py-3.5">
                {t('hero.cta1')} <ArrowRight size={16} />
              </Link>
              <Link href="/services" className="btn-ghost text-base px-8 py-3.5">
                {t('hero.cta2')}
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="flex gap-8 mt-12 pt-8 border-t border-brand-border"
            >
              {[
                { n: '23+', label: 'Years of Leadership' },
                { n: '1000s', label: 'People Trained' },
                { n: 'ASEAN', label: 'Conference Speaker' },
              ].map(s => (
                <div key={s.n}>
                  <div className="font-display text-2xl font-bold text-brand-gold">{s.n}</div>
                  <div className="text-brand-muted text-xs font-mono mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-[3/4] max-w-sm mx-auto">
              {/* Gold frame */}
              <div className="absolute inset-0 rounded-2xl border border-brand-gold/30 rotate-3 scale-[1.02]" />
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <Image
                  src="/images/sopheap.jpg"
                  alt="HIN Sopheap"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 via-transparent to-transparent" />
              </div>
              {/* Name card at bottom */}
              <div className="absolute bottom-6 left-6 right-6 bg-brand-bg/80 backdrop-blur-sm border border-brand-gold/20 rounded-xl p-4">
                <p className="font-display text-lg font-bold text-brand-cream">HIN Sopheap</p>
                <p className="text-brand-gold text-xs font-mono">Co-Founder & Chairman, Cambodia AI Group</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-muted"
      >
        <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </motion.div>
    </section>
  );
}
