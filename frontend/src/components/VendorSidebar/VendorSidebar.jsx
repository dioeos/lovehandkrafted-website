import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { FaHome, FaUser, FaCog, FaBars } from "react-icons/fa";
import { AccountToggle } from "./AccountToggle";
import Search from "./Search";
import RouteSelect from "./RouteSelect";

const VendorSidebar = ({vendorData}) => {
    console.log(vendorData.name)
    return (
        <div>
            <div className=" sticky rounded-lg h-[calc(100vh-32px-48px)]">
                <AccountToggle name={vendorData.name} email={vendorData.email}/>
                <Search/>
                <RouteSelect/>
            </div>

        </div>
    )
}
export default VendorSidebar;