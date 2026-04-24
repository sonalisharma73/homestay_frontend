import React, { useEffect, useState, useRef } from "react";
import Navbar from "../componets/Navbar";
import "./indexpage.css";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
/* ================= ML ================= */
const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (magA * magB || 1);
};

const createVector = (h) => [
  h.price / 1000,
  h.averageRating || 0,
  h.houseDetails?.bedrooms || 0,
  h.houseDetails?.guests || 0,
  h.amenities?.length || 0
];

/* ================= HERO ================= */
const heroImages = [
  // 🏡 homestays
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c",

  // 🎉 events / places
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
];

const Hero = () => {
  const [index, setIndex] = useState(0);
const BASE = import.meta.env.VITE_API_URL || "";


  // 🔥 auto change
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const next = () => {
    setIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? heroImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="hero">

      {/* images */}
      {heroImages.map((img, i) => (
        <img
          key={i}
          src={img}
          className={`hero-img ${i === index ? "active" : ""}`}
        />
      ))}

      {/* arrows */}
      <button className="hero-arrow left" onClick={prev}>‹</button>
      <button className="hero-arrow right" onClick={next}>›</button>

      {/* overlay */}
      <div className="hero-overlay">
        <h1>Explore Stays & Experiences</h1>
        <div className="hero-links">
          <Link to="/homes" className="hero-chip">🏡 Homes</Link>
          <Link to="/events" className="hero-chip">🎉 Events</Link>
          <Link to="/places" className="hero-chip">📍 Places</Link>
        </div>
      </div>
    </div>
  );
};

/* ================= STAR ================= */
const StarRating = ({ rating = 0 }) => (
  <div className="star-row">
    {[1,2,3,4,5].map(i => (
      <FaStar key={i} className={`star ${rating >= i ? "full" : ""}`} />
    ))}
  </div>
);

