function Contact() {
  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f6efea"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
          textAlign: "center",
          width: "350px"
        }}
      >
        <h2 style={{ color: "#a35d4f" }}>Contact Support</h2>

        <p>Email: support@homestayhaven.com</p>
        <p>Phone: +91 9876543210</p>
      </div>
    </div>
  );
}

export default Contact;