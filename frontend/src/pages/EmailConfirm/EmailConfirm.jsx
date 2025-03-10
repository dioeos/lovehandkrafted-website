import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/lib/api";

const EmailConfirm = () => {
    const { uid, token } = useParams();
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await api.post("/authentication/dj-rest-auth/registration/verify-email/", {
                    key: token,
                });
                console.log(response)
                if (response.status === 200) {
                    navigate("/account/login")
                }
            } catch (error) {
                setMessage("Invalid or expired token.");
            }
        };

        confirmEmail();
    }, [token, navigate]);

    return (
        <div className="email-confirm-container">
            <h2>{message || "Verifying your email..."}</h2>
        </div>
    );
};

export default EmailConfirm;
