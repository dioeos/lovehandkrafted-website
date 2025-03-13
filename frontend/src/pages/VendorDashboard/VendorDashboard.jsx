import { useEffect } from "react";
import { useAuth } from "../../utils/authentication/AuthProvider";
import { useNavigate } from "react-router-dom";

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
        <div id="vendor-dashboard-root" className="h-screen bg-orange-500">

        </div>

    )
}
export default VendorDashboard;