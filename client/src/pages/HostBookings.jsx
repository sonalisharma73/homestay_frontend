// import { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../componets/Navbar";
// import "./HostBookings.css";

// export default function HostBookings(){

//   const hostId = localStorage.getItem("userId");
//   const [bookings,setBookings] = useState([]);

//   useEffect(()=>{
//     console.log("Fetching host bookings for hostId:", hostId);

//     fetchBookings();
    

//   },[]);

//   const fetchBookings = async ()=>{
//     const res = await axios.get(
//       `http://localhost:5000/booking/host-bookings/${hostId}`
//     );
//     setBookings(res.data);
//   };

//   return(
//     <>
//     <Navbar/>

//     <div className="host-page">
//       <h2>Bookings on your homes</h2>

//       {bookings.length === 0 && <p>No bookings yet</p>}

//       {bookings.map(b=>(
//         <div className="host-card" key={b._id}>

//           <img
//             src={`http://localhost:5000/${b.home?.photos?.[0]}`}
//             className="host-img"
//           />

//           <div className="host-info">

//             <h3>{b.home?.housename}</h3>

//             <p>
//               Guest: {b.user?.first_name}  
//               ({b.user?.email})
//             </p>

//             <p>
//               {new Date(b.checkIn).toDateString()} →  
//               {new Date(b.checkOut).toDateString()}
//             </p>

//             <p>Status: {b.status}</p>
//             <p>Payment: {b.paymentMethod}</p>
//             <p>Total: ₹{b.finalPrice}</p>

//           </div>

//         </div>
//       ))}

//     </div>
//     </>
//   );
// }

import { useEffect, useState } from "react";
// import axios from "axios";
import Navbar from "../componets/Navbar";
import "./HostBookings.css";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";


export default function HostBookings(){

  const hostId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [bookings,setBookings] = useState([]);

  useEffect(()=>{
    fetchBookings();
  },[]);

  const fetchBookings = async ()=>{
    try{
      const res = await axios.get(
        `http://localhost:5000/booking/host-bookings/${hostId}`
      );
      setBookings(res.data);
    }catch(err){
      console.log("Fetch error:", err);
    }
  };

  return(
    <>
    <Navbar/>

    <div className="host-page">
      <div className="host-header">
      <h2>Bookings on your homes</h2>
      </div>
      <div className="host-bookings-container">
      {bookings.length === 0 && <p>No bookings yet</p>}
      </div>

      {bookings.map(b=>(
        <div className="host-card" key={b._id}>

          <img
            src={`http://localhost:5000/${b.home?.photos?.[0]}`}
            className="host-img"
             onClick={() => navigate(`/details/${b.home?._id}`)}
            style={{ cursor: "pointer" }}
            
          />

          <div className="host-info">

            <h3>{b.home?.housename}</h3>

            <p>
              Guest: {b.user?.first_name}  
              ({b.user?.email})
            </p>

            <p>
              {new Date(b.checkIn).toDateString()} →  
              {new Date(b.checkOut).toDateString()}
            </p>

            <p>Rooms: {b.roomsNeeded}</p>
            <p>Guests: {b.guestsCount}</p>

            <p>Status: {b.status}</p>
            <p>Payment: {b.paymentMethod}</p>
            <p>Total: ₹{b.finalPrice}</p>

          </div>

        </div>
      ))}

    </div>
    </>
  );
}