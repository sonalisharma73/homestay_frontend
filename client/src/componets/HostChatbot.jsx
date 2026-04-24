


import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "../axiosConfig";
import "./HostChatbot.css";


function HostChatbot(){

const [message,setMessage]=useState("");
const [messages,setMessages]=useState([]);
const chatRef = useRef(null);
const location = useLocation();
const initialQuestion = location.state?.question;

const hasSent = useRef(false);

// suggested questions
const suggestions = [
"How to become a host",
"What documents are required",
"What is required to setup a homestay",
"What facilities should a homestay provide",
"How to add homestay listing",
"How to manage bookings",
"How to attract more guests",
"How to improve homestay ratings"
];

const sendMessage = async (text) => {

const userText = text || message;

if(!userText) return;

try{

const res = await axios.post(
"/api/host-chatbot",
{ message:userText }
);

setMessages(prev=>[
...prev,
{sender:"user",text:userText},
{sender:"bot",text:res.data.reply}
]);

setMessage("");

}catch(err){

setMessages(prev=>[
...prev,
{sender:"bot",text:"Server error. Please try again."}
]);

}

};

useEffect(()=>{

if(initialQuestion && !hasSent.current){

sendMessage(initialQuestion);
hasSent.current = true;

}

},[initialQuestion]);

useEffect(()=>{
if(chatRef.current){
chatRef.current.scrollTop = chatRef.current.scrollHeight;
}
},[messages]);

// return(

// <div className="chatbot-container">

// <h2>Host AI Assistant</h2>

// {/* suggestion buttons */}
// <div className="suggestions">

// {suggestions.map((q,i)=>(
// <button
// key={i}
// className="suggestion-btn"
// onClick={()=>sendMessage(q)}
// >
// {q}
// </button>
// ))}

// </div>

// <div className="chatbot-body">

// {messages.map((m,i)=>(
// <div key={i} className={m.sender==="user"?"user-msg":"bot-msg"}>
// {m.text}
// </div>
// ))}

// </div>

// <div className="chatbot-input">

// <input
// value={message}
// onChange={(e)=>setMessage(e.target.value)}
// placeholder="Ask host question..."
// />

// <button onClick={()=>sendMessage()}>
// Send
// </button>

// </div>

// </div>

// );
return(

<div className="host-chatbot-layout">

{/* Suggestions */}
<div className="suggestion-panel">

<h3>Quick Help</h3>

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


{/* Chatbot */}
<div className="chatbot-container">

<h2 className="chatbot-title">Host AI Assistant</h2>

<div className="chatbot-body"  ref={chatRef}>

{messages.map((m,i)=>(
<div key={i} className={m.sender==="user"?"user-msg":"bot-msg"}>
{m.text}
</div>
))}

</div>

<div className="chatbot-input">

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
placeholder="Ask host question..."
/>

<button onClick={()=>sendMessage()}>
Send
</button>

</div>

</div>

</div>

);

}

export default HostChatbot;