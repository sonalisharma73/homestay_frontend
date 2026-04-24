
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import "./Booking.css";
import Navbar from "../componets/Navbar";
import axios from "../axiosConfig";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [home, setHome] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
const BASE = import.meta.env.VITE_API_URL || "";

  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [roomsNeeded, setRoomsNeeded] = useState(1);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [days, setDays] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  const [availableRooms, setAvailableRooms] = useState(0);
  const [available, setAvailable] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("COD");
const [guestsCount, setGuestsCount] = useState(1);


  /* FETCH HOME */
  useEffect(() => {
    axios
      .get(`/booking/home/${id}`)
      .then((res) => setHome(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  /* IMAGE SLIDER */
  const nextImg = () => {
    if (!home?.photos) return;
    setImgIndex((prev) => (prev + 1) % home.photos.length);
  };

  const prevImg = () => {
    if (!home?.photos) return;
    setImgIndex((prev) =>
      prev === 0 ? home.photos.length - 1 : prev - 1
    );
  };

  /* PRICE + DISCOUNT */
  useEffect(() => {
    if (checkIn && checkOut && home) {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diff = (d2 - d1) / (1000 * 60 * 60 * 24);

      if (diff > 0) {
        setDays(diff);

        const totalPrice = diff * home.price * roomsNeeded;
        setTotal(totalPrice);

        let disc = 0;
        if (totalPrice > 10000) disc = 15;
        else if (totalPrice > 5000) disc = 10;

        setDiscount(disc);
        setFinalPrice(totalPrice - (totalPrice * disc) / 100);
      }
    }
  }, [checkIn, checkOut, home, roomsNeeded]);

  /* VALIDATION */
 const validate = () => {
  
  if (!guestName.trim()) return alert("Enter name"), false;
  if (!/^[0-9]{10}$/.test(phone))
    return alert("Enter valid 10 digit phone"), false;
  if (!checkIn || !checkOut)
    return alert("Select dates"), false;
  if (new Date(checkOut) <= new Date(checkIn))
    return alert("Checkout must be after checkin"), false;
  
  if (guestsCount > home.houseDetails?.guests) {
  alert("Guest limit exceeded");
  if (roomsNeeded > availableRooms && available !== null) {
  alert(`Only ${availableRooms} rooms available`);
  return false;
}
  return false;
}

  const today = new Date().setHours(0,0,0,0);
  const checkInDate = new Date(checkIn).setHours(0,0,0,0);

  if (checkInDate < today) {
    alert("Check-in cannot be in the past");
    return false;
  }

  return true;
};

  /* CHECK AVAILABILITY */
  const checkAvailability = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post(
        "/booking/check",
        { homeId: id, checkIn, checkOut, roomsNeeded }
      );

      setAvailable(res.data.available);
      setAvailableRooms(res.data.availableRooms);

      if (!res.data.available) {
        alert(`Only ${res.data.availableRooms} rooms available`);
      }
    } catch {
       alert(err.response?.data?.msg || "Server error");
    }
  };

  /* COD BOOKING */
  const handleCODBooking = async () => {
  try {
    const res = await axios.post("/booking/cod", {
      user: localStorage.getItem("userId"), // or session
      home: id,
      checkIn,
      checkOut,
      days,
      roomsNeeded,
      guestName,
       guestsCount, 
      phone,
      totalPrice: total,
      discount,
      finalPrice,
    });

    console.log("Booking response:", res.data);

    navigate("/booking-status", {
      state: {
        status: "success",
        message: "Your booking has been confirmed 🎉"
      }
    });

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);

    navigate("/booking-status", {
      state: {
        status: "failed",
        message: err.response?.data?.msg || "Booking failed"
      }
    });
  }
};
  /* ONLINE PAYMENT */
  const handleOnlinePayment = async () => {
    try {
      const res = await axios.post(
        "/booking/pay",
        { amount: finalPrice }
      );

      const order = res.data;

      const options = {
        key: "RAZORPAY_PUBLIC_KEY", // replace with your key
        amount: order.amount,
        order_id: order.id,
        handler: async function (response) {
          await axios.post(
            "/booking/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: {
                user: localStorage.getItem("userId"),
                home: id,
                checkIn,
                checkOut,
                days,
                roomsNeeded,
                 guestsCount, 
                guestName,
                phone,
                totalPrice: total,
                discount,
                finalPrice,
              },
            }
          );

          alert("Payment success & booking confirmed 🎉");
          navigate("/booking-status", {
  state: {
    status: "success",
    message: "Payment successful & booking confirmed 🎉"
  }
});
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert("Payment failed");

      navigate("/booking-status", {
  state: {
    status: "failed",
    message: "Payment failed"
  }
});
    }
  };

  if (!home)
    return <h2 style={{ padding: "120px", textAlign: "center" }}>Loading...</h2>;

  return (
    <>
      <Navbar />
      <div className="booking-page">
        <div className="booking-container">

          <div className="home-box">
            <div className="photo-card">
  <img
    // src={`http://localhost:5000/${home.photos?.[imgIndex]}`}
    src={`${BASE}/${home.photos?.[imgIndex]}`}
    className="main-img"
  />

  {home.photos?.length > 1 && (
    <>
      <button className="prev" onClick={prevImg}>‹</button>
      <button className="next" onClick={nextImg}>›</button>
    </>
  )}
</div>

            <h2>{home.housename}</h2>
            <div className="section">
  <span className="label">Location:</span>
  <span>{home.address?.city}, {home.address?.state}</span>
</div>

<div className="section">
  <span className="label">Price:</span>
  <span>₹{home.price} / day</span>
</div>

<div className="section">
  <span className="label">Description:</span>
  <span>{home.description}</span>
</div>

            <div className="section">
              <h3>Details</h3>
              <p>Total Rooms: max={availableRooms || home.houseDetails?.bedrooms}</p>
              <p>Beds: {home.houseDetails?.beds}</p>
              <p>Guests: {home.houseDetails?.guests}</p>
              <p>Type: {home.placeType}</p>
              <p>Property: {home.propertyType}</p>
            </div>

             <div className="section">
              <h3>Amenities</h3>
              <ul>
                {home.amenities?.map((a,i)=><li key={i}>{a}</li>)}
              </ul>
            </div>

            <div className="section">
              <h3>Host</h3>
                 <p>Name: {home.owner?.name}</p>
                <p>Email: {home.owner?.email}</p>
                   <p>Phone: {home.owner?.phone}</p>
            </div>

          </div>

          <div className="booking-box">
            <h2>Complete Booking</h2>

            <label>Name</label>
            <input value={guestName} onChange={e => setGuestName(e.target.value)} />

            <label>Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} />

            <label>Rooms Needed</label>
            <input
              type="number"
              value={roomsNeeded}
              min="1"
              max={home.houseDetails?.bedrooms}
              onChange={e => setRoomsNeeded(Number(e.target.value))}
            />
            <label>Number of Guests</label>
              <input
                type="number"
                value={guestsCount}
                min="1"
                max={home.houseDetails?.guests}
                onChange={e => setGuestsCount(Number(e.target.value))}
              />

            <label>Check In</label>
            <input type="date" onChange={e => setCheckIn(e.target.value)} />

            <label>Check Out</label>
            <input type="date" onChange={e => setCheckOut(e.target.value)} />

            <label>Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="COD">Pay at Property</option>
              <option value="ONLINE">Pay Online</option>
            </select>

            <button onClick={checkAvailability}>
              Check Availability
            </button>

            {available !== null && (
              <div className="availability-box">
                <p>Available Rooms: {availableRooms}</p>
                <p>Status: {available ? "Available ✅" : "Not Available ❌"}</p>
              </div>
            )}

            <hr />

            <p>Days: {days}</p>
            <p>Total: ₹{total}</p>
            <p>Discount: {discount}%</p>
            <h3>Final Price: ₹{finalPrice}</h3>

            <button
              disabled={available === null || !available}
              onClick={() =>
                paymentMethod === "COD"
                  ? handleCODBooking()
                  : handleOnlinePayment()
              }
            >
              Confirm Booking
            </button>
          </div>

        </div>
      </div>
    </>
  );
}