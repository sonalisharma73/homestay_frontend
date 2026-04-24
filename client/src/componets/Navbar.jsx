
import axios from "../axiosConfig";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect,useRef } from "react";
// import axios from "axios";
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
        `http://localhost:5000/api/auth/profile/${userId}`
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
  const profilePic =
    user?.profilePic
      ? `http://localhost:5000/${user.profilePic}`
      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  // return (
  //   <nav className="navbar">

  //     {/* LEFT */}
  //     <div className="nav-left">
  //       <NavLink to="/" className="logo">Homestay-Haven</NavLink>
  //     </div>

  //     {/* CENTER LINKS */}
  //     <ul className="nav-links">
  //        <li><NavLink to="/index">Home</NavLink></li>
  //       <li><NavLink to="/">HomeList</NavLink></li>

  //       {!role && (
  //         <>
  //           <li><NavLink to="/signup">Signup</NavLink></li>
  //           <li><NavLink to="/login">Login</NavLink></li>
  //         </>
  //       )}

  //       {role === "guest" && (
  //         <>
  //           <li><NavLink to="/favourites">Favourite</NavLink></li>
  //           <li><NavLink to="/my-bookings">My Bookings</NavLink></li>
  //            <li><NavLink to="/event/eventlist">Events</NavLink></li>
  //         </>
  //       )}

  //       {role === "host" && (
  //         <>
  //           <li><NavLink to="/addHome">Add Home</NavLink></li>
  //           <li><NavLink to="/homelist">My Homes</NavLink></li>
  //           <li><NavLink to="/host-bookings">Home Bookings</NavLink></li>
  //            <li><NavLink to="/add-event">Add Event</NavLink></li>
            
  //         </>
  //       )}
  //     </ul>

  //     {/* RIGHT PROFILE */}
  //     <div className="nav-right">
  //       {role && (
  //         <div className="profile-area"  ref={profileRef}>

  //           <img
  //             src={profilePic}
  //             className="nav-avatar"
  //             onClick={() => setShowMenu(!showMenu)}
  //           />

  //           {showMenu && (
  //             <div className="dropdown">

  //               {/* ===== GUEST MENU ===== */}
  //               {role === "guest" && (
  //                 <>
  //                   <p onClick={()=>navigate("/profile")}>My Profile</p>
  //                   <p onClick={()=>navigate("/my-bookings")}>My Bookings</p>
  //                   <p onClick={()=>navigate("/help/guest")}>Help</p>
  //                 </>
  //               )}

  //               {/* ===== HOST MENU ===== */}
  //               {role === "host" && (
  //                 <>
  //                   <p onClick={()=>navigate("/host-dashboard")}>Host Dashboard</p>
  //                   <p onClick={()=>navigate("/host-bookings")}>Home Bookings</p>
  //                    <p onClick={()=>navigate("/host-help")}>Help</p>
  //                    <p onClick={()=>navigate("/my-events")}>My Events</p>
                    
  //                 </>
  //               )}

  //               <p onClick={handleLogout}>Logout</p>
  //             </div>
  //           )}

  //         </div>
  //       )}
  //     </div>

  //   </nav>
  // );
  return (
  <nav className="navbar">

    {/* LEFT */}
    <div className="nav-left">
      <NavLink to="/" className="logo">Homestay-Haven</NavLink>
    </div>

    {/* CENTER MAIN */}
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

    {/* PROFILE RIGHT */}
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

    {/* 🔥 MOBILE NAV LINKS */}
    <div className="mobile-links">
      <p onClick={()=>navigate("/")}>🏡 Homes</p>
      <p onClick={()=>navigate("/homes")}>HomeStays</p>
      <p onClick={()=>navigate("/event/eventlist")}>🎉 Events</p>
    </div>

    {/* EXISTING MENU */}

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