import { useEffect, useState } from "react";
import Navbar from "../componets/Navbar";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import axios from "../axiosConfig";

export default function EditProfile() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/auth/profile/${userId}`
    );
    setForm(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    const data = new FormData();

    data.append("first_name", form.first_name);
    data.append("last_name", form.last_name);
    data.append("email", form.email);
    data.append("gender", form.gender);

    if (image) data.append("profilePic", image);

    await axios.put(
      `http://localhost:5000/api/auth/update-profile/${userId}`,
      data
    );

    alert("Profile updated");
    navigate("/profile");
  };

  return (
    <>
      <Navbar />

      <div className="edit-page">
        <div className="edit-card">

          <h2>Edit Profile</h2>

          <label>First Name</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="Enter your first name"
          />

          <label>Last Name</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Enter your last name"
          />

          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <label>Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <label>Upload Profile Picture</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button onClick={saveProfile}>Save Changes</button>

        </div>
      </div>
    </>
  );
}