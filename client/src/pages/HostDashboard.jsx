

import { useEffect, useState } from "react";
// import axios from "axios";
import Navbar from "../componets/Navbar";
import { useNavigate } from "react-router-dom";
import "./HostDashboard.css";   // reuse same styling
import axios from "../axiosConfig";


export default function HostDashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
const BASE = import.meta.env.VITE_API_URL || "";
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchStats();
  }, []);

  /* ================= FETCH USER ================= */
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `/api/auth/profile/${userId}`
      );
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FETCH HOST STATS ================= */
  const fetchStats = async () => {
    try {
      const res = await axios.get(
  `/host/stats/${userId}`
);
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return <h2 className="loading">Loading...</h2>;

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <div className="profile-card">

          {/* LEFT SIDE (HOST INFO) */}
          <div className="left">
            <img
              src={
                user.profilePic
                  ? `${BASE}/${user.profilePic}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              className="avatar"
            />

            <h2>{user.first_name} {user.last_name}</h2>

            <div className="info">
              <p><span>Email:</span> {user.email}</p>
              <p><span>Phone:</span> {user.phoneNo || "-"}</p>
              <p><span>Account Type:</span> Host</p>
            </div>
          </div>

          {/* RIGHT SIDE (HOST DASHBOARD) */}
          <div className="right">

            {/* STATS */}
            
            <div className="stats">

  <div className="box">
    <h3>{stats?.totalHomes || 0}</h3>
    <p>Total Homes</p>
  </div>

  <div className="box">
    <h3>{stats?.totalBookings || 0}</h3>
    <p>Total Bookings</p>
  </div>

  <div className="box">
    <h3>{stats?.confirmedBookings || 0}</h3>
    <p>Confirmed</p>
  </div>

  <div className="box cancel">
    <h3>{stats?.cancelledBookings || 0}</h3>
    <p>Cancelled</p>
  </div>

  <div className="box">
    <h3>{stats?.completedBookings || 0}</h3>
    <p>Completed</p>
  </div>

  <div className="box upcoming">
    <h3>{stats?.upcomingBookings || 0}</h3>
    <p>Upcoming</p>
  </div>

  <div className="box earnings">
    <h3>₹{stats?.totalEarnings || 0}</h3>
    <p>Total Earnings</p>
  </div>

</div>

            {/* ACTION BUTTONS */}
            <div className="links">
              <button onClick={() => navigate("/homelist")}>
                My Homes
              </button>

              <button onClick={() => navigate("/host-bookings")}>
                My Bookings
              </button>

              <button onClick={() => navigate("/addHome")}>
                Add New Home
              </button>

              <button onClick={() => navigate("/edit-profile")}>
                Edit Profile
              </button>

              <button className="logout" onClick={logout}>
                Logout
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}