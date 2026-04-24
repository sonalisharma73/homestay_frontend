
import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import "./HostEvents.css";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const HostEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/host/my-events");

      const data = res.data;

      if (Array.isArray(data)) {
        setEvents(data);
      } else if (Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.log("Fetch error:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await axios.delete(`/host/eventdelete/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="host-page2">
      <h2>My Events</h2>

      <div className="host-grid2">
        {Array.isArray(events) &&
          events.map((e) => {
            const imageUrl =
              e?.images?.length
                ? `${BASE_URL}/${e.images[0]}`
                : "https://via.placeholder.com/400";

            return (
              <div
                className="host-card"
                key={e._id}
                onClick={() => navigate(`/event/${e._id}`)}
              >
                {/* IMAGE */}
                <div className="card-img">
                  <img src={imageUrl} alt={e.title || "event"} />
                  <span className="badge">
                    {e.type === "event" ? "Event" : "Place"}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="card-body">
                  <h3>{e.title || "No Title"}</h3>

                  <p className="location">
                    📍 {e.location?.city || "Unknown"}
                  </p>

                  {/* 🔥 DYNAMIC LABELS */}
                  <p className="date">
                    {e.type === "event" ? (
                      <>
                        <span className="label">📅 Date:</span>{" "}
                        {e.startDate && e.endDate
                          ? `${new Date(e.startDate).toLocaleDateString()} - ${new Date(e.endDate).toLocaleDateString()}`
                          : "No dates available"}
                      </>
                    ) : (
                      <>
                        <span className="label">⏱ Duration:</span>{" "}
                        {e.duration || "No duration available"}
                      </>
                    )}
                  </p>

                  {/* OPTIONAL TIME */}
                  {e.type === "event" && (
                    <p className="time">
                      ⏰ {e.startTime || "Start time"} -{" "}
                      {e.endTime || "End time"}
                    </p>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="card-actions">
                  <button
                    className="edit-btn"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      navigate(`/edit-event/${e._id}`);
                    }}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      deleteEvent(e._id);
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {events.length === 0 && (
        <p className="empty-msg">No events found</p>
      )}
    </div>
  );
};

export default HostEvents;