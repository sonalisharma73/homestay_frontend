
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// // import axios from "axios";
// import Navbar from "../componets/Navbar";
// import "./Details.css";
// import axios from "../axiosConfig";



// export default function Details() {
//   const { id } = useParams();
//   const [house, setHouse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentImg, setCurrentImg] = useState(0);

//   useEffect(() => {
//     const fetchHouse = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/store/homes/${id}`);
//         setHouse(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHouse();
//   }, [id]);

//   const nextImg = () => {
//     setCurrentImg(prev =>
//       prev === house.photos.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevImg = () => {
//     setCurrentImg(prev =>
//       prev === 0 ? house.photos.length - 1 : prev - 1
//     );
//   };

//   if (loading) return <h2 className="loading">Loading...</h2>;
//   if (!house) return <h2 className="error">House not found</h2>;

//   return (
//     <>
//       <Navbar />

//       <div className="details-page">
//         <div className="outer-card">

//           <h1 className="page-heading">{house.housename}</h1>

//           {/* PHOTO CARD */}
//           <div className="photo-card">
//             <img
//               src={`http://localhost:5000/${house.photos[currentImg]}`}
//               className="main-img"
//             />

//             {house.photos.length > 1 && (
//               <>
//                 <button className="prev" onClick={prevImg}>‹</button>
//                 <button className="next" onClick={nextImg}>›</button>
//               </>
//             )}
//           </div>

//           {/* DETAILS CARD */}
//           <div className="details-card">
//             <div className="info-block">
//                 <span className="label">Price:</span>
//                 <span className="value">
//                   {house.price}
//                 </span>
//               </div>

//                   {/* 📍 ADDRESS */}
//           <div className="info-block">
//           <span className="label">Location:</span>
//           <span className="value">
//             {house.address?.area}, {house.address?.city}, {house.address?.state}
//           </span>
//               </div>

//               {/* 🏠 TYPE */}
//               <div className="info-block">
//                 <span className="label">Property Type:</span>
//                 <span className="value">
//                   {house.placeType} • {house.propertyType}
//                 </span>
//               </div>

//               {/* 🛏 DETAILS */}
//               <div className="info-grid">
//                 <div className="info-box">
//                   <span className="label">Bedrooms</span>
//                   <span className="value">{house.houseDetails?.bedrooms}</span>
//                 </div>

//                 <div className="info-box">
//                   <span className="label">Beds</span>
//                   <span className="value">{house.houseDetails?.beds}</span>
//                 </div>

//                 <div className="info-box">
//                   <span className="label">Bathrooms</span>
//                   <span className="value">{house.houseDetails?.bathrooms}</span>
//                 </div>

//                 <div className="info-box">
//                   <span className="label">Guests</span>
//                   <span className="value">{house.houseDetails?.guests}</span>
//                 </div>
//               </div>


//             {/* DESCRIPTION */}
//             <div className="section">
//               <h3>Description</h3>
//               <p>{house.description}</p>
//             </div>

//             {/* AMENITIES */}
//             <div className="section">
//               <h3>Amenities</h3>
//               <ul>
//                 {house.amenities?.map((a,i)=><li key={i}>{a}</li>)}
//               </ul>
//             </div>

//             {/* RULES */}
//             {/* <div className="section">
//               <h3>House Rules</h3>
//               <ul>
//                 {house.rules?.map((r,i)=><li key={i}>{r}</li>)}
//               </ul>
//             </div> */}

//             {/* OWNER */}
//             <div className="section">
//               <h3>Host</h3>
//               <p>Name: {house.owner?.name}</p>
//               <p>Email: {house.owner?.email}</p>
//               <p>Phone: {house.owner?.phone}</p>
//             </div>

//             {/* RATING */}
//             <div className="section">
//               <h3>Rating</h3>
//               <p>⭐ {house.averageRating} ({house.totalReviews} reviews)</p>
//             </div>

//             {/* REVIEWS */}
//             <div className="section">
//               <h3>Reviews</h3>

//               {house.reviews.length === 0 && <p>No reviews yet</p>}

//               {house.reviews.map((rev,i)=>(
//                 <div key={i} className="review-card">
//                   <strong>{rev.name}</strong>
//                   <p>⭐ {rev.rating}</p>
//                   <p>{rev.comment}</p>
//                 </div>
//               ))}
//             </div>

//           </div>

//         </div>
//       </div>
//     </>
//   );
// }
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ added
import Navbar from "../componets/Navbar";
import "./Details.css";
import axios from "../axiosConfig";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ added

  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/store/homes/${id}`);
        setHouse(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHouse();
  }, [id]);

  const nextImg = () => {
    setCurrentImg(prev =>
      prev === house.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImg = () => {
    setCurrentImg(prev =>
      prev === 0 ? house.photos.length - 1 : prev - 1
    );
  };

  // ✅ booking handler
  const handleBooking = () => {
    navigate(`/booking/${house._id}`);
  };

  if (loading) return <h2 className="loading">Loading...</h2>;
  if (!house) return <h2 className="error">House not found</h2>;

  return (
    <>
      <Navbar />

      <div className="details-page">
        <div className="outer-card">

          <h1 className="page-heading">{house.housename}</h1>

          <div className="photo-card">
            <img
              src={`http://localhost:5000/${house.photos[currentImg]}`}
              className="main-img"
            />

            {house.photos.length > 1 && (
              <>
                <button className="prev" onClick={prevImg}>‹</button>
                <button className="next" onClick={nextImg}>›</button>
              </>
            )}
          </div>

          <div className="details-card">
            <div className="info-block">
              <span className="label">Price:</span>
              <span className="value">{house.price}</span>
            </div>

            <div className="info-block">
              <span className="label">Location:</span>
              <span className="value">
                {house.address?.area}, {house.address?.city}, {house.address?.state}
              </span>
            </div>

            <div className="info-block">
              <span className="label">Property Type:</span>
              <span className="value">
                {house.placeType} • {house.propertyType}
              </span>
            </div>

            <div className="info-grid">
              <div className="info-box">
                <span className="label">Bedrooms</span>
                <span className="value">{house.houseDetails?.bedrooms}</span>
              </div>

              <div className="info-box">
                <span className="label">Beds</span>
                <span className="value">{house.houseDetails?.beds}</span>
              </div>

              <div className="info-box">
                <span className="label">Bathrooms</span>
                <span className="value">{house.houseDetails?.bathrooms}</span>
              </div>

              <div className="info-box">
                <span className="label">Guests</span>
                <span className="value">{house.houseDetails?.guests}</span>
              </div>
            </div>

            <div className="section">
              <h3>Description</h3>
              <p>{house.description}</p>
            </div>

            <div className="section">
              <h3>Amenities</h3>
              <ul>
                {house.amenities?.map((a,i)=><li key={i}>{a}</li>)}
              </ul>
            </div>

            <div className="section">
              <h3>Host</h3>
              <p>Name: {house.owner?.name}</p>
              <p>Email: {house.owner?.email}</p>
              <p>Phone: {house.owner?.phone}</p>
            </div>

            <div className="section">
              <h3>Rating</h3>
              <p>⭐ {house.averageRating} ({house.totalReviews} reviews)</p>
            </div>

            <div className="section">
              <h3>Reviews</h3>

              {house.reviews.length === 0 && <p>No reviews yet</p>}

              {house.reviews.map((rev,i)=>(
                <div key={i} className="review-card">
                  <strong>{rev.name}</strong>
                  <p>⭐ {rev.rating}</p>
                  <p>{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* ✅ BOOK BUTTON */}
            <div className="btn-group">
              <button onClick={handleBooking}>Book Now</button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}