import { translate } from "./anim";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <div
      id="footer"
      className="flex items-start flex-wrap uppercase mt-[30px] md:mt-[70px] text-[12px] md:text-[18px] flex-col md:flex-row md:gap-[5rem]"
    >
      <ul className="list-none mt-[5px] overflow-hidden p-0">
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <span className="text-[#9f9689]">Made by: </span>
          <span className="text-[#352f36]">Lovehandkrafted</span>
        </motion.li>
      </ul>

      <ul className="list-none mt-[5px] overflow-hidden  p-0">
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <span className="text-[#9f9689]">Based in: </span>
          <span className="text-[#352f36]">Manila, PH</span>
        </motion.li>
      </ul>

      <ul className="list-none mt-[5px] overflow-hidden  p-0">
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <span className="text-[#9f9689]">Images by: </span>
          <span className="text-[#352f36]">Maria Dioneda</span>
        </motion.li>
      </ul>
    </div>
  );
};
export default Footer;
