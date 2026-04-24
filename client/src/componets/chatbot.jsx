import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "../axiosConfig";
import "./Chatbot.css";
import Navbar from "./Navbar";

function Chatbot() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const chatRef = useRef(null);
  const location = useLocation();
  const initialQuestion = location.state?.question;
  const hasSent = useRef(false);

  // ✅ Guest Suggestions
  const suggestions = [
     // 🔹 Booking
  "How to book a homestay",
  "How to cancel booking",
  "Can I modify my booking",
  "How to check availability",
  "How to confirm booking",

  // 🔹 Payment & Pricing
  "What is the price of homestays",
  "Is there any discount available",
  "How to make payment",
  "What is refund policy",
  "Is advance payment required",


  // 🔹 Stay Details
  "What amenities are available",
  "Is WiFi available",
  "Is parking available",
  "Do homestays provide food",
  "Show room details",
    "Suggest best homestays",
    "Find budget-friendly stays",
    "Top tourist attractions near me",
    "Recommended places for visit",
    "Family-friendly homestays",
    "Things to do nearby",
    "Best time to visit",
    "Local culture and events",
    "Is parking available",
  "Do homestays provide food",
  "Show room details",

  // 🔹 Travel & Experience
  "Tourist places near homestay",
  "Nearby attractions",
  "Local culture experience",
  "Transport options",
  "Best time to visit",

  // 🔹 Account Help
  "How to login",
  "How to register",
  "Forgot password help",
  "Update profile",
  "How to logout",

  // 🔹 Host Interaction
  "How to contact host",
  "What are host rules",
  "How to become host",

  // 🔹 Safety
  "Is it safe",
  "Is payment secure",

  // 🔹 Travel Type
  "Family friendly homestays",
  "Is it good for solo travel",
  "Homestay for couples",
  "Group booking options",
  "Recommend best homestays",
  "Suggest good stays",
  "Popular homestays",
  "Top rated homestays",

  // 🔹 General
  "Add to favourite",
  "Remove from favourite",
  "Help",
  "Hello"

  ];

  const sendMessage = async (text) => {

    const userText = text || message;
    if (!userText) return;

    try {

      const res = await axios.post(
        "/api/chatbot",
        { message: userText }
      );

      setMessages(prev => [
        ...prev,
        { sender: "user", text: userText },
        { sender: "bot", text: res.data.reply }
      ]);

      setMessage("");

    } catch (error) {

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Server error. Please try again." }
      ]);

    }
  };

  // ✅ initial question auto send
  useEffect(() => {
    if (initialQuestion && !hasSent.current) {
      sendMessage(initialQuestion);
      hasSent.current = true;
    }
  }, [initialQuestion]);

  // ✅ auto scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <Navbar />

      <div className="host-chatbot-layout">

        {/* 🔹 Suggestions Panel */}
        <div className="suggestion-panel">

  <h3>Quick Help</h3>

  {/* 👇 NEW WRAPPER */}
  <div className="suggestion-list">
    {suggestions.map((q,i)=>(
      <button
        key={i}
        className="suggestion-btn"
        onClick={()=>sendMessage(q)}
      >
        {q}
      </button>
    ))}
  </div>

</div>

        {/* 🔹 Chat Section */}
        <div className="chatbot-container">

          <h2 className="chatbot-title">Guest AI Assistant</h2>

          <div className="chatbot-body" ref={chatRef}>

            {messages.map((m, i) => (
              <div
                key={i}
                className={m.sender === "user" ? "user-msg" : "bot-msg"}
              >
                {m.text}
              </div>
            ))}

          </div>

          <div className="chatbot-input">

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about stays, places..."
            />

            <button onClick={() => sendMessage()}>
              Send
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

export default Chatbot;