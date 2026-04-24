import { useState, useRef, useEffect } from "react";
// import axios from "axios";
import axios from "../axiosConfig";
import "./ResetPassword.css";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);

  const inputsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // SEND OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/send-reset-otp", { email });
      if (res.data.success) {
        setStep(2);
        setTimer(30);
        setMessage("OTP sent to email");
      }
    } catch (err) {
      setMessage(err.response?.data?.msg || "Failed to send OTP");
    }
  };

  // VERIFY OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    try {
      const res = await axios.post("/api/auth/verify-reset-otp", {
        email,
        otp: finalOtp,
      });

      if (res.data.success) {
        setMessage("OTP verified ✅");
        setStep(3);
      }
    } catch (err) {
      setMessage(err.response?.data?.msg || "Invalid OTP");
    }
  };

  // RESET PASSWORD
  const resetPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/reset_password", {
        email,
        password,
        confirmPassword,
      });

      if (res.data.success) {
        setMessage("Password reset successful 🎉");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error");
    }
  };

  const handleOtpChange = (val, i) => {
    if (!/^[0-9]?$/.test(val)) return;
    const arr = [...otp];
    arr[i] = val;
    setOtp(arr);
    if (val && i < 5) inputsRef.current[i + 1].focus();
  };

  return (
    <>
      <style>{`
        .reset-wrapper {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgb(239, 232, 228);
          font-family: "Poppins", sans-serif;
        }

        .reset-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 1.5rem;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          width: 95%;
          max-width: 400px;
          text-align: center;
        }

        .input-field {
          width: 100%;
          padding: 0.7rem;
          margin-bottom: 1rem;
          border-radius: 1rem;
          border: 1px solid #e5beb5;
        }

        .otp-container {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .otp-box {
          width: 45px;
          height: 50px;
          text-align: center;
          font-size: 1.2rem;
          border-radius: 0.8rem;
          border: 1px solid #e5beb5;
        }

        // .submit-btn {
        //   width: 100%;
        //   padding: 0.8rem;
        //   border-radius: 1rem;
        //   background: linear-gradient(to right, #896c6c, #e5beb5);
        //   color: white;
        //   border: none;
        //   cursor: pointer;
        // }
          .submit-btn {

  padding: 0.8rem;
  background: linear-gradient(90deg, #562507, #e6894e);
  color: #fff;
  font-weight: 600;
  border-radius: 1rem;
  width: 100%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;


}

.submit-btn:hover {
 transform: scale(1.05);
  background: linear-gradient(90deg, #e6894e, #562507); /* reverse gradient */
}


        .msg-box {
          background: #fde2e1;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border-radius: 0.5rem;
        }
      `}</style>

      <div className="reset-wrapper">
        <form
          onSubmit={
            step === 1 ? sendOtp :
            step === 2 ? verifyOtp :
            resetPassword
          }
          className="reset-card"
        >
          <h2>Reset Password</h2>

          {message && <div className="msg-box">{message}</div>}

          <input
            type="email"
            placeholder="Enter email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {step === 2 && (
            <div className="otp-container">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  maxLength="1"
                  value={d}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="otp-box"
                />
              ))}
            </div>
          )}

          {step === 3 && (
            <>
              <input
                type="password"
                placeholder="New Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </>
          )}

          <button className="submit-btn">
            {step === 1 ? "Send OTP" :
             step === 2 ? "Verify OTP" :
             "Reset Password"}
          </button>
        </form>
      </div>
    </>
  );
}