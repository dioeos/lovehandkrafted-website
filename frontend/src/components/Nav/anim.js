export const opacity = {
  initial: {
    opacity: 0,
  },
  open: {
    opacity: 1,
    transition: { duration: 0.35 },
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.35 },
  },
};

const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] };

export const height = {
  initial: {
    height: 0,
  },
  enter: {
    height: 300,
    transition,
  },

  exit: {
    height: 0,
    transition,
  },
};

export const background = {
  initial: {
    height: 0,
  },

  open: {
    height: "100vh",

    transition,
  },

  closed: {
    height: 0,
    transition,
  },
};

export const translate = {
  initial: {
    y: "100%",
    opacity: 0,
  },

  enter: (i) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: i[0] },
  }),

  exit: (i) => ({
    y: "100%",
    opacity: 0,
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: i[1] },
  }),
};
