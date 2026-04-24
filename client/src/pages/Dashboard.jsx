import { useEffect, useState } from "react";
// import axios from "axios";
import Navbar from "../componets/Navbar";
import "./Dashboard.css";

import axios from "../axiosConfig";



export default function Dashboard(){
const BASE = import.meta.env.VITE_API_URL || "";
  const userId = localStorage.getItem("userId");
  const [user,setUser] = useState(null);
  const [stats,setStats] = useState(null);

  useEffect(()=>{
    fetchUser();
    fetchStats();
  },[]);

  const fetchUser = async ()=>{
    const res = await axios.get(
      `/api/auth/user/${userId}`
    );
    setUser(res.data);
  };

  const fetchStats = async ()=>{
    const res = await axios.get(
      `/api/auth/stats/${userId}`
    );
    setStats(res.data);
  };

  if(!user) return <> <Navbar/> 
  <h2>Loading...</h2></>;

  return(
    <>
    <Navbar/>

    <div className="dash">

      <div className="sidebar">
        <img
          src={
            user.profilePic
            ? `${BASE}/${user.profilePic}`
            : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          className="avatar"
        />

        <h3>{user.first_name}</h3>
      </div>

      <div className="content">
        <h2>My Profile</h2>
        <p><b>Email:</b> {user.email}</p>

        {stats && (
          <div className="stats">
            <div className="box">
              <h3>{stats.totalBookings}</h3>
              <p>Bookings</p>
            </div>

            <div className="box">
              <h3>₹{stats.totalSpent}</h3>
              <p>Total Spent</p>
            </div>
          </div>
        )}
      </div>

    </div>
    </>
  );
}