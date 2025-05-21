import { motion } from 'framer-motion';

//animations
import { letterAnimation } from "./anim"
import { banner } from "./anim"


export const AnimatedLetters = ({ title }) => {
    return (
        <motion.span
            className="relative inline-block overflow-hidden" 
            variants={banner}
            initial='initial'
            animate='animate'
        >
            {[...title].map((letter, index) => (
                <motion.span
                    key={index}
                    className="relative inline-block satoshi" 
                    variants={letterAnimation}
                >
                    {letter}
                </motion.span>
            ))}
        </motion.span>
    )
}