import { IoIosExit } from "react-icons/io";

const Topbar = () => {
    
    const currentDate = new Date().toLocaleDateString();

    return (
        <div className="">
            <div className="p-2">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold">Good Morning!</span>
                        <span className="text-xs text-stone-500">Today's Date: {currentDate}</span>
                    </div>

                    <div className="flex">
                        <a href="/" className="">Main Site</a>
                    </div>

                </div>

            </div>
        </div>
  );
};
export default Topbar