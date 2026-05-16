export const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.24, ease: "easeOut" }
};

export const stagger = {
  animate: { transition: { staggerChildren: 0.06 } }
};

