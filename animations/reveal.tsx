'use client';
import { motion, Variants } from 'framer-motion';
import * as React from 'react';

const variants: Record<string, Variants> = {
  fadeUp: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  slideLeft: { hidden: { opacity: 0, x: -32 }, show: { opacity: 1, x: 0 } },
  slideRight: { hidden: { opacity: 0, x: 32 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1 } },
};

export function Reveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  className,
  once = true,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.2 }}
      variants={variants[variant]}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: staggerDelay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, variant = 'fadeUp' }: { children: React.ReactNode; className?: string; variant?: keyof typeof variants }) {
  return (
    <motion.div className={className} variants={variants[variant]} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
