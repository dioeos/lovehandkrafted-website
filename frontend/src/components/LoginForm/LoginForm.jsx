import api from "../../utils/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import google from "../../assets/google.png";

import { useAuth } from "../../utils/authentication/AuthProvider";

const AuthForm = ({ route, method }) => {
    // login.jsx decides which route - login or register

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
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
                    first_name: firstName,
                    last_name: lastName,
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
        <div className="">
            <div id="login-wrapper" className="h-screen bg-[#FAF9F6]">

                <div id="login-container" className="mt-[4em] p-4 mx-[2vw]">
                    <div id="login-header">
                        <h1 className="uppercase !text-[4rem] md:!text-[6rem] text-[#352f36] satoshi text-center">
                            {method === 'register' ? 'Register' : 'Login'}
                        </h1>

                        <div className="block min-h-[1.5rem]">
                            {error && <div className="text-red-600 text-sm text-center mb-2 satoshi">{error}</div>}
                            {success && <div className="text-green-600 text-sm text-center mb-2 satoshi">{success}</div>}
                        </div>

                    </div>

                    <div id="login-form" className="flex items-center justify-center">


                        <form
                            onSubmit={handleSubmit}
                            className="w-full max-w-md min-w-[250px] px-4 space-y-6"
                        >

                            {method === 'register' && (
                                <div id="names-container" className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-[#352f36] font-medium satoshi text-base md:text-lg">First Name:</label>
                                    <input
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-lg"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="block text-[#352f36] font-medium satoshi text-base md:text-lg">Last Name:</label>
                                    <input
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-lg"
                                    />
                                </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-[#352f36] font-medium satoshi text-base md:text-lg">Email:</label>
                                <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-lg"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-[#352f36] font-medium satoshi text-base md:text-lg">Password:</label>
                                <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-lg"
                                />
                            </div>
                            
                            <div className="rounded-lg bg-blue-500 p-2">
                                <button
                                    type="submit"
                                    className="w-full text-[#FAF9F6] transition text-base md:text-lg"
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : method === 'register' ? 'Register' : 'Login'}
                                </button>
                            </div>





                            {/* <button 
                                type="button" 
                                className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
                                onClick={handleGoogleLogin}
                            >
                                <img src={google} alt="Google icon" className="w-5 h-5 mr-2" />
                                {method === 'register' ? 'Register with Google' : 'Login with Google'}
                            </button> */}

                            {method === 'login' && (
                                <div className="satoshi">

                                    <p className="text-sm text-[#352f36] text-center satoshi">
                                        Don't have an account?{" "}
                                        <span className="text-blue-600 cursor-pointer satoshi" onClick={() => navigate("/account/register")}>
                                            Register
                                        </span>
                                    </p>


                                    <p className="text-sm text-[#352f36] text-center">
                                        <span className="text-blue-600 cursor-pointer satoshi" onClick={() => navigate("/account/password/recover")}>
                                            Forgot your password?
                                        </span>
                                    </p>
                                </div>
                            )}
                            {method === 'register' && (
                                <p className="text-sm text-[#352f36] text-center satoshi">
                                    Already have an account?{" "}
                                    <span className="text-blue-600 cursor-pointer satoshi" onClick={() => navigate("/account/login")}>
                                        Login
                                    </span>
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthForm;
