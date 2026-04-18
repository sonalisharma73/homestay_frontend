
import React, { useEffect, useState } from "react";
// import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaStar } from "react-icons/fa";
import "./Home.css";
import Navbar from "../componets/Navbar";
import axios from "../axiosConfig";

const checkGuestAccess = (navigate) => {
  const role = localStorage.getItem("role");

  if (!role) {
    alert("Please login first");
    navigate("/login");
    return false;
  }

  if (role === "host") {
    alert("Login as guest first to continue");
    navigate("/login");
    return false;
  }

  return true;
};

const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

const createVector = (home) => {
  return [
    home.price / 1000,
    home.averageRating || 0,
    home.houseDetails?.bedrooms || 0,
    home.houseDetails?.bathrooms || 0,
    home.houseDetails?.beds || 0,
    home.houseDetails?.guests || 0,
    home.amenities?.length || 0
  ];
};
/* ⭐ STAR COMPONENT */
const StarRating = ({ rating = 0 }) => {
  return (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i;
        const half = rating >= i - 0.5 && rating < i;

        return (
          <div key={i} className="star-wrapper">
            <FaStar
              className={`star ${filled ? "full" : ""} ${half ? "half" : ""}`}
            />
          </div>
        );
      })}
    </div>
  );
};

const Home = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/store/homes");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.homes || [];
        setHomes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomes();
  }, []);

  const filteredHomes = homes
  .filter((h) =>
    h.housename?.toLowerCase().includes(search.toLowerCase()) ||
    h.address?.city?.toLowerCase().includes(search.toLowerCase())
  )
  .map((home, index) => ({ ...home, originalIndex: index })) // ⭐ preserve order
  .sort((a, b) => {

    // ⭐ FIRST PRIORITY: Rating
    if ((b.averageRating || 0) !== (a.averageRating || 0)) {
      return (b.averageRating || 0) - (a.averageRating || 0);
    }

    // ⭐ SECOND PRIORITY: Reviews
    if ((b.totalReviews || 0) !== (a.totalReviews || 0)) {
      return (b.totalReviews || 0) - (a.totalReviews || 0);
    }

    // ⭐ THIRD PRIORITY: ML similarity
    const reference = homes[0];

    const refVec = createVector(reference);
    const vecA = createVector(a);
    const vecB = createVector(b);

    const simA = cosineSimilarity(refVec, vecA);
    const simB = cosineSimilarity(refVec, vecB);

    if (simB !== simA) return simB - simA;

    // ⭐ LAST: original order maintain
    return a.originalIndex - b.originalIndex;
  });

  return (
    <div>
        
    <div className="home-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">Homestay-Haven</div>
        
       <Navbar />
      </nav>

      {/* LIST */}
     
      <div className="home-container">
        <h2 className="home-heading">Our Homes  🏡</h2>
         {/* <SearchBar onSearch={setSearch} /> */}
         <div className="search-wrapper2">
  <input
    className="search-bar2"
    placeholder="🔍 Search homestay by  places, city..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card-scroll">
            {filteredHomes.map((home) => (
              <HomeCard key={home._id} home={home} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Home;


const HomeCard = ({ home, navigate }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [fav, setFav] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  // 🔥 AUTO SLIDER
  useEffect(() => {
    if (!home.photos?.length) return;

    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % home.photos.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [home.photos]);

 const toggleFav = async (e) => {
  e.stopPropagation();

  if (!checkGuestAccess(navigate)) return;

  try {
    await axios.post(
      "http://localhost:5000/store/favourite",
      { homeid: home._id },
      { withCredentials: true }
    );

    setFav(!fav);
  } catch (err) {
    console.log(err);
    alert("Error adding favourite");
  }
};

  return (
    <div
      className="home-card premium"
      onClick={() => navigate(`/details/${home._id}`)}
    >

      {/* ❤️ FAVORITE */}
      <div className="fav-icon" onClick={toggleFav}>
        {fav ? "❤️" : "🤍"}
      </div>

      {/* IMAGE */}
      <div className="card-img">
        <img
          src={`http://localhost:5000/${home.photos?.[imgIndex]}`}
          alt={home.housename}
        />
      </div>

      {/* INFO */}
      <div className="home-info">
        <h3>{home.housename}</h3>

        <p className="location">
          📍 {home.address?.city}, {home.address?.state}
        </p>

        <p className="price">₹{home.price} / night</p>

        <div className="rating-box">
          
          <div>
          <StarRating rating={Number(home.averageRating) || 0} />
          </div>
          <div>
          <span className="rating-number">
            {home.averageRating || 0} ⭐ (
              Review:{home.totalReviews || 0})
          </span>
          </div>
        </div>

        <div className="btn-group">

  <button
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/details/${home._id}`);
    }}
  >
    Details
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();

      if (!checkGuestAccess(navigate)) return;

      navigate(`/booking/${home._id}`);
    }}
  >
    Book
  </button>

</div>
      </div>
    </div>
  );
};