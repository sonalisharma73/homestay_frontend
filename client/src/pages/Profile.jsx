
import { useEffect, useState } from "react";

import Navbar from "../componets/Navbar";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import axios from "../axiosConfig";



export default function Profile() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchStats();
    }
  }, []);

  /* ================= FETCH USER ================= */
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/profile/${userId}`
      );
      setUser(res.data);
    } catch (err) {
      console.log("Profile error:", err);
    }
  };

  /* ================= FETCH STATS ================= */
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/stats/${userId}`
      );
      setStats(res.data);
    } catch (err) {
      console.log("Stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <h2 className="loading">Loading profile...</h2>;
  if (!user) return <h2>User not found</h2>;

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <div className="profile-card">

          {/* LEFT SIDE */}
          <div className="left">
            <img
              src={
                user.profilePic
                  ? `http://localhost:5000/${user.profilePic}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              className="avatar"
            />

            <h2>{user.first_name} {user.last_name}</h2>

            <div className="info">
              <p><span>First Name:</span> {user.first_name}</p>
              <p><span>Last Name:</span> {user.last_name || "-"}</p>
              <p><span>Email:</span> {user.email}</p>
              <p><span>Gender:</span> {user.gender}</p>
               <p><span>Phone No:</span> {user.phoneNo || "-"}</p>
              <p><span>Account Type:</span> {user.userType}</p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="right">

            {/* STATS */}
            <div className="stats">

  <div className="box">
    <h3>{stats?.totalBookings || 0}</h3>
    <p>Total Bookings</p>
  </div>

  <div className="box">
    <h3>{stats?.completedBookings || 0}</h3>
    <p>Completed</p>
  </div>

  <div className="box cancel">
    <h3>{stats?.cancelledBookings || 0}</h3>
    <p>Cancelled</p>
  </div>

  <div className="box spent">
    <h3>₹{stats?.totalSpent || 0}</h3>
    <p>Total Spent</p>
  </div>

</div>

            {/* LINKS */}
            <div className="links">
              <button onClick={() => navigate("/my-bookings")}>
                My Bookings
              </button>

              <button onClick={() => navigate("/favourites")}>
                Favourites
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