import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../componets/Navbar";
import "./EventDetalis.css";
import axios from "../axiosConfig";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
const BASE = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const nextImg = () => {
    setCurrentImg(prev =>
      prev === event.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImg = () => {
    setCurrentImg(prev =>
      prev === 0 ? event.images.length - 1 : prev - 1
    );
  };

  if (loading) return <h2 className="loading">Loading...</h2>;
  if (!event) return <h2>No Event Found</h2>;

  return (
    <>
      <Navbar />

      <div className="details-page">
        <div className="outer-card">

          <h1 className="page-heading">{event.title}</h1>

          {/* IMAGE */}
          <div className="photo-card">
            <img
              src={`${BASE}/${event.images[currentImg]}`}
              className="main-img"
            />

            {event.images.length > 1 && (
              <>
                <button className="prev" onClick={prevImg}>‹</button>
                <button className="next" onClick={nextImg}>›</button>
              </>
            )}
          </div>

          {/* DETAILS */}
          <div className="details-card">

            <div className="info-block">
              <span className="label">Location:</span>
              <span className="value">
                {event.location?.city}, {event.location?.place}
              </span>
            </div>

            <div className="info-block">
              <span className="label">Type:</span>
              <span className="value">{event.type}</span>
            </div>

            {event.type === "event" ? (
              <div className="info-block">
                <span className="label">Dates:</span>
                <span className="value">
                  {event.startDate} → {event.endDate}
                </span>
              </div>
            ) : (
              <div className="info-block">
                <span className="label">Duration:</span>
                <span className="value">{event.duration}</span>
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="section">
              <h3>Description</h3>
              <p>{event.description}</p>
            </div>

            {/* HIGHLIGHTS */}
            {event.highlights && (
              <div className="section">
                <h3>✨ Highlights</h3>
                <ul>
                  {event.highlights.split(",").map((h,i)=>(
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* THINGS TO DO */}
            {event.thingsToDo && (
              <div className="section">
                <h3>🎯 Things To Do</h3>
                <ul>
                  {event.thingsToDo.split(",").map((t,i)=>(
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}