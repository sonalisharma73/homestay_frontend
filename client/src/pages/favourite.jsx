
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Favourite.css";
import Navbar from "../componets/Navbar";
import axios from "../axiosConfig";

/* ================= CARD ================= */
const FavCard = ({ home, removeFav, navigate }) => {
  const [index, setIndex] = useState(0);
const BASE = import.meta.env.VITE_API_URL || "";
  const next = (e) => {
    e.stopPropagation();
    if (!home.photos?.length) return;
    setIndex((prev) => (prev + 1) % home.photos.length);
  };

  const prev = (e) => {
    e.stopPropagation();
    if (!home.photos?.length) return;
    setIndex((prev) =>
      prev === 0 ? home.photos.length - 1 : prev - 1
    );
  };

  /* ✅ AUTO SLIDE */
  useEffect(() => {
    if (!home?.photos?.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % home.photos.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [home]);

  return (
    <>
      <Navbar />
      <div>
        <div className="fav-card">

          {/* 🔥 PERFECT SLIDER */}
          <div className="image-card">

            <div
              className="slider-track"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {home.photos?.map((img, i) => (
                <img
                  key={i}
                  src={`${BASE}/${img}`}
                  className="slide-img"
                  onClick={() => navigate(`/details/${home._id}`)}
                />
              ))}
            </div>

            {/* ❤️ HEART */}
            <button
              className="remove-cross"
              onClick={(e) => {
                e.stopPropagation();
                removeFav(home._id);
              }}
            >
              ❤
            </button>

            {/* ⭐ RATING */}
            <div className="rating-badge">
              {home.averageRating > 0
                ? `⭐ ${home.averageRating}`
                : "No rating"}
            </div>

            {/* 📍 LOCATION */}
            <div className="location-badge">
              📍 {home.address?.city}
            </div>

            {/* 💰 PRICE */}
            <div className="price-badge">
              ₹{home.price}
            </div>

            {/* ARROWS */}
            {/* {home.photos?.length > 1 && (
              <>
                <button className="slide-btn left" onClick={prev}>‹</button>
                <button className="slide-btn right" onClick={next}>›</button>
              </>
            )} */}

            {/* DOTS */}
            <div className="dots">
              {home.photos?.map((_, i) => (
                <span
                  key={i}
                  className={i === index ? "dot active" : "dot"}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>

          </div>

          {/* RIGHT DETAILS */}
          <div className="details-card">
            <label className="fav-label">Homestay Name :</label>
            <h3 className="title">{home.housename}</h3>

              <label className="fav-label">Location :</label>
            <p className="location">
              {home.address?.city}, {home.address?.state}
            </p>
            
            <label className="fav-label">Price :</label>
            <p className="price">₹{home.price} / night</p>

            <div className="fav-btns">
              <button
                className="view-btn"
                onClick={() => navigate(`/details/${home._id}`)}
              >
                View
              </button>

              <button
                className="book-btn"
                onClick={() => navigate(`/booking/${home._id}`)}
              >
                Book
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

/* ================= PAGE ================= */
export default function Favourite() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFav();
  }, []);

  const fetchFav = async () => {
    try {
      const res = await axios.get(
        `store/favourite`,
        { withCredentials: true }
      );

      setHomes(res.data || []);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const removeFav = async (id) => {
    await axios.post(
      `store/favourite/delete/${id}`,
      {},
      { withCredentials: true }
    );

    setHomes((prev) => prev.filter((h) => h._id !== id));
  };

  if (loading) return <h2 className="fav-loading">Loading...</h2>;

  return (
    <div className="fav-page">
      <h2 className="fav-heading">Your Favourite Homes</h2>

      {homes.length === 0 && (
        <p className="empty">No favourites yet</p>
      )}

      <div className="fav-list">
        {homes.map((home) => (
          <FavCard
            key={home._id}
            home={home}
            removeFav={removeFav}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  );
}