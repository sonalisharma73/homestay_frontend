import Navbar from "../componets/Navbar";
import { useNavigate } from "react-router-dom";
import "./Helpcenter.css";

function HelpCentre(){

const navigate = useNavigate();

return(

<>
<Navbar/>
 <div className="help-page">
<div className="help-container">

<h2>Help Centre</h2>

<div className="help-section">

<h3>Booking Help</h3>

<div
className="help-item"
onClick={()=>navigate("/chatbot",{state:{question:"How to book a homestay"}})}
>
How to book a homestay?
</div>


<div
className="help-item"
onClick={()=>navigate("/chatbot",{state:{question:"How to cancel my booking"}})}
>
How to cancel my booking?
</div>

<div
className="help-item"
onClick={()=>navigate("/chatbot",{state:{question:"Payment related issue"}})}
>
Payment related issue
</div>

</div>

<div className="help-section">

<h3>Your Bookings</h3>




<div className="help-item" onClick={()=>navigate("/booking-history")}>
Upcoming Bookings
</div>

<div className="help-item" onClick={()=>navigate("/booking-history")}>
Previous Bookings
</div>


</div>

<div className="help-section">

<h3>Still Need Help?</h3>

<div className="help-item" onClick={()=>navigate("/chatbot")}>
Chat with AI Assistant
</div>

<div className="help-item" onClick={()=>navigate("/contact")}>
Contact Us
</div>

</div>

</div>
</div>

</>

);

}

export default HelpCentre;