/* ================= CARD ================= */
const Card = ({ item, type, navigate }) => {
  const [fav, setFav] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  /* 🔥 GET IMAGES */
  const images =
    type === "home"
      ? item.photos || []
      : item.images || [];

  /* 🔥 AUTO IMAGE CHANGE */
  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div
      className="event-card"
      onClick={() =>
        navigate(
          type === "home"
            ? `/details/${item._id}`
            : `/event/${item._id}`
        )
      }
    >
      {/* ❤️ FAVORITE */}
     {type === "home" && (
  <div
    className="fav-icon"
    onClick={(e) => {
      e.stopPropagation();
      setFav(!fav);
    }}
  >
    {fav ? "❤️" : "🤍"}
  </div>
)}

      {/* 🔥 IMAGE SLIDER */}
      <div className="slider">
  {images.length > 0 && (
    <img
 src={`${BASE}/${images[imgIndex]}`}
  className="slider-img"
/>
  )}
</div>

      <div className="event-content">
        <h3>{type === "home" ? item.housename : item.title}</h3>

        <p className="location">
          📍 {item.address?.city || item.location?.city},{" "}
          {item.address?.state || item.location?.place}
        </p>

        {/* 🔥 KEEP YOUR ORIGINAL UI */}
        {type === "home" ? (
          <>
            <p className="info">₹{item.price} / night</p>
            <StarRating rating={item.averageRating} />
          </>
        ) : item.type === "event" ? (
          <p className="info">📅 {item.startDate}</p>
        ) : (
          <p className="info">⏳ {item.duration}</p>
        )}

        {/* 🔥 BUTTONS (UNCHANGED) */}
        <div className="btn-group">
         
  <button
    onClick={(e) => {
      e.stopPropagation();
      navigate(
        type === "home"
          ? `/details/${item._id}`
          : `/event/${item._id}`
      );
    }}
  >
    {type === "home" ? "Details" : "Explore →"}
  </button>


          {type === "home" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/booking/${item._id}`);
              }}
            >
              Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
/* ================= SECTION ================= */


const Section = ({ title, children ,loop = true}) => {
  const ref = useRef();
  const isPaused = useRef(false);
  const isClicking = useRef(false); // 🔥 NEW

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let animation;

    const step = () => {
      if (!isPaused.current && !isClicking.current) {
        el.scrollLeft += 0.5; // smooth speed

        const half = el.scrollWidth / 2;

        if (el.scrollLeft >= half) {
          el.scrollLeft -= half; // seamless loop
        }
      }

      animation = requestAnimationFrame(step);
    };

    animation = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animation);
  }, []);

  /* 🔥 hover pause */
  const pause = () => (isPaused.current = true);
  const resume = () => (isPaused.current = false);

  /* 🔥 button scroll */
  const scroll = (dir) => {
    const el = ref.current;

    isClicking.current = true;
    isPaused.current = true;

    const amount = el.offsetWidth * 0.7;

    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });

    setTimeout(() => {
      isClicking.current = false;
      isPaused.current = false;
    }, 600);
  };

  return (
    <div className="section">
      <h2 className="section-title">{title}</h2>

      <div
        className="scroll-container"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <button className="aarrow left" onClick={() => scroll("left")}>‹</button>

        <div className="scroll-track" ref={ref}>
          {children}
          {loop && children}  {/* required for seamless loop */}
        </div>

        <button className="aarrow right" onClick={() => scroll("right")}>›</button>
      </div>
    </div>
  );
};



const Footer = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  /* 🔥 MAIN HANDLER */
  const handleClick = (path, requiredRole = null, type = "") => {
    
    // ❌ Not logged in
    if (!role) {
      alert(`Please login first`);
      navigate("/login");
      return;
    }

    // ❌ Wrong role
    if (requiredRole && role !== requiredRole) {
      alert(`Please login as ${requiredRole}`);
      navigate("/login");
      return;
    }

    // ✅ Special case: Help section
    if (type === "help") {
      if (role === "host") navigate("/host-help");
      else navigate("/help/guest");
      return;
    }

    // ✅ Normal navigation
    navigate(path);
  };

  return (
    <footer className="footer">

      {/* TOP */}
      <div
        className="footer-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ⬆ Back to top
      </div>

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-col brand">
          <h2>Homestay-Haven</h2>
          <p>
            Discover cozy homes, events and hidden gems — all in one place.
          </p>
        </div>

        {/* EXPLORE */}
        <div className="footer-col">
          <h3>Explore</h3>

          <Link to="/homes">🏡 Homes</Link>
          <Link to="/event/eventlist">🎉 Events</Link>
          <Link to="/">📍 Places</Link>

          <p onClick={() => handleClick("/my-bookings", "guest")}>
            📅 Bookings
          </p>
        </div>

        {/* HOST (ALL CLICKABLE) */}
        <div className="footer-col">
          <h3>Host</h3>

          <p onClick={() => handleClick("/addHome", "host")}>
            ➕ Add Home
          </p>

          <p onClick={() => handleClick("/homelist", "host")}>
            🏠 My Homes
          </p>

          <p onClick={() => handleClick("/host-dashboard", "host")}>
            📊 Dashboard
          </p>

          {/* 🔥 NEW: ADD EVENT */}
          <p onClick={() => handleClick("/add-event", "host")}>
            🎉 Add Event
          </p>
        </div>

        {/* SUPPORT */}
        <div className="footer-col">
          <h3>Support</h3>

          {/* 🔥 AUTO ROLE BASED HELP */}
          <p onClick={() => handleClick(null, null, "help")}>
            Help Center
          </p>

          <p onClick={() => handleClick("/contact")}>
            Contact Us
          </p>

          <p>Privacy Policy</p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Homestay-Haven • Designed for comfort ✨
      </div>

    </footer>
  );
};





export default function Home() {
  const [homes, setHomes] = useState([]);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/store/homes").then(res => setHomes(res.data || []));
    axios.get("/events/events").then(res => setEvents(res.data || []));
  }, []);


  


  /* 🔥 TRENDING (rating + reviews + similarity) */
  const trendingHomes = [...homes].sort((a, b) => {
    if ((b.averageRating || 0) !== (a.averageRating || 0)) {
      return (b.averageRating || 0) - (a.averageRating || 0);
    }
    if ((b.totalReviews || 0) !== (a.totalReviews || 0)) {
      return (b.totalReviews || 0) - (a.totalReviews || 0);
    }

    const ref = homes[0] || {};
    return (
      cosineSimilarity(createVector(ref), createVector(b)) -
      cosineSimilarity(createVector(ref), createVector(a))
    );
  });

  

  /* 🔥 RECOMMENDED (similar to top homes) */
  const reference = trendingHomes[0];
  const recommendedHomes = homes
    .map(h => ({
      ...h,
      score: cosineSimilarity(createVector(reference || {}), createVector(h))
    }))
    .sort((a, b) => b.score - a.score);
    
    const filteredHomes = homes.filter(h =>
  (h.housename || "").toLowerCase().includes(search.toLowerCase()) ||
  (h.address?.city || "").toLowerCase().includes(search.toLowerCase())
);

const filteredEvents = events.filter(e =>
  (e.title || "").toLowerCase().includes(search.toLowerCase()) ||
  (e.location?.city || "").toLowerCase().includes(search.toLowerCase())
);

  const eventList = events.filter(e => e.type === "event");
  const placeList = events.filter(e => e.type === "place");
  const searchResults = [
  ...filteredHomes.map(h => ({ ...h, type: "home" })),
  ...filteredEvents.map(e => ({ ...e, type: e.type })) // event or place
];

  return (
    <div className="home-page">

      <nav className="navbar">
        <div className="logo">Homestay-Haven</div>
        <Navbar />
      </nav>
                  <div className="floating-search">
  <span className="search-icon">🔍</span>
  <input
    type="text"
    placeholder="Search stays, events..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
      <Hero />
   
{search && (
  <Section title="🔍 Search Results" loop={false}>
    {searchResults.length > 0 ? (
      searchResults.map(item => (
        <Card
          key={item._id}
          item={item}
          type={item.type}
          navigate={navigate}
        />
      ))
    ) : (
      <p style={{ padding: "10px" }}>No results found</p>
    )}
  </Section>
)}

      <Section title="🏡 Trending Homestays">
        {trendingHomes.slice(0, 10).map(h => (
          <Card key={h._id} item={h} type="home" navigate={navigate} />
        ))}
      </Section>
     

      <Section title="✨ Recommended For You">
        {recommendedHomes.slice(0, 10).map(h => (
          <Card key={h._id} item={h} type="home" navigate={navigate} />
        ))}
      </Section>

      <Section title="🎉 Events">
        {eventList.slice(0, 10).map(e => (
          <Card key={e._id} item={e} type="event" navigate={navigate} />
        ))}
      </Section>

      <Section title="📍 Tourist Places">
        {placeList.slice(0, 10).map(p => (
          <Card key={p._id} item={p} type="place" navigate={navigate} />
        ))}
      </Section>
       <Footer classname="footer" />

    </div>
  );
}