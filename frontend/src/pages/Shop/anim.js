const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] };
export const background = {
  initial: {
    width: 0,
  },

  open: {
    width: "100vw",
    transition,
  },

  closed: {
    width: 0,
    transition,
  },
};
