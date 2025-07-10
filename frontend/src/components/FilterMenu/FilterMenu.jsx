import { motion } from "framer-motion";

import { size, overlay } from "./anim.js";
import FilterBody from "./FilterBody";

const FilterMenu = ({ isOpen, onClose }) => {
  return (
    <div>
      <motion.div
        id="menu"
        className="z-[100] bg-[#352f36] fixed top-0 right-0 h-screen"
        initial="initial"
        animate="enter"
        exit="exit"
        variants={size}
      >
        <div id="wrapper" className="flex gap-[50px]">
          <div id="container" className="flex flex-col justify-between">
            {/* Body and Footer contents */}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default FilterMenu;

// <AnimatePresence>
//   {isFilterOpen && (
//     <>
//       {/* Backdrop */}
//       <motion.div
//         className="fixed inset-0 bg-gray-800/40 z-[100]"
//         onClick={() => setIsFilterOpen(false)}
//       ></motion.div>
//
//       {/* Sidebar */}
//       <motion.div
//         id="filter-sidebar-container"
//         className="fixed right-0 top-0 h-screen bg-[#FAF9F6] z-[150] w-[80vw] md:w-[35vw]"
//         initial={{ x: "100%" }}
//         animate={{ x: 0 }}
//         exit={{ x: "100%" }}
//         transition={{ type: "tween", duration: 0.3 }}
//       >
//         <div id="filter-header" className="flex uppercase satoshi pt-2">
//           <div className="flex items-center justify-between satoshi mb-2 w-full pl-6 pr-3">
//             <div className="flex items-center gap-2">
//               <IoIosOptions />
//               FILTER
//             </div>
//             <div className="right-0">
//               <IoMdClose
//                 className="cursor-pointer text-2xl"
//                 onClick={() => setIsFilterOpen(!isFilterOpen)}
//               />
//             </div>
//           </div>
//         </div>
//         <div
//           id="sort-by-container"
//           className="h-1/3 p-3 border-b-1 border-[#352F36]"
//         >
//           <p className="uppercase satoshi">Sort By</p>
//         </div>
//         <div
//           id="category-container"
//           className="h-1/3 p-3 border-b-1 border-[#352F36] "
//         >
//           <p className="uppercase satoshi">Category</p>
//         </div>
//
//         <div id="filter-buttons"></div>
//       </motion.div>
//     </>
//   )}
// </AnimatePresence>;
