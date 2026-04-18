
import { useEffect, useState } from "react";
// import axios from "axios";
import Navbar from "../componets/Navbar";
import "./MyBookings.css";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";


export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const userId = localStorage.getItem("userId");
 
const navigate = useNavigate();
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await axios.get(
      `http://localhost:5000/booking/my-bookings/${userId}`
    );
    setBookings(res.data);
  };

 const cancelBooking = async (id) => {
  await axios.put(`http://localhost:5000/booking/cancel/${id}`);
  fetchBookings();
};
  const addReview = async (homeId) => {
  try {
   const rating = Number(prompt("Rating 1-5"));

if (!rating || rating < 1 || rating > 5) {
  alert("Rating must be between 1 and 5");
  return;
}
    const comment = prompt("Write review");
  
    const res = await axios.post("http://localhost:5000/booking/review", {
      homeId,
  
      userId,
      rating,
      comment,
    });

    alert("Review added");

    fetchBookings();

  } catch (err) {
    alert(err.response?.data?.msg || "Review failed");
  }
};

  return (
    <>
      <Navbar />

    <div className="mybook-page">
      <h2 className="page-title">My Bookings</h2>
              {bookings.length === 0 ? (
                <p className="no-bookings">No bookings found.</p>
              ) : (
                bookings.map((b) => (
          <div className="booking-card" key={b._id}>

            {/* IMAGE */}
            <img
              className="booking-img"
              src={`http://localhost:5000/${b.home?.photos?.[0]}`}
               onClick={() => navigate(`/details/${b.home?._id}`)}
              style={{ cursor: "pointer" }}
            />

            {/* INFO */}
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

  <p><strong>Rooms Booked:</strong> {b.roomsNeeded || 1}</p>
  <p><strong>Guests:</strong> {b.guestsCount || 1}</p>

  <p><strong>Payment:</strong> {b.paymentMethod}</p>
  <p><strong>Total:</strong> ₹{b.finalPrice}</p>
</div>

              {/* <div className="btns">
                {b.status !== "CANCELLED" && (
                      <button
                        className="cancel"
                        onClick={() => cancelBooking(b._id)}
                      >
                        Cancel
                      </button>
                    )}

                    {b.status === "CONFIRMED" &&
                    new Date(b.checkOut) < new Date() && (
                      <button
                        className="review"
                        onClick={() => addReview(b.home._id, b.home.hostId)}
                      >
                        Review
                      </button>
                    )}

               </div> */
               <div className="btns">

{/* Cancel button only if booking confirmed and stay not completed */}
{b.status === "CONFIRMED" && new Date(b.checkOut) > new Date() && (
  <button
    className="cancel"
    onClick={() => cancelBooking(b._id)}
  >
    Cancel
  </button>
)}

{/* Review button only after stay completed */}
{b.status === "CONFIRMED" && new Date(b.checkOut) < new Date() && (
  <button
    className="review"
    onClick={() => addReview(b.home._id)}
  >
    Review
  </button>
)}

</div>}

            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
}