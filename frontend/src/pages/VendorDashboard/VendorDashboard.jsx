import { useEffect } from "react";
import { useAuth } from "../../utils/authentication/AuthProvider";
import { useNavigate } from "react-router-dom";
import VendorSidebar from "../../components/VendorSidebar/VendorSidebar";

import Topbar from "../../components/Topbar/Topbar";

const VendorDashboard = () => {
    console.log("Vendor dashboard")

    return (
        <div id="vendor-dashboard-root" className="rounded-lg shadow h-full">
            <Topbar/>


        </div>

    )
}
export default VendorDashboard;