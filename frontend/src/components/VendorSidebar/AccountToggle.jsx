import React from "react";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { useAuth } from "../../utils/authentication/AuthProvider";

export const AccountToggle = ({name, email}) => {

  return (
    <div className="border-b mb-4 pb-4 border-stone-300">
      <button className="flex p-2 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center">
        <img
          src="https://api.dicebear.com/9.x/notionists/svg"
          alt="avatar"
          className="size-8 rounded shrink-0 bg-violet-500 shadow"
        />
        <div className="text-start">
          <span className="text-sm font-bold block">{name}</span>
          <span className="text-xs block text-stone-500">{email}</span>
        </div>

        {/* <div className="bg-green-500 flex">

          <FaChevronUp className=" bg-red-500 right-2 top-1/4 translate-y-[calc(-50%+4px)] text-xs"/>
          <FaChevronDown className="absolute right-2 top-1/2 text-xs translate-y-[calc(-50%+4px)]"/>
        </div> */}


      </button>
    </div>
  );
};
export default AccountToggle;