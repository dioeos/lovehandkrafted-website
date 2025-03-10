import {  useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import api from "../../utils/lib/api";

const PasswordConfirm = () => {
    console.log("WENT TO PASSWORD CONFIRM")
    const { uid, token } = useParams(); // Get token from URL
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        console.log("Extracted UID:", uid, "Token:", token);
    }, [uid, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await api.post("/authentication/dj-rest-auth/password/reset/confirm/", {
                new_password1: password,
                new_password2: password,
                uid: uid,
                token: token,
            });
            if (response.status === 200) {
                setMessage("Password has been reset successfully!");
            }
        } catch (error) {
            setMessage("Error resetting password.");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PasswordConfirm;
