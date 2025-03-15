import { useEffect } from "react";
import { useAuth } from "../../utils/authentication/AuthProvider";
import { useNavigate, Outlet } from "react-router-dom";
import VendorSidebar from "../../components/VendorSidebar/VendorSidebar";

const VendorLayout = () => {
    const { isVendor, userFirstName, userEmail} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isVendor) {
            navigate("/unauthorized");
        }
    }, [isVendor, navigate]);

    const vendorData = {
        name: userFirstName,
        email: userEmail,
    }
    
    return (
        <div id="vendor-dashboard-root" className="grid gap-4 p-4 grid-cols-[200px_1fr] bg-stone-100 h-screen">
            <VendorSidebar vendorData={vendorData}/>
            <div className="h-full">
                <Outlet context={vendorData}/> 
            </div>
        </div>
    );
};

export default VendorLayout;
