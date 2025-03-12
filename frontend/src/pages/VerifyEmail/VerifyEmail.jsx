import { useNavigate, useParams } from "react-router-dom"

import svg from "../../assets/email.svg"
import { useState } from "react";
import api from "../../utils/lib/api";

const VerifyEmail = () => {
    const { email } = useParams();
    const userEmail = decodeURIComponent(email)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await api.post("/authentication/dj-rest-auth/registration/resend-email/", {
                email: userEmail,
            })
        } catch (error) {
            console.log(error.response)
        }
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 shadow-lg rounded-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    Check Your Email
                </h2>

                <img src={svg} className="mx-auto w-16 h-16" />


                <p className="text-sm text-gray-600 text-center">
                    Check your email for the verifcation link sent to{" "}
                    <span className="font-bold text-blue-600">
                        {userEmail}
                    </span> 
                </p>


                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-2"
                    onClick={handleSubmit}
                >
                    Resend Verifcation Email
                </button>

                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => navigate("/account/login")}
                >
                    Go to Login
                </button>

            </div>
        </div>
    )
}
export default VerifyEmail