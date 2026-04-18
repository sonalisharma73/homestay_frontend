

import React, { useEffect, useState } from "react";
// import axios from "axios";
import Navbar from "../componets/Navbar";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "./HomeList.css";
import axios from "../axiosConfig";


export default function HomeList() {
  const [registeredHomes, setRegisteredHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviews, setSelectedReviews] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchHomes = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/host/host-home-list",
        { withCredentials: true }
      );

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.homes || [];

      setRegisteredHomes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchHomes();
}, []);


  const handleDelete = async (id) => {
    try {
      await axios.post(`http://localhost:5000/host/delete-home/${id}`);
      setRegisteredHomes((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const StarRating = ({ rating = 0 }) => (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          className={`star ${rating >= i ? "full" : ""}`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="home-list-wrapper loading-screen">
        <Navbar />
        <div className="loading-text">Loading homes...</div>
      </div>
    );
  }

  return (
  <div className="home-list-wrapper">
    <Navbar />

    <main className="home-list-container">
      <h2 className="home-list-title">Here are your Host homes list:</h2>

      <div className="home-cards-container">

        {/* 🔴 IF NO HOME */}
        {registeredHomes.length === 0 ? (
          <div className="no-home-box">
            <h3>No homestay listed yet 🏠</h3>
            <p>Start hosting and add your first home</p>

            <button
              className="add-first-home-btn"
              onClick={() => navigate("/addHome")}
            >
              Add Your First Home
            </button>
          </div>
        ) : (

          registeredHomes.map((home) => (
            <div
              key={home._id}
              className="home-card"
              onClick={() => navigate(`/details/${home._id}`)}
            >
              {/* IMAGE SLIDER */}
              <div className="image-slider">
                <button
                  className="slide-btn left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRegisteredHomes((prev) =>
                      prev.map((h) =>
                        h._id === home._id
                          ? {
                              ...h,
                              imgIndex:
                                (h.imgIndex || 0) === 0
                                  ? (h.photos?.length || 1) - 1
                                  : (h.imgIndex || 0) - 1,
                            }
                          : h
                      )
                    );
                  }}
                >
                  ‹
                </button>

                <img
                  src={`http://localhost:5000/${
                    home.photos?.[home.imgIndex || 0] || home.photo
                  }`}
                  className="home-image"
                />

                <button
                  className="slide-btn right"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRegisteredHomes((prev) =>
                      prev.map((h) =>
                        h._id === home._id
                          ? {
                              ...h,
                              imgIndex:
                                ((h.imgIndex || 0) + 1) %
                                (h.photos?.length || 1),
                            }
                          : h
                      )
                    );
                  }}
                >
                  ›
                </button>
              </div>

              {/* BODY */}
              <div className="home-card-body">
                <h3>{home.housename}</h3>
                <p>{home.location}</p>

                <div className="home-price">
                  ₹{home.price} / night
                </div>

                {/* ⭐ RATING */}
                <div className="rating-row">
                  <StarRating rating={home.averageRating || 0} />
                  <span className="review-count">
                    ({home.totalReviews || 0})
                  </span>
                </div>

                {/* VIEW REVIEWS */}
                <button
                  className="review-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReviews(home.reviews || []);
                  }}
                >
                  View Reviews
                </button>

                {/* BUTTONS */}
                <div className="home-buttons">
                  <button
                    className="btn-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/host/addHome/${home._id}?editing=true`);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(home._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

      </div>
    </main>

    {/* 🔥 REVIEW POPUP */}
    {selectedReviews && (
      <div className="review-popup">
        <div className="review-box">
          <h3>All Reviews</h3>

          {selectedReviews.length === 0 && <p>No reviews yet</p>}

          {selectedReviews.map((r, i) => (
            <div key={i} className="single-review">
              <b>{r.userName}</b>
              <p>{r.comment}</p>
              <StarRating rating={r.rating} />
            </div>
          ))}

          <button
            className="close-btn"
            onClick={() => setSelectedReviews(null)}
          >
            Close
          </button>
        </div>
      </div>
    )}
  </div>
);

}
