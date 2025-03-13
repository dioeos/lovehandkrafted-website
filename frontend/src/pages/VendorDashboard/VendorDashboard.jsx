import { useEffect } from "react";
import { useAuth } from "../../utils/authentication/AuthProvider";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/VendorSidebar/VendorSidebar";
import VendorSidebar from "../../components/VendorSidebar/VendorSidebar";
import Layout from "../../components/Layout/Layout";

const VendorDashboard = () => {
    console.log("Vendor dashboard")
    const { isVendor } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isVendor) {
            navigate("/unauthorized")
        }
    })

    return (
        <Layout>
            <div id="vendor-dashboard-root" className="h-screen bg-orange-500 pt-20">
                <VendorSidebar />


            </div>
        </Layout>

    )
}
export default VendorDashboard;