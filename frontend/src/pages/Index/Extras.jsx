import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const slider = [
  {
    color: "#d4e3ec",
    src: "https://cdn.lovehandkrafted.com/green_ornament_decor_tree_styled.jpg",
  },
  {
    color: "#e5e0e1",
    src: "https://cdn.lovehandkrafted.com/multiple_angles_reef_styled.jpg",
  },
  {
    color: "#cde0ea",
    src: "https://cdn.lovehandkrafted.com/three_angels_clothes.jpg",
  },
  {
    color: "#e1dad6",
    src: "https://cdn.lovehandkrafted.com/red_angels_three_woodbg_styled.jpg",
  },
];

export const Extras = ({ showSlider }) => {
  const carouselContainer = useRef(null);

  const { scrollYProgress } = useScroll({
    target: carouselContainer,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  return (
    <div
      ref={carouselContainer}
      id="sliding-images"
      className="flex flex-col gap-[3vw] relative bg-[#FAF9F6] z-1 mb-[50vh]"
    >
      {showSlider && (
        <motion.div
          style={{ x: x1 }}
          id="slider"
          className="flex relative gap-[3vw] w-[120vw] left-[-20vw] bg-[#FAF9F6]"
        >
          {slider.map((project, index) => (
            <div
              key={index}
              id="project"
              className="w-[85vw] aspect-[3/4] md:w-1/4 md:aspect-[4/3] flex items-center justify-center"
              style={{ backgroundColor: project.color }}
            >
              <div id="image-container" className="relative w-[80%] h-[80%]">
                <img
                  className="w-full h-full object-cover"
                  alt={"image"}
                  src={project.src}
                />
              </div>
            </div>
          ))}
        </motion.div>
      )}

      <motion.div
        style={{ height }}
        id="circle-container"
        className="relative mt-[100px]"
      >
        <div
          id="circle"
          className="h-[1550%] w-[120%] left-[-10%] bg-[#FAF9F6] absolute [border-radius:0_0_50%_50%] [box-shadow:0px_60px_50px_rgba(0,0,0,0.748)] z-50"
        ></div>
      </motion.div>
    </div>
  );
};
