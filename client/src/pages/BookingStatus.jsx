import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";



export default function BookingStatus() {
  const location = useLocation();
  const navigate = useNavigate();

  const status = location.state?.status; // success | failed
  const message = location.state?.message;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/my-bookings");
    }, 3000); // redirect after 3 sec

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      fontFamily: "sans-serif"
    }}>
      
      {status === "success" ? (
        <>
          <h1 style={{ color: "green" }}>✅ Booking Confirmed</h1>
          <p>{message || "Your booking is successful!"}</p>
        </>
      ) : (
        <>
          <h1 style={{ color: "red" }}>❌ Booking Failed</h1>
          <p>{message || "Something went wrong"}</p>
        </>
      )}

      <p style={{ marginTop: 20 }}>
        Redirecting to My Bookings...
      </p>
    </div>
  );
}