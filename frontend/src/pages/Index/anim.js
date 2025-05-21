
export const banner = {
    animate: {
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.04,
        },
    },
};

export const letterAnimation = {
    initial: { y: 400},
    animate: {
        y: 0,
        transition: {
            ease: [0.6, 0.01, -0.05, 0.95],
            duration: 1,
        },
    },
};