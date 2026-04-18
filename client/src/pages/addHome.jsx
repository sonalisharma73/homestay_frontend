
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
import "./addHome.css";
import Navbar from "../componets/Navbar";
import axios from "../axiosConfig";


export default function AddHome() {
  const navigate = useNavigate();
  const { homeId } = useParams();
  const locationRouter = useLocation();
const [errors, setErrors] = useState({});
const [serverError, setServerError] = useState("");
const [existingPhotos, setExistingPhotos] = useState([]);
const [successMsg, setSuccessMsg] = useState("");

  const editing =
    new URLSearchParams(locationRouter.search).get("editing") === "true";

  const BACKEND_URL = "http://localhost:5000";

  const [formData, setFormData] = useState({
    housename: "",
    price: "",
    discount: "",
    placeType: "",
    propertyType: "",

    houseNo: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",

    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    idProofType: "",
    idProofNumber: "",
    idProofImage: null,

    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    guests: 1,

    amenities: [],
    description: "",
    photos: [],
  });

  const [success, setSuccess] = useState(false);


  useEffect(() => {
  axios.get("http://localhost:5000/api/auth/check-auth", {
    withCredentials: true
  })
  .then(res => {
    if (!res.data.loggedIn) {
      localStorage.clear();   // 🔥 IMPORTANT
    }
  });
}, []);
  /* ================= FETCH EDIT DATA ================= */
  useEffect(() => {
  if (!editing || !homeId) return;

  axios.get(`${BACKEND_URL}/host/edit-home/${homeId}`)
    .then(res => {
      const h = res.data.home;
      console.log("EDIT HOME DATA:", h);

      // 🔥 OLD location split
      let houseNo="", street="", city="", state="";
      if(h.location){
        const parts = h.location.split(",");
        houseNo = parts[0] || "";
        street  = parts[1] || "";
        city    = parts[2] || "";
        state   = parts[3] || "";
      }

      setFormData(prev => ({
        ...prev,

        housename: h.housename || "",
        price: h.price || "",
        discount: h.discount || "",
        description: h.description || "",

        placeType: h.placeType || "",
        propertyType: h.propertyType || "",

        // ADDRESS
        houseNo: h.address?.houseNo || houseNo,
        street: h.address?.street || street,
        area: h.address?.area || "",
        city: h.address?.city || city,
        state: h.address?.state || state,
        pincode: h.address?.pincode || "",

        // OWNER
        ownerName: h.owner?.name || "",
        ownerEmail: h.owner?.email || "",
        ownerPhone: h.owner?.phone || h.contact || "",
        idProofType: h.owner?.idProofType || "",
        idProofNumber: h.owner?.idProofNumber || "",

        // HOUSE DETAILS
        bedrooms: h.houseDetails?.bedrooms || 1,
        bathrooms: h.houseDetails?.bathrooms || 1,
        beds: h.houseDetails?.beds || 1,
        guests: h.houseDetails?.guests || 1,

        amenities: h.amenities || [],
        photos: [],
      }));

      // photos fix
      if(h.photos?.length){
        setExistingPhotos(h.photos);
      }
      else if(h.photo){
        setExistingPhotos([h.photo]);
      }
    });

}, [editing, homeId]);
 

  const validate = () => {
  const newErrors = {};

  if (!formData.placeType) newErrors.placeType = "Select place type";
  if (!formData.propertyType) newErrors.propertyType = "Required";
  if (!formData.housename) newErrors.housename = "Required";
  if (!formData.price) newErrors.price = "Required";

  if (!formData.houseNo) newErrors.houseNo = "Required";
  if (!formData.street) newErrors.street = "Required";
  if (!formData.city) newErrors.city = "Required";
  if (!formData.state) newErrors.state = "Required";
  if (!formData.pincode) newErrors.pincode = "Required";

  if (!formData.ownerName) newErrors.ownerName = "Required";
  if (!formData.ownerEmail) newErrors.ownerEmail = "Required";
  if (!formData.ownerPhone) newErrors.ownerPhone = "Required";

  if (!formData.idProofType) newErrors.idProofType = "Required";
  if (!formData.idProofNumber) newErrors.idProofNumber = "Required";
 if (!editing && !formData.idProofImage) {
  newErrors.idImage = "Upload ID proof image";
}
  if (!formData.guests) newErrors.guests = "Required";
  if (!formData.bedrooms) newErrors.bedrooms = "Required";
  if (!formData.bathrooms) newErrors.bathrooms = "Required";
  if (!formData.beds) newErrors.beds = "Required";
if (!editing && formData.photos.length < 1) {
  newErrors.photos = "Upload at least 1 photo";
}


  if (!formData.description)
    newErrors.description = "Required";

  // email check
  if (formData.ownerEmail &&
      !/^\S+@\S+\.\S+$/.test(formData.ownerEmail)) {
    newErrors.ownerEmail = "Invalid email";
  }

  // phone check
  if (formData.ownerPhone &&
      formData.ownerPhone.length < 10) {
    newErrors.ownerPhone = "Invalid phone";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  /* ================= INPUT CHANGE ================= */
 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((p) => ({ ...p, [name]: value }));

  // 👇 error clear while typing
  setErrors(prev => ({
    ...prev,
    [name]: ""
  }));
};


  /* ================= PHOTOS ================= */
  const handlePhotos = (e) => {
  const files = Array.from(e.target.files);

  const imageFiles = files.filter(file =>
    file.type.startsWith("image/")
  );

  if (imageFiles.length !== files.length) {
    alert("Only image files allowed");
  }

  setFormData((p) => ({
    ...p,
    photos: [...p.photos, ...imageFiles],
  }));
};

const removePhoto = (index) => {
  setFormData(prev => ({
    ...prev,
    photos: prev.photos.filter((_, i) => i !== index)
  }));
};

const removeExistingPhoto = (index) => {
  setExistingPhotos(prev =>
    prev.filter((_, i) => i !== index)
  );
};


  /* ================= ID IMAGE ================= */
  const handleIdImage = (e) => {
    setFormData((p) => ({ ...p, idProofImage: e.target.files[0] }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    const form = new FormData();
       // ⭐ ADD THIS
    if (editing) {
      form.append("id", homeId);
    }
    /* BASIC */
    form.append("housename", formData.housename);
    form.append("price", formData.price);
    form.append("discount", formData.discount);
    form.append("description", formData.description);
    form.append("placeType", formData.placeType);
    form.append("propertyType", formData.propertyType);

    /* ADDRESS */
    form.append("houseNo", formData.houseNo);
    form.append("street", formData.street);
    form.append("area", formData.area);
    form.append("city", formData.city);
    form.append("state", formData.state);
    form.append("pincode", formData.pincode);

    /* OWNER */
    form.append("ownerName", formData.ownerName);
    form.append("ownerEmail", formData.ownerEmail);
    form.append("ownerPhone", formData.ownerPhone);
    form.append("idProofType", formData.idProofType);
    form.append("idProofNumber", formData.idProofNumber);

    /* HOUSE DETAILS */
    form.append("bedrooms", formData.bedrooms);
    form.append("bathrooms", formData.bathrooms);
    form.append("beds", formData.beds);
    form.append("guests", formData.guests);

    /* AMENITIES */
    formData.amenities.forEach(a => form.append("amenities", a));

    /* PHOTOS ⭐ */
    for (let i = 0; i < formData.photos.length; i++) {
      form.append("photos", formData.photos[i]);   // must be "photos"
    }

    /* ID IMAGE ⭐ */
    if (formData.idProofImage) {
      form.append("idProofImage", formData.idProofImage);
    }

   const url = editing
  ? `${BACKEND_URL}/host/edit-home`
  : `${BACKEND_URL}/host/add-home`;

/* ADD THIS HERE */
existingPhotos.forEach(p => form.append("existingPhotos", p));

await axios.post(url, form, {
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,   // 🔥 ADD THIS LINE
});
setSuccessMsg(
  editing
    ? "Home updated successfully 🎉"
    : "Home added successfully 🎉"
);

setTimeout(() => navigate("/"), 2000);

    

  } catch (err) {
    if (err.response?.data?.message) {
      setServerError(err.response.data.message);
    } else {
      setServerError("Error saving home");
    }
  }
};


if (successMsg)
  return (
    <h2 style={{ textAlign: "center", marginTop: "80px", color: "green" }}>
      {successMsg}
    </h2>
  );


  return (
    <>
      <Navbar />
    <div className="page-wrapper">
    

      <main className="container">
        
        <h1 className="page-title"> {editing ? "Edit Your Property" : "Add Your Property"}</h1>

        <form onSubmit={handleSubmit} className="home-form">

          {/* ---------- KEEP YOUR FULL FORM SAME ---------- */}
          {/* 👇 NOTHING CHANGED BELOW 👇 */}
         {serverError && (
  <div className="server-error">
    {serverError}
  </div>
)}

  {/* ================= GUEST ACCESS ================= */}
  <h3 className="section-title">Guest Access</h3>
  <div className="form-grid">
    {["Entire Place", "Private Room", "Shared Room"].map((type) => (
      <label key={type} className="option-box">
        <input
          type="radio"
          name="placeType"
          value={type}
          checked={formData.placeType === type}
          onChange={handleChange}
        />
        {type}
      </label>
    ))}
  </div>
{errors.placeType && <p className="error">{errors.placeType}</p>}
  {/* ================= PROPERTY TYPE ================= */}
  <label className="form-label">Property Type</label>
  <select
    name="propertyType"
    className="form-input"
     value={formData.propertyType}
    onChange={handleChange}
    required
  >
    <option value="">Select property type</option>
    <option>House</option>
    <option>Flat</option>
    <option>Bungalow</option>
    <option>Villa</option>
  </select>

  {/* ================= TITLE ================= */}
  <label className="form-label">Property Title</label>
  <input
    name="housename"
    className="form-input"
    placeholder="Ex: Mountain View Homestay"
    value={formData.housename}
    onChange={handleChange}
    required
  />
{errors.housename && <p className="error">{errors.housename}</p>}
  {/* ================= PRICE ================= */}
  <div className="form-grid">
    <div>
      <label className="form-label">Price per night (₹)</label>
      <input
        name="price"
        className="form-input"
        value={formData.price}
        onChange={handleChange}
        required
      />
      {errors.price && <p className="error">{errors.price}</p>}
    </div>

    <div>
      <label className="form-label">Discount %</label>
      <input
        name="discount"
        className="form-input"
        value={formData.discount}
        onChange={handleChange}
      />
    </div>
  </div>

  {/* ================= ADDRESS ================= */}
  <h3 className="section-title">Address</h3>
  <div className="form-grid">

    <div>
      <label className="form-label">House No</label>
      <input name="houseNo" className="form-input" 
       value={formData.houseNo} onChange={handleChange}/>
    </div>
     
{errors.houseNo && <p className="error">{errors.houseNo}</p>}
    <div>
      <label className="form-label">Street</label>
      <input name="street" className="form-input"
       value={formData.street} onChange={handleChange}/>
    </div>
            
{errors.street && <p className="error">{errors.street}</p>}
    <div>
      <label className="form-label">Area</label>
      <input name="area" className="form-input" value={formData.area} onChange={handleChange}/>
    </div>
     
{errors.area && <p className="error">{errors.area}</p>}
    <div>
      <label className="form-label">City</label>
      <input name="city" className="form-input" value={formData.city} onChange={handleChange}/>
    </div>
    
{errors.city && <p className="error">{errors.city}</p>}
    <div>
      <label className="form-label">State</label>
      <input name="state" className="form-input" value={formData.state} onChange={handleChange}/>
    </div>
       
{errors.state && <p className="error">{errors.state}</p>}
    <div>
      <label className="form-label">Pincode</label>
      <input name="pincode" className="form-input" value={formData.pincode} onChange={handleChange}/>
    </div>
  
{errors.pincode && <p className="error">{errors.pincode}</p>}
  </div>

  {/* ================= OWNER ================= */}
  <h3 className="section-title">Owner Details</h3>
  <div className="form-grid">

    <div>
      <label className="form-label">Owner Name</label>
      <input name="ownerName" className="form-input" value={formData.ownerName}onChange={handleChange}/>
    </div>
        
{errors.ownerName && <p className="error">{errors.ownerName}</p>}
    <div>
      <label className="form-label">Owner Email</label>
      <input name="ownerEmail" className="form-input" value={formData.ownerEmail}onChange={handleChange}/>
    </div>
        
{errors.ownerEmail && <p className="error">{errors.ownerEmail}</p>}
    <div>
      <label className="form-label">Owner Phone</label>
      <input name="ownerPhone" className="form-input" value={formData.ownerPhone} onChange={handleChange}/>
    </div>
          
{errors.ownerPhone && <p className="error">{errors.ownerPhone}</p>}
   <div className="form-grid">

  <div>
    <label className="form-label">ID Proof Type</label>
    <select name="idProofType" className="form-input"  value={formData.idProofType}  onChange={handleChange}>
      <option value="">Select ID Type</option>
      <option value="Aadhar">Aadhar Card</option>
      <option value="PAN">PAN Card</option>
      <option value="Passport">Passport</option>
      <option value="Driving License">Driving License</option>
      <option value="Voter ID">Voter ID</option>
    </select>
  </div>
    
{errors.idProofType && <p className="error">{errors.idProofType}</p>}
  <div>
    <label className="form-label">ID Proof Number</label> 
    <input name="idProofNumber" value={formData.idProofNumber}className="form-input" onChange={handleChange}/>
  </div>
       
{errors.idProofNumber && <p className="error">{errors.idProofNumber}</p>}
</div>


  </div>

  {/* ================= ID IMAGE ================= */}
  <label className="form-label">Upload Owner ID Proof</label>
  <input type="file" onChange={handleIdImage} accept="image/*"  className="form-input"/>
 
{errors.idImage && <p className="error">{errors.idImage}</p>}
  {/* ================= HOUSE DETAILS ================= */}
  <h3 className="section-title">House Details</h3>
  <div className="form-grid">

    <div>
      <label className="form-label">Guests</label>
      <input name="guests" className="form-input" value={formData.guests} onChange={handleChange}/>
    </div>
        

    <div>
      <label className="form-label">Bedrooms</label>
      <input name="bedrooms" className="form-input" value={formData.bedrooms}  onChange={handleChange}/>
    </div>
    
{errors.bedrooms && <p className="error">{errors.bedrooms}</p>}
    <div>
      <label className="form-label">Beds</label>
      <input name="beds" className="form-input" value={formData.beds} onChange={handleChange}/>
    </div>

    <div>
      <label className="form-label">Bathrooms</label>
      <input name="bathrooms" className="form-input" value={formData.bathrooms}  onChange={handleChange}/>
    </div>
    
{errors.bathrooms && <p className="error">{errors.bathrooms}</p>}
  </div>

  {/* ================= AMENITIES ================= */}
  <h3 className="section-title">Amenities</h3>
  <div className="amenities-grid">
  {["Wifi","AC","TV","Kitchen","Parking","Pool"].map((item) => (
    <label key={item} className="amenity-box">
      <input
        type="checkbox"
        checked={formData.amenities.includes(item)}   // ⭐ important
        onChange={(e)=>{
          if(e.target.checked){
            setFormData(prev => ({
              ...prev,
              amenities:[...prev.amenities, item]
            }))
          }else{
            setFormData(prev => ({
              ...prev,
              amenities: prev.amenities.filter(a=>a!==item)
            }))
          }
        }}
      />
      {item}
    </label>
  ))}
</div>

  {/* ================= PHOTOS ================= */}
  <label className="form-label">Upload Property Photos (at least 5)</label>
  <input type="file" multiple  accept="image/*" onChange={handlePhotos} className="form-input"/>
  {/* EXISTING PHOTOS WHEN EDIT */}
{editing && existingPhotos.map((p, i) => (
  <div key={i} className="img-box">
    <img src={`${BACKEND_URL}/${p}`} className="preview-img" />
    <button
      type="button"
      className="remove-btn"
      onClick={() => removeExistingPhoto(i)}
    >
      ✕
    </button>
  </div>
))}



  <div className="preview-grid">
  {formData.photos.map((file, i) => (
    <div key={i} className="img-box">
      <img src={URL.createObjectURL(file)} className="preview-img"/>
      <button
        type="button"
        className="remove-btn"
        onClick={() => removePhoto(i)}
      >
        ✕
      </button>
    </div>
  ))}
</div>


  {/* ================= DESCRIPTION ================= */}
  <label className="form-label">Property Description</label>
  <textarea
    name="description"
    className="big-textarea"
    value ={formData.description}
    placeholder="Describe your property..."
    onChange={handleChange}
  />

{errors.description && <p className="error">{errors.description}</p>}
  <button className="btn-submit">
    {editing ? "Update Home" : "Add Home"}
  </button>

</form>


        
      </main>
    </div>
    </>
  );
}
