const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] };
export const size = {
  initial: {
    width: 0,
  },
  enter: {
    width: "var(--sidebar-w)",
    transition,
  },
  exit: {
    width: 0,
    transition,
  },
};

export const overlay = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition,
  },
  exit: {
    opacity: 0,
    transition,
  },
};
