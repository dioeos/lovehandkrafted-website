import { useState } from "react";
import api from "../../utils/lib/api";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav/Nav";
import { Extras } from "../Index/Extras";
import Footer from "../../components/Footer/Footer";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const VerifyRequest = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const circleContainer = useRef(null);
  const { scrollYProgress } = useScroll({
    target: circleContainer,
    offset: ["start end", "end start"],
  });

  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

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
      await api.post("/authentication/registration/resend-email/", {
        email: email.trim(),
      });
      setSuccess("Verification email resent! Check your inbox.");
    } catch (error) {
      if (error.response?.data?.detail) {
        setError("Something went wrong. Try again.");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#352f36]">
      <Nav />
      <div id="reset-wrapper" className="h-screen bg-[#FAF9F6]">
        <div id="reset-container" className="mt-[4em] mx-[2vw] p-4">
          <div id="rest-header" className="block min-h-[1.5rem]"></div>

          <div
            id="reset-content"
            className="w-full max-w-md mx-auto rounded-xl p-4 mt-8"
          >
            <div className="block min-h-[1.5rem]">
              {error && (
                <div className="text-red-600 text-sm text-center mb-2">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-600 text-sm text-center mb-2">
                  {success}
                </div>
              )}
            </div>
          </div>

          <div className="mad-w-md mx-auto text-center satoshi">
            <h2 className="text-lg sm:text-2xl font-semibold satoshi">
              Need to verify account?
            </h2>

            <div className="text-sm sm:text-base text-[#352f36] satoshi mb-5">
              <span className="block">We will send you an email</span>
              <span className="block">with a verification link</span>
            </div>
          </div>

          <div id="reset-form" className="flex items-center justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md min-w-[250px] px-4 space-y-6"
            >
              <div id="email-container">
                <label
                  htmlFor="email"
                  className="block text-[#352f36] font-medium satoshi text-base md:text-lg]"
                >
                  Email:
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-lg"
                />
              </div>

              <div className="rounded-lg bg-blue-500 p-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full text-[#FAF9F6] transition text-base md:text-lg"
                >
                  {loading ? "Processing..." : "Send Verifiation Email"}
                </button>
              </div>

              <p className="text-sm text-[#352f36] text-center satoshi">
                Already have an account?{" "}
                <span
                  className="text-blue-600 cursor-pointer satoshi"
                  onClick={() => navigate("/account/login")}
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>

        <div className="overflow-x-hidden overflow-y-hidden bg-[#352f36]">
          <Extras showSlider={false} />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default VerifyRequest;
