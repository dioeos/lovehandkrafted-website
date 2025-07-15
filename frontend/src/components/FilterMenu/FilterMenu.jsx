import { motion } from "framer-motion";

import { size, overlay } from "./anim.js";
import FilterBody from "./FilterBody";

const FilterMenu = ({
  isOpen,
  onClose,
  sortOption,
  setSortOption,
  selectedCategories,
  setSelectedCategories,
  onApply,
}) => {
  return (
    <div className="h-full">
      <motion.div
        id="menu"
        className="z-[100] bg-[#352f36] fixed top-0 right-0 h-screen overflow-hidden"
        initial="initial"
        animate="enter"
        exit="exit"
        variants={size}
      >
        <div id="wrapper" className="flex gap-[50px]">
          <div
            id="container"
            className="flex flex-col justify-between w-full h-full"
          >
            <FilterBody
              sortOption={sortOption}
              setSortOption={setSortOption}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              onApply={onApply}
              handleClose={onClose}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default FilterMenu;
