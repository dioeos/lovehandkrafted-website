import {  useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/lib/api";

const PasswordConfirm = () => {
    const { uid, token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
    }, [uid, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(null);
        setError(null);
        setSuccess(null);


        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            setLoading(false);
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
                setSuccess("Password has been reset successfully!")
            }
        } catch (error) {
            console.log(error.response.data)
            if (error.response && error.response.data) {
                const errorData = error.response.data;

                if (errorData.token) {
                    setError("Invalid or expired password reset link.")
                } else if (errorData.uid) {
                    setError("Invalid or expired password reset link.")
                } else if (errorData.new_password1 || errorData.new_password2) {
                    const passwordErrors = errorData.new_password || errorData.new_password2;

                    if (passwordErrors.includes("This password is too similar to the username.")) {
                        setError("Your password is too similar to your username.");
                    } else if (passwordErrors.includes("This password is too short.")) {
                        setError("Your password must be at least 8 characters long.");
                    } else if (passwordErrors.includes("This password is too common.")) {
                        setError("This password is too common. Choose a more secure password.");
                    } else if (passwordErrors.includes("This password is entirely numeric.")) {
                        setError("Your password cannot be entirely numeric.");
                    } else {
                        setError("Invalid password. Please try a stronger one.");
                    }
                } else {
                    setError("Error resetting password. Please try again.")
                }
            } else {
                setError("Error resetting password. Please try again.")
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="bg-white p-8 shadow-lg rounded-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    Reset account password
                </h2>

                <p className="font-light text-center mb-4">
                    Enter a new password
                </p>

                {error && <div className="text-red-600 text-sm text-center mb-2">{error}</div>}
                {success && <div className="text-green-600 text-sm text-center mb-2">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password1" className="block text-gray-700 font-medium">Password:</label>
                        <input
                            type="password" 
                            id="password1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                        </input>


                        <label htmlFor="password2" className="block text-gray-700 font-medium">Confirm password:</label>
                        <input
                            type="password" 
                            id="password2"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                        </input>
                    </div>

                    <button
                        type="submit" 
                        className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        {loading ? "Processing..." : "Submit"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default PasswordConfirm;
