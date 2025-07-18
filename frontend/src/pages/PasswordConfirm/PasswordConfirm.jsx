import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/lib/api";
import Nav from "../../components/Nav/Nav";
import { Extras } from "../Index/Extras";
import Footer from "../../components/Footer/Footer";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const PasswordConfirm = () => {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {}, [uid, token]);

  const circleContainer = useRef(null);
  const { scrollYProgress } = useScroll({
    target: circleContainer,
    offset: ["start end", "end start"],
  });

  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        "/authentication/password/reset/confirm/",
        {
          new_password1: password,
          new_password2: password,
          uid: uid,
          token: token,
        },
      );
      if (response.status === 200) {
        setSuccess("Password has been reset successfully!");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;

        if (errorData.token) {
          setError("Invalid or expired password reset link.");
        } else if (errorData.uid) {
          setError("Invalid or expired password reset link.");
        } else if (errorData.new_password1 || errorData.new_password2) {
          const passwordErrors =
            errorData.new_password || errorData.new_password2;

          if (
            passwordErrors.includes(
              "This password is too similar to the username.",
            )
          ) {
            setError("Your password is too similar to your username.");
          } else if (passwordErrors.includes("This password is too short.")) {
            setError("Your password must be at least 8 characters long.");
          } else if (passwordErrors.includes("This password is too common.")) {
            setError(
              "This password is too common. Choose a more secure password.",
            );
          } else if (
            passwordErrors.includes("This password is entirely numeric.")
          ) {
            setError("Your password cannot be entirely numeric.");
          } else {
            setError("Invalid password. Please try a stronger one.");
          }
        } else {
          setError("Error resetting password. Please try again.");
        }
      } else {
        setError("Error resetting password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#352f36]">
      <Nav />
      <div id="confirm-wrapper" className="h-screen bg-[#FAF9F6]">
        <div id="confirm-container" className="mt-[4em] p-4 mx-[2vw]">
          <div id="header"></div>

          <div
            id="confirm-content"
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
              Reset Password
            </h2>

            <div className="text-sm sm:text-base text-[#352f36] satoshi mb-5">
              <span className="block">Please enter a new password</span>
            </div>
          </div>

          <div
            id="reset-confirm-form"
            className="flex items-center justify-center"
          >
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md min-w-[250px] px-4 space-y-6"
            >
              <div id="new-password-container">
                <label
                  htmlFor="password1"
                  className="block text-[#352f36] font-medium satoshi text-base md:text-lg]"
                >
                  New Password:
                </label>
                <input
                  type="password"
                  id="password1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-lg"
                />
              </div>

              <div id="confirm-password-container">
                <label
                  htmlFor="password2"
                  className="block text-[#352f36] font-medium satoshi text-base md:text-lg]"
                >
                  Confirm Password:
                </label>
                <input
                  type="password"
                  id="password2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-lg"
                />
              </div>

              <div className="rounded-lg bg-[#352f36] p-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full text-[#FAF9F6] transition text-base md:text-lg"
                >
                  {loading ? "Processing..." : "Reset Password"}
                </button>
              </div>
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

export default PasswordConfirm;
