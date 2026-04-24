import React, { useState } from "react";
import axios from "../axiosConfig";
import Navbar from "../componets/Navbar";
import "./AddEvent.css";

const AddEvent = () => {

  const [type, setType] = useState("");
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    place: "",
    startDate: "",
    endDate: "",
    duration: "",
    thingsToDo: "",
    highlights: ""
  });

  // 🔥 IMAGE HANDLE
  const handleImages = (files) => {
    const fileArray = Array.from(files);

    if (fileArray.length + images.length > 5) {
      alert("Max 5 images allowed");
      return;
    }

    setImages([...images, ...fileArray]);
  };

  // 🔥 REMOVE IMAGE
  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (type === "event" && form.startDate && form.endDate) {
      if (new Date(form.startDate) > new Date(form.endDate)) {
        alert("Start date must be before End date");
        return;
      }
    }

    const data = new FormData();

    Object.keys(form).forEach(key => {
      if (form[key]) data.append(key, form[key]);
    });

    data.append("type", type);

    images.forEach(img => data.append("images", img));

    try {
      await axios.post("/events/add-event", data, {
        withCredentials: true
      });

      alert("Added Successfully");
      setImages([]);
      setType("");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
     <div className="add-event-page">
  <div className="page-container">
      <div className="page-container">

        {/* SELECT TYPE */}
        {!type && (
          <div className="lux-card fade-in">
            <h2 className="heading">What do you want to add?</h2>

            <div className="selection-buttons">
              <button className="btn-primary" onClick={() => setType("event")}>
                Event
              </button>
              <button className="btn-soft" onClick={() => setType("place")}>
                Tourist Place
              </button>
            </div>
          </div>
        )}

        {/* FORM */}
        {type && (
          <div className="lux-card fade-in">

            <h2 className="heading">Add {type}</h2>

            <form onSubmit={handleSubmit}>

              <input className="form-input" placeholder="Title"
                onChange={e => setForm({...form, title: e.target.value})} />

              <div className="form-row">
                <input className="form-input" placeholder="City"
                  onChange={e => setForm({...form, city: e.target.value})} />

                <input className="form-input" placeholder="Place"
                  onChange={e => setForm({...form, place: e.target.value})} />
              </div>

              {/* DATE */}
              {type === "event" ? (
                <div className="date-row">
                  <input className="form-input" placeholder="Start Date"
                    onChange={e => setForm({...form, startDate: e.target.value})} />

                  <input className="form-input" placeholder="End Date"
                    onChange={e => setForm({...form, endDate: e.target.value})} />
                </div>
              ) : (
                <input className="form-input" placeholder=" opening Timing (eg: 9am - 5pm)"
                  onChange={e => setForm({...form, duration: e.target.value})} />
              )}

              <textarea className="form-input" placeholder="Description"
                onChange={e => setForm({...form, description: e.target.value})} />

              <textarea className="form-input" placeholder="Things to Do"
                onChange={e => setForm({...form, thingsToDo: e.target.value})} />

              <textarea className="form-input" placeholder="Highlights"
                onChange={e => setForm({...form, highlights: e.target.value})} />

              {/* 🔥 DRAG DROP */}
              <div
                className="upload-box"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleImages(e.dataTransfer.files);
                }}
              >
                Drag & Drop Images or Click
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImages(e.target.files)}
                />
              </div>

              {/* 🔥 IMAGE PREVIEW */}
              <div className="preview-grid">
                {images.map((img, i) => (
                  <div key={i} className="preview-card">
                    <img src={URL.createObjectURL(img)} alt="" />
                    <button onClick={() => removeImage(i)}>×</button>
                  </div>
                ))}
              </div>

              <button className="btn-primary">Add {type}</button>

              <button
                type="button"
                className="btn-soft"
                onClick={() => setType("")}
              >
                ← Back
              </button>

            </form>
          </div>
        )}
      </div>
      </div>
      </div>
    </>
 );
};

export default AddEvent;








