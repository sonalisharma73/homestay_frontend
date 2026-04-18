// // // import { useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import axios from "axios";
// // // import "./Signup.css";
// // // import Navbar from "../componets/Navbar";

// // // export default function Signup() {
// // //   const [formData, setFormData] = useState({
// // //     first_name: "",
// // //     last_name: "",
// // //     email: "",
// // //     password: "",
// // //     confirmpassword: "",
// // //     userType: "guest",
// // //     terms: false,
// // //   });

// // //   const [message, setMessage] = useState("");
// // //   const [success, setSuccess] = useState(false);
// // //   const navigate = useNavigate();

// // //   const handleChange = (e) => {
// // //     const { name, value, type, checked } = e.target;
// // //     setFormData({
// // //       ...formData,
// // //       [name]: type === "checkbox" ? checked : value,
// // //     });
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setMessage("");
// // //     setSuccess(false);

// // //     if (formData.password !== formData.confirmpassword) {
// // //       setMessage("Passwords do not match!");
// // //       return;
// // //     }

// // //     try {
// // //       const res = await axios.post(
// // //         "http://localhost:5000/api/auth/SignUp",
// // //         formData
// // //       );

// // //       if (res.data.success) {
// // //         setSuccess(true);
// // //         setMessage(res.data.msg || "Signup successful! Redirecting...");
// // //         setTimeout(() => navigate("/login"), 1500);
// // //       } else {
// // //         setMessage(res.data.msg || "Signup failed.");
// // //       }
// // //     } catch (err) {
// // //   const backendMsg = err.response?.data?.msg;

// // //   if (backendMsg === "Email already exists") {
// // //     setMessage("Email already exists");
// // //   } else {
// // //     setMessage(backendMsg || "Something went wrong");
// // //   }
// // // }

// // //   };

// // //   return (
// // //     <div className="page-wrapper">
// // //       <Navbar />

// // //       <div className="signup-bg">
// // //         <div className="circle-pink"></div>
// // //         <div className="circle-purple"></div>

// // //         <div className="signup-card">
// // //           <h2>Join Homestay</h2>
// // //           <p>Create your account and start your journey 🏡</p>

// // //           {message && (
// // //             <div className={success ? "message success" : "message error"}>
// // //               {message}
// // //             </div>
// // //           )}

// // //           <form onSubmit={handleSubmit}>
// // //             <input
// // //               type="text"
// // //               name="first_name"
// // //               value={formData.first_name}
// // //               onChange={handleChange}
// // //               placeholder="First Name"
// // //               className="input-field"
// // //               required
// // //             />
// // //             <input
// // //               type="text"
// // //               name="last_name"
// // //               value={formData.last_name}
// // //               onChange={handleChange}
// // //               placeholder="Last Name"
// // //               className="input-field"
// // //             />
// // //             <input
// // //               type="email"
// // //               name="email"
// // //               value={formData.email}
// // //               onChange={handleChange}
// // //               placeholder="Email"
// // //               className="input-field"
// // //               required
// // //             />
// // //             <input
// // //               type="password"
// // //               name="password"
// // //               value={formData.password}
// // //               onChange={handleChange}
// // //               placeholder="Password"
// // //               className="input-field"
// // //               required
// // //             />
// // //             <input
// // //               type="password"
// // //               name="confirmpassword"
// // //               value={formData.confirmpassword}
// // //               onChange={handleChange}
// // //               placeholder="Confirm Password"
// // //               className="input-field"
// // //               required
// // //             />

// // //             <select
// // //               name="userType"
// // //               value={formData.userType}
// // //               onChange={handleChange}
// // //               className="input-field"
// // //               required
// // //             >
// // //               <option value="guest">Guest</option>
// // //               <option value="host">Host</option>
// // //             </select>

// // //             <div className="terms-row">
// // //               <input
// // //                 type="checkbox"
// // //                 id="terms"
// // //                 name="terms"
// // //                 checked={formData.terms}
// // //                 onChange={handleChange}
// // //                 required
// // //               />
// // //               <label htmlFor="terms">I agree to the terms and conditions</label>
// // //             </div>

// // //             <button type="submit" className="submit-btn">
// // //               Sign Up
// // //             </button>
// // //           </form>

// // //           <p className="signup-footer">
// // //             Already have an account? <a href="/login">Login</a>
// // //           </p>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import "./Signup.css";
// // import Navbar from "../componets/Navbar";

// // export default function Signup() {
// //   const [formData, setFormData] = useState({
// //     first_name: "",
// //     last_name: "",
// //     email: "",
// //     PhoneNo: "",
// //     password: "",
// //     confirmpassword: "",
// //     userType: "guest",
// //     terms: false,
// //   });

// //   const [otp, setOtp] = useState("");
// //   const [otpSent, setOtpSent] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   const [message, setMessage] = useState("");
// //   const [success, setSuccess] = useState(false);

// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: type === "checkbox" ? checked : value,
// //     });
// //   };

// //   // SEND OTP
// //   const handleSendOtp = async () => {
// //     if (loading) return;

// //     if (!/^[0-9]{10}$/.test(formData.PhoneNo)) {
// //       setMessage("Invalid phone number");
// //       return;
// //     }

// //     setLoading(true);
// //     setMessage("");

// //     try {
// //       const res = await axios.post(
// //         "http://localhost:5000/api/auth/send-otp",
// //         {
// //           email: formData.email,
// //           PhoneNo: formData.PhoneNo,
// //         }
// //       );

// //       if (res.data.success) {
// //         setOtpSent(true);
// //         setSuccess(true);
// //         setMessage("OTP sent successfully");
// //       }
// //     } catch (err) {
// //       setMessage(err.response?.data?.msg || "Failed to send OTP");
// //       setSuccess(false);
// //     }

// //     setLoading(false);
// //   };

// //   // VERIFY + SIGNUP
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!otp) {
// //       setMessage("Enter OTP");
// //       return;
// //     }

// //     if (formData.password !== formData.confirmpassword) {
// //       setMessage("Passwords do not match!");
// //       return;
// //     }

// //     try {
// //       const res = await axios.post(
// //         "http://localhost:5000/api/auth/verify-otp",
// //         {
// //           ...formData,
// //           otp,
// //         }
// //       );

// //       if (res.data.success) {
// //         setSuccess(true);
// //         setMessage("Signup successful!");
// //         setTimeout(() => navigate("/login"), 1500);
// //       }
// //     } catch (err) {
// //       setMessage(err.response?.data?.msg || "Error");
// //       setSuccess(false);
// //     }
// //   };

// //   return (
// //     <div className="page-wrapper">
// //       <Navbar />

// //       <div className="signup-card">
// //         <h2>Signup</h2>

// //         {message && (
// //           <p style={{ color: success ? "green" : "red" }}>{message}</p>
// //         )}

// //         <form onSubmit={handleSubmit}>
// //           <input name="first_name" onChange={handleChange} placeholder="First Name" required />
// //           <input name="last_name" onChange={handleChange} placeholder="Last Name" />
// //           <input name="email" onChange={handleChange} placeholder="Email" required />
// //           <input name="PhoneNo" onChange={handleChange} placeholder="Phone" required />
// //           <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
// //           <input type="password" name="confirmpassword" onChange={handleChange} placeholder="Confirm Password" required />

// //           {!otpSent && (
// //             <button type="button" onClick={handleSendOtp}>
// //               {loading ? "Sending..." : "Send OTP"}
// //             </button>
// //           )}

// //           {otpSent && (
// //             <>
// //               <input placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
// //               <button type="submit">Verify & Signup</button>
// //             </>
// //           )}
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Signup.css";
// import Navbar from "../componets/Navbar";

// export default function Signup() {
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     PhoneNo: "",
//     password: "",
//     confirmpassword: "",
//     userType: "guest",
//     terms: false,
//   });

//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [message, setMessage] = useState("");
//   const [success, setSuccess] = useState(false);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   // SEND OTP
//   const handleSendOtp = async () => {
//     if (loading) return;
//    console.log("login ",formData.PhoneNo);
//     if (!/^[0-9]{10}$/.test(formData.PhoneNo)) {
//       setMessage("Invalid phone number");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/auth/send-otp",
//         {
//           email: formData.email,
//           PhoneNo: formData.PhoneNo,
//         }
//       );

//       if (res.data.success) {
//         setOtpSent(true);
//         setSuccess(true);
//         setMessage("OTP sent successfully");
//       }
//     } catch (err) {
//       setMessage(err.response?.data?.msg || "Failed to send OTP");
//       setSuccess(false);
//     }

//     setLoading(false);
//   };

//   // VERIFY
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!otp) {
//       setMessage("Enter OTP");
//       return;
//     }

//     if (formData.password !== formData.confirmpassword) {
//       setMessage("Passwords do not match!");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/auth/verify-otp",
//         {
//           ...formData,
//           otp,
//         }
//       );

//       if (res.data.success) {
//         setSuccess(true);
//         setMessage("Signup successful 🎉");
//         setTimeout(() => navigate("/login"), 1500);
//       }
//     } catch (err) {
//       setMessage(err.response?.data?.msg || "Error");
//       setSuccess(false);
//     }
//   };

//   return (
//     <div className="signup-page">
//       <Navbar />

//       <div className="signup-container">
//         <div className="signup-card">
//           <h2>Create Account</h2>
//           <p className="subtitle">Join Homestay and explore 🏡</p>

//           {message && (
//             <div className={success ? "msg success" : "msg error"}>
//               {message}
//             </div>
//           )}

//        <form onSubmit={handleSubmit}>

//   <div className="input-group">
//     <label>First Name</label>
//     <input
//       name="first_name"
//       value={formData.first_name}
//       onChange={handleChange}
//       required
//     />
//   </div>

//   <div className="input-group">
//     <label>Last Name</label>
//     <input
//       name="last_name"
//       value={formData.last_name}
//       onChange={handleChange}
//     />
//   </div>

//   <div className="input-group">
//     <label>Email Address</label>
//     <input
//       type="email"
//       name="email"
//       value={formData.email}
//       onChange={handleChange}
//       required
//     />
//   </div>

//   <div className="input-group">
//     <label>Phone Number</label>
//     <input
//       name="PhoneNo"
//       value={formData.PhoneNo}
//       onChange={handleChange}
//       required
//     />
//   </div>

//   <div className="input-group">
//     <label>Password</label>
//     <input
//       type="password"
//       name="password"
//       value={formData.password}
//       onChange={handleChange}
//       required
//     />
//   </div>

//   <div className="input-group">
//     <label>Confirm Password</label>
//     <input
//       type="password"
//       name="confirmpassword"
//       value={formData.confirmpassword}
//       onChange={handleChange}
//       required
//     />
//   </div>

//   <div className="input-group">
//     <label>User Type</label>
//     <select name="userType" value={formData.userType} onChange={handleChange}>
//       <option value="guest">Guest</option>
//       <option value="host">Host</option>
//     </select>
//   </div>

//   <div className="terms">
//     <input
//       type="checkbox"
//       name="terms"
//       checked={formData.terms}
//       onChange={handleChange}
//       required
//     />
//     <span>I agree to Terms & Conditions</span>
//   </div>

//   {!otpSent && (
//     <button type="button" onClick={handleSendOtp} disabled={loading}>
//       {loading ? "Sending OTP..." : "Send OTP"}
//     </button>
//   )}

//   {otpSent && (
//     <>
//       <div className="input-group">
//         <label>Enter OTP</label>
//         <input
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           className="otp-input"
//           required
//         />
//       </div>

//       <button type="submit">Verify & Sign Up</button>
//     </>
//   )}
// </form>

//           <p className="footer">
//             Already have an account? <span onClick={() => navigate("/login")}>Login</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import Navbar from "../componets/Navbar";

export default function Signup() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    PhoneNo: "",
    password: "",
    confirmpassword: "",
    userType: "guest",
    terms: false,
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // TIMER
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // SEND OTP
  const handleSendOtp = async () => {
    if (loading || !canResend) return;

    if (!/^[0-9]{10}$/.test(formData.PhoneNo)) {
      setMessage("Invalid phone number");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        {
          email: formData.email,
          PhoneNo: formData.PhoneNo,
        }
      );

      if (res.data.success) {
        setOtpSent(true);
        setSuccess(true);
        setMessage("OTP sent successfully");

        setCanResend(false);
        setResendTimer(30);
      }
    } catch (err) {
      setMessage(err.response?.data?.msg || "Failed to send OTP");
      setSuccess(false);
    }

    setLoading(false);
  };

  // VERIFY
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage("Enter OTP");
      return;
    }

    if (formData.password !== formData.confirmpassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          ...formData,
          otp,
        }
      );

      if (res.data.success) {
        setSuccess(true);
        setMessage("Signup successful 🎉");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error");
      setSuccess(false);
    }
  };

  return (
    <div className="signup-page">
      <Navbar />

      <div className="signup-container">
        <div className="signup-card">
          <h2>Create Account</h2>
          <p className="subtitle">Join Homestay and explore 🏡</p>

          {message && (
            <div className={success ? "msg success" : "msg error"}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>First Name</label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                name="PhoneNo"
                value={formData.PhoneNo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmpassword"
                value={formData.confirmpassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>User Type</label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                <option value="guest">Guest</option>
                <option value="host">Host</option>
              </select>
            </div>

            <div className="terms">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                required
              />
              <span>I agree to Terms & Conditions</span>
            </div>

            {!otpSent && (
              <button type="button" onClick={handleSendOtp} disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            )}

            {otpSent && (
              <>
                <div className="input-group">
                  <label>Enter OTP</label>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="otp-input"
                    required
                  />
                </div>

                <button type="submit">Verify & Sign Up</button>

                <div className="resend-section">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!canResend || loading}
                    className="resend-btn"
                  >
                    {canResend
                      ? "Resend OTP"
                      : `Resend in ${resendTimer}s`}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="footer">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}