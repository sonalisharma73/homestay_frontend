import axios from "../axiosConfig";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef();

  const userId = localStorage.getItem("userId");

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

  /* ================= LOAD ================= */
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    if (userId) fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ================= PROFILE PIC ================= */
  const BASE = import.meta.env.VITE_API_URL || "";

  const profilePic =
    user?.profilePic
      ? `${BASE}/${user.profilePic}`
      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <nav className="navbar">

      <div className="nav-left">
        <NavLink to="/" className="logo">Homestay-Haven</NavLink>
      </div>

      <div className="nav-center">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-pill active" : "nav-pill"}>
          🏡 Homes
        </NavLink>

        <NavLink to="/homes" className={({isActive}) => isActive ? "nav-pill active" : "nav-pill"}>
          HomeStays
        </NavLink>

        <NavLink to="/event/eventlist" className={({isActive}) => isActive ? "nav-pill active" : "nav-pill"}>
          🎉 Events/places 
        </NavLink>

        {!role && (
          <>
            <NavLink to="/signup" className={({isActive}) => isActive ? "nav-pill active" : "nav-pill"}>
              Signup
            </NavLink>

            <NavLink to="/login" className={({isActive}) => isActive ? "nav-pill active" : "nav-pill"}>
              Login
            </NavLink>
          </>
        )}

        {role === "guest" && (
          <>
            <NavLink to="/favourites" className={({isActive}) => isActive ? "nav-pill active" : "nav-pill"}>
              ❤️ Favourite
            </NavLink>

            <NavLink to="/my-bookings" className={({isActive}) => isActive ? "nav-pill active" : "nav-pill"}>
              📅 Bookings
            </NavLink>
          </>
        )}

        {role === "host" && (
          <>
            <NavLink to="/addHome" className={({isActive}) => isActive ? "nav-pill active" : "nav-pill"}>
              ➕ Add Home
            </NavLink>

            <NavLink to="/homelist" className={({isActive}) => isActive ? "nav-pill active" : "nav-pill"}>
              My Homes
            </NavLink>

            <NavLink to="/host-bookings" className={({isActive}) => isActive ? "nav-pill active" : "nav-pill"}>
              Bookings
            </NavLink>

            <NavLink to="/add-event" className={({isActive}) => isActive ? "nav-pill active" : "nav-pill"}>
              Add Event
            </NavLink>
          </>
        )}
      </div>

      <div className="nav-right">
        {role && (
          <div className="profile-area" ref={profileRef}>

            <img
              src={profilePic}
              className="nav-avatar"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="dropdown">

                <div className="mobile-links">
                  <p onClick={()=>navigate("/")}>🏡 Homes</p>
                  <p onClick={()=>navigate("/homes")}>HomeStays</p>
                  <p onClick={()=>navigate("/event/eventlist")}>🎉 Events</p>
                </div>

                {role === "guest" && (
                  <>
                    <p onClick={()=>navigate("/profile")}>My Profile</p>
                    <p onClick={()=>navigate("/my-bookings")}>My Bookings</p>
                    <p onClick={()=>navigate("/help/guest")}>Help</p>
                  </>
                )}

                {role === "host" && (
                  <>
                    <p onClick={()=>navigate("/host-dashboard")}>Host Dashboard</p>
                    <p onClick={()=>navigate("/host-bookings")}>Home Bookings</p>
                    <p onClick={()=>navigate("/host-help")}>Help</p>
                    <p onClick={()=>navigate("/my-events")}>My Events</p>
                  </>
                )}

                <p onClick={handleLogout}>Logout</p>
              </div>
            )}

          </div>
        )}
      </div>

    </nav>
  );
}