import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import "./EventList.css";
import Navbar from "../componets/Navbar";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 image index per event
  const [indexMap, setIndexMap] = useState({});

  const navigate = useNavigate();

  // 🔥 FETCH EVENTS
  useEffect(() => {
    axios.get("/events/events")
      .then(res => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.events || [];

        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 🔥 LOAD FAVORITES
  useEffect(() => {
    const fav = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(fav);
  }, []);

  // 🔥 AUTO IMAGE SLIDER
  useEffect(() => {
    if (!events.length) return;

    const interval = setInterval(() => {
      setIndexMap(prev => {
        const updated = { ...prev };

        events.forEach(e => {
          if (e.images?.length > 0) {
            updated[e._id] =
              ((prev[e._id] || 0) + 1) % e.images.length;
          }
        });

        return updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [events]);

  // 🔥 FILTER
  const normalize = (str) =>
  (str || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const keyword = normalize(search);

const filtered = events.filter(e => {
  if (!keyword) {
    return type === "all" || e.type === type;
  }

  const title = normalize(e.title);
  const city = normalize(e.location?.city);
  const place = normalize(e.location?.place);
  const typeVal = normalize(e.type);
const BASE = import.meta.env.VITE_API_URL || "";
  const matchSearch =
    title.includes(keyword) ||
    city.includes(keyword) ||
    place.includes(keyword) ||
    typeVal.includes(keyword);

  const matchType = type === "all" || e.type === type;

  return matchSearch && matchType;
});

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="event-page">
        <h2 className="event-title">Discover Experiences ✨</h2>

        {/* SEARCH */}
       <div className="search-wrapper2">
          <input
            className="search-bar2"
            placeholder="🔍 Search events, places, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTER */}
        <div className="chip-bar">
          <span
            className={type === "all" ? "chip active" : "chip"}
            onClick={() => setType("all")}
          >All</span>

          <span
            className={type === "event" ? "chip active" : "chip"}
            onClick={() => setType("event")}
          >🎉 Events</span>

          <span
            className={type === "place" ? "chip active" : "chip"}
            onClick={() => setType("place")}
          >📍 Places</span>
        </div>

        {/* LIST */}
        {filtered.length === 0 ? (
          <p className="empty-msg">No events found</p>
        ) : (
          <div className="event-grid">
            {filtered.map(e => {
              const currentIndex = indexMap[e._id] || 0;

              const imageUrl =
                e.images && e.images.length > 0
                  ? `${BASE}/${e.images[currentIndex]}`
                  : "https://via.placeholder.com/300";

              return (
                <div className="event-card" key={e._id}>
                  
                  {/* AUTO SLIDER */}
                  <div className="slider">
                    <img src={imageUrl} alt={e.title} />
                  </div>

                  <div className="event-content">
                    <h3>{e.title}</h3>

                    <p className="location">
                      📍 {e.location?.city}, {e.location?.place}
                    </p>

                    {e.type === "event" ? (
                      <p className="info">
                        📅 {e.startDate} → {e.endDate}
                      </p>
                    ) : (
                      <p className="info">
                        ⏳ {e.duration}
                      </p>
                    )}

                    <button
                      className="explore-btn"
                      onClick={() => navigate(`/event/${e._id}`)}
                    >
                      Explore →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default EventList;