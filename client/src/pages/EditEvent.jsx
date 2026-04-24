import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./EditEvent.css";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    type: "event",
    city: "",
    startDate: "",
    endDate: "",
    duration: "",
    startTime: "",
    endTime: "",
  });

  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`/events/${id}`);
      const data = res.data;

      setForm({
        title: data.title || "",
        type: data.type || "event",
        city: data.location?.city || "",
        startDate: data.startDate?.split("T")[0] || "",
        endDate: data.endDate?.split("T")[0] || "",
        duration: data.duration || "",
        startTime: data.startTime || "",
        endTime: data.endTime || "",
      });

      setOldImages(data.images || []);
    } catch {
      toast.error("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const removeOldImage = (index) => {
    setOldImages(oldImages.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    setNewImages([...newImages, ...e.target.files]);
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append("oldImages", JSON.stringify(oldImages));

      newImages.forEach((img) => {
        formData.append("images", img);
      });

      await axios.put(
        `/host/update-event/${id}`,
        formData,
        { withCredentials: true }
      );

      toast.success("Updated successfully 🚀");
      navigate("/my-events");

    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="edit-container">
      <div className="edit-card">

        <h2>Edit Event / Place</h2>

        <form onSubmit={handleSubmit} className="edit-layout">

          {/* LEFT SIDE FORM */}
          <div className="form-section">

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
            />

            <select name="type" value={form.type} onChange={handleChange}>
              <option value="event">Event</option>
              <option value="place">Place</option>
            </select>

            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />

            {/* 🔥 LABEL BASED INPUTS */}
            {form.type === "event" ? (
              <>
                <label>📅 Start Date</label>
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />

                <label>📅 End Date</label>
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />

                <label>⏰ Start Time</label>
                <input type="time" name="startTime" value={form.startTime} onChange={handleChange} />

                <label>⏰ End Time</label>
                <input type="time" name="endTime" value={form.endTime} onChange={handleChange} />
              </>
            ) : (
              <>
                <label>⏱ Duration</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="e.g. 3 days"
                  value={form.duration}
                  onChange={handleChange}
                />
              </>
            )}

            <button className="update-btn">Update</button>

          </div>

          {/* RIGHT SIDE IMAGES */}
          <div className="image-section">

            <h4>Existing Images</h4>

            <div className="image-grid">
              {oldImages.map((img, i) => (
                <div key={i} className="img-box">

                  <img
                    src={
                      img.startsWith("uploads")
                        ? `${BASE_URL}/${img}`
                        : `${BASE_URL}/uploads/${img}`
                    }
                    alt=""
                  />

                  <button onClick={() => removeOldImage(i)}>✖</button>
                </div>
              ))}
            </div>

            <h4>Add Images</h4>
            <input type="file" multiple onChange={handleImageChange} />

            <div className="image-grid">
              {newImages.map((img, i) => (
                <div key={i} className="img-box">
                  <img src={URL.createObjectURL(img)} alt="" />
                  <button onClick={() => removeNewImage(i)}>✖</button>
                </div>
              ))}
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditEvent;