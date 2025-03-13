import api from "../../utils/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import google from "../../assets/google.png";

import { useAuth } from "../../utils/authentication/AuthProvider";

const AuthForm = ({ route, method }) => {
    // login.jsx decides which route - login or register

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const { handleLogin } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        try {

            if (method === 'login') {
                await handleLogin(email, password)
                setSuccess("Login successful")

            } else {
                await api.post(route, {
                    email: email.trim(),
                    password1: password,
                    password2: password,
                    name: email.trim(),
                });
                //setSuccess("Registration successful. Please check your email for verification");
                setTimeout(() => {
                    navigate(`/account/verify-email/${encodeURIComponent(email)}`);
                });
            }

        } catch (error) {

            if (error.response) {
                if (error.response.status === 401) {
                    const errorMessage = error.response.data.detail || error.response.data.message;

                    if (errorMessage.includes("verified")) {
                        setError("Your email is not verified. Please check your inbox.")
                    } else {

                        setError("Invalid credentials")
                    }

                } else if (error.response.status === 400) {
                    setError("Email already has an account")
                } else {
                    setError("Something went wrong. Please try again")
                }
            } else if (error.request) {
                setError("Network error. Please check your internet connection.")
            } else {
                setError("Something went wrong. Please try again.")
            }

            
        } finally {
            setLoading(false);
        }

    };

    // const handleGoogleLogin = () => {
    //     window.location.href = "http://localhost/accounts/google/login/";
    // };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 shadow-lg rounded-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {method === 'register' ? 'Register' : 'Login'}
                </h2>

                {error && <div className="text-red-600 text-sm text-center mb-2">{error}</div>}
                {success && <div className="text-green-600 text-sm text-center mb-2">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium">Email:</label>
                        <input 
                            type="text" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium">Password:</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}  
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : method === 'register' ? 'Register' : 'Login'}
                    </button>

                    {/* <button 
                        type="button" 
                        className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
                        onClick={handleGoogleLogin}
                    >
                        <img src={google} alt="Google icon" className="w-5 h-5 mr-2" />
                        {method === 'register' ? 'Register with Google' : 'Login with Google'}
                    </button> */}

                    {method === 'login' && (
                        <div>

                            <p className="text-sm text-gray-600 text-center">
                                Don't have an account?{" "}
                                <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/account/register")}>
                                    Register
                                </span>
                            </p>


                            <p className="text-sm text-gray-600 text-center">
                                <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/account/password/recover")}>
                                    Forgot your password?
                                </span>
                            </p>
                        </div>
                    )}
                    {method === 'register' && (
                        <p className="text-sm text-gray-600 text-center">
                            Already have an account?{" "}
                            <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/account/login")}>
                                Login
                            </span>
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default AuthForm;
