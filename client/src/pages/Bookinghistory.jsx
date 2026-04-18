
import { useEffect, useState } from "react";
import Navbar from "../componets/Navbar";
import "./MyBookings.css";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";

export default function BookingHistory() {

const [bookings,setBookings] = useState([]);
const [filter,setFilter] = useState("upcoming");
const [showHost,setShowHost] = useState(null); // track which host details open

const userId = localStorage.getItem("userId");
const navigate = useNavigate();

useEffect(()=>{
fetchBookings();
},[]);

const fetchBookings = async ()=>{
const res = await axios.get(
`http://localhost:5000/booking/my-bookings/${userId}`
);
setBookings(res.data);
};

const today = new Date();

const filteredBookings = bookings.filter(b => {

if(filter === "upcoming"){
return new Date(b.checkIn) >= today;
}

if(filter === "previous"){
return new Date(b.checkOut) < today;
}

return true;

});

return(

<>
<Navbar/>

<div className="mybook-page">

<h2 className="page-title">My Booking History</h2>

{/* FILTER BUTTONS */}

<div style={{display:"flex",gap:"10px",marginBottom:"20px"}}>

<button className={`filter-btn ${filter==="upcoming" ? "active" : ""}`} onClick={()=>setFilter("upcoming")}>
  Upcoming Bookings
</button>

<button className={`filter-btn ${filter==="previous" ? "active" : ""}`} onClick={()=>setFilter("previous")}>
  Previous Bookings
</button>

</div>

{filteredBookings.length===0 && (
<p>No bookings found</p>
)}

{filteredBookings.map((b)=>(

<div className="booking-card" key={b._id}>

<img
className="booking-img"
src={`http://localhost:5000/${b.home?.photos?.[0]}`}
onClick={()=>navigate(`/details/${b.home?._id}`)}
style={{cursor:"pointer"}}
/>

<div className="booking-content">

<div className="top">

<h3>{b.home?.housename}</h3>

<span className={`status ${b.status}`}>
{b.status}
</span>

</div>

<p className="location">
📍 {b.home?.address?.city}
</p>

<div className="grid">

<p><strong>Check-In:</strong> {new Date(b.checkIn).toDateString()}</p>

<p><strong>Check-Out:</strong> {new Date(b.checkOut).toDateString()}</p>

<p><strong>Rooms:</strong> {b.roomsNeeded || 1}</p>

<p><strong>Guests:</strong> {b.guestsCount || 1}</p>

<p><strong>Payment:</strong> {b.paymentMethod}</p>

<p><strong>Total:</strong> ₹{b.finalPrice}</p>

</div>

<div className="btns">

<button
    className="action-btn"
    onClick={()=>navigate("/chatbot")}
  >
    Help
  </button>

  <button
    className="action-btn primary"
    onClick={()=>setShowHost(showHost===b._id ? null : b._id)}
  >
    Contact Host
  </button>

</div>

{/* HOST DETAILS */}

{showHost === b._id && (

<div style={{
marginTop:"10px",
padding:"10px",
background:"#f5f5f5",
borderRadius:"6px"
}}>

<p>
<strong>Host Name:</strong> {b.home?.owner?.name}
</p>

<p>
<strong>Email:</strong> {b.home?.owner?.email}
</p>

<p>
<strong>Phone:</strong> {b.home?.owner?.phone}
</p>

<div style={{marginTop:"10px",display:"flex",gap:"10px"}}>

<a 
href={`tel:${b.home?.owner?.phone}`} 
style={{background:"#4CAF50",color:"white",padding:"6px 10px",borderRadius:"5px",textDecoration:"none"}}
>
📞 Call
</a>

<a 
href={`mailto:${b.home?.owner?.email}`} 
style={{background:"#2196F3",color:"white",padding:"6px 10px",borderRadius:"5px",textDecoration:"none"}}
>
✉ Email
</a>

<a 
href={`https://wa.me/91${b.home?.owner?.phone}`} 
target="_blank"
style={{background:"#25D366",color:"white",padding:"6px 10px",borderRadius:"5px",textDecoration:"none"}}
>
💬 WhatsApp
</a>

</div>

</div>

)}

</div>

</div>

))}

</div>

</>

);

}