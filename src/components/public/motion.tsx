"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function RiseIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.72, delay, ease: [0.21, 0.86, 0.28, 0.99] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.86, 0.28, 0.99] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GoldOrbit({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.92, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 360 }}
      transition={{
        opacity: { duration: 0.8, ease: "easeOut" },
        scale: { duration: 1.1, ease: [0.21, 0.86, 0.28, 0.99] },
        rotate: { duration: 34, repeat: Infinity, ease: "linear" },
      }}
      className={cn("tuodonto-orbit", className)}
    />
  );
}

export function HoverLift({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
