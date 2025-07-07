import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/lib/api";
import Layout from "../../components/Layout/Layout";

const EmailConfirm = () => {
  const { uid, token } = useParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await api.post(
          "/authentication/registration/verify-email/",
          {
            key: token,
          },
        );
        console.log(response);
        if (response.status === 200) {
          navigate("/account/login");
        }
      } catch (error) {
        setMessage("Invalid or expired token.");
      }
    };

    confirmEmail();
  }, [token, navigate]);

  return (
    <Layout>
      <div className="email-confirm-container">
        <h2>{message || "Verifying your email..."}</h2>
      </div>
    </Layout>
  );
};

export default EmailConfirm;
