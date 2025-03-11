import { useState } from "react";
import api from "../../utils/lib/api";
import { useNavigate } from "react-router-dom";

const PasswordReset = () => {

    const [email, setEmail] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)
    const [success, setSuccess] = useState(null)
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault()
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
            const response = await api.post("/authentication/dj-rest-auth/password/reset/", {
                email: email.trim()
            });
            console.log(response)
            if (response.status === 200) {
                setSuccess("We've sent you an email with a link to update your password.")
                setTimeout(() => {
                    navigate("/account/login")
                }, 2000);
            }

        } catch (error) {

            setError("Something went wrong. Please try again.")
        }
    }


    return (
        <div className="h-screen flex items-center justify-center">
            <div className="bg-white p-8 shadow-lg rounded-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-1">
                    Reset your password
                </h2>
                <p className="font-light text-center mb-4">We will send you an email to reset your password</p>

                {error && <div className="text-red-600 text-sm text-center mb-2">{error}</div>}
                {success && <div className="text-green-600 text-sm text-center mb-2">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium">Email:</label>
                        <input
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
    )
}

export default PasswordReset;