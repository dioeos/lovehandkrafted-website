import { useNavigate, useParams } from "react-router-dom";
import svg from "../../assets/email.svg";
import { useState } from "react";
import api from "../../utils/lib/api";
import Nav from "../../components/Nav/Nav";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import Layout from "../../components/Layout/Layout";
import Footer from "../../components/Footer/Footer";
import { Extras } from "../Index/Extras";

const VerifyEmail = () => {
  const { email } = useParams();
  const userEmail = decodeURIComponent(email);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const circleContainer = useRef(null);
  const { scrollYProgress } = useScroll({
    target: circleContainer,
    offset: ["start end", "end start"],
  });

  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post("/authentication/registration/resend-email/", {
        email: userEmail,
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
      <div id="verify-wrapper" className="min-h-screen bg-[#FAF9F6]">
        <div
          id="verify-container"
          className="mt-[4em] mx-[2vw] p-4 flex flex-col items-center"
        >
          <div id="shop-header">
            <h1 className="uppercase !text-[4rem] md:!text-[6rem] text-[#352f36] satoshi text-center">
              Welcome
            </h1>
          </div>

          <div id="" className="w-full max-w-md mx-auto rounded-xl  p-4 mt-8">
            <div className="block min-h-[1.5rem]">
              {error && (
                <p className="text-sm text-red-600 text-center" role="alert">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-sm text-green-600 text-center">{success}</p>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl font-semibold text-center satoshi">
              Check Your Email
            </h2>

            <img
              src={svg}
              alt="Email sent"
              className="mx-auto w-12 h-12 sm:w-16 sm:h-16"
            />

            <p className="text-sm sm:text-base text-[#352f36] text-center satoshi">
              We’ve sent a verification link to{" "}
              <span className="font-medium text-blue-600">{userEmail}</span>.
              <br />
              Didn’t receive it?
            </p>

            <div className="space-y-2">
              {/* Resend button */}
              <div className="rounded-lg bg-blue-500 p-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full text-[#FAF9F6] transition text-base md:text-lg"
                >
                  {loading ? "Processing..." : "Resend Verification Email"}
                </button>
              </div>

              {/* Go to Login button */}
              <div className="rounded-lg border border-gray-300 bg-white p-2">
                <button
                  onClick={() => navigate("/account/login")}
                  className="w-full text-[#352f36] transition text-base md:text-lg"
                >
                  Go to Login
                </button>
              </div>
            </div>
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
export default VerifyEmail;
