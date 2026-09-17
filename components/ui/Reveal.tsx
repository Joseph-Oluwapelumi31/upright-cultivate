"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
  type HTMLMotionProps,
} from "motion/react";

/* -------------------------------------------------------------------------- */
/* Shared reveal-on-scroll variants                                          */
/* -------------------------------------------------------------------------- */
/* Extracted from Solution.tsx so every section animates with the same       */
/* timing/easing instead of each file defining its own copy.                 */

export const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

export const imageReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

/* -------------------------------------------------------------------------- */
/* Reveal                                                                     */
/* -------------------------------------------------------------------------- */
/* Generic scroll-triggered reveal wrapper. Renders a motion.div, so use it   */
/* for block-level content; for <li> items inside a staggered <ul>, apply     */
/* `itemReveal` directly to a motion.li instead (see Solution.tsx).          */

interface RevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  amount?: number;
}

export function Reveal({
  children,
  delay = 0,
  amount = 0.2,
  variants = reveal,
  ...props
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={variants}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{
        once: true,
        amount,
      }}
      transition={
        shouldReduceMotion
          ? undefined
          : {
              delay,
            }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}