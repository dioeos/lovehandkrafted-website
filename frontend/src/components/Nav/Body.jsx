import { motion } from "framer-motion";
import { translate } from "./anim";
import { Link } from "react-router-dom";

const Body = ({ links, selectedLink, setSelectedLink }) => {
  const getChars = (word) => {
    if (!word) return [];
    let chars = [];
    word.split("").forEach((char, i) => {
      chars.push(
        <motion.span
          custom={[i * 0.02, (word.length - i) * 0.01]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
          key={char + i}
        >
          {char}
        </motion.span>,
      );
    });
    return chars;
  };

  return (
    <div className="flex flex-wrap mt-[20px] max-w-full md:max-w-[1200px] uppercase text-[#0B1215]">
      {links.map((link, index) => {
        const { title, href } = link || {};
        return (
          <Link
            key={`l_${index}`}
            to={href}
            className=""
            style={{ textDecoration: "none", color: "#0B1215" }}
          >
            <motion.p
              onMouseOver={() => {
                setSelectedLink({ isActive: true, index });
              }}
              onMouseLeave={() => {
                setSelectedLink({ isActive: false, index });
              }}
              animate={
                selectedLink.isActive && selectedLink.index !== index
                  ? "open"
                  : "closed"
              }
              className="text-[#352f36] m-0 flex flex-wrap overflow-hidden text-3xl md:text-4xl lg:text-7xl pr-[32px] pt-[10px] font-light"
            >
              {getChars(title)}
            </motion.p>
          </Link>
        );
      })}
    </div>
  );
};

export default Body;
