import { useEffect } from "react";
import { useAuth } from "../../utils/authentication/AuthProvider";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    console.log("Profile");

    const { isAuthorized, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthorized) {
            navigate("/login");
        }
    }, [isAuthorized, navigate]);

    if (!isAuthorized) { return null;}

    return (
        <div id="index-root" className="h-screen bg-red-500 flex justify-center items-center">
            <button 
                onClick={logout} // 
                className="px-4 py-2 bg-white text-black rounded-md shadow-md hover:bg-gray-300 transition"
            >
                Logout
            </button>
        </div>
    )

}

export default Profile;