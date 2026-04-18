import Navbar from "../componets/Navbar";
import { useNavigate } from "react-router-dom";
import "./HostHelp.css";

function HostHelp(){

const navigate = useNavigate();

return(

<>
<Navbar/>

<div className="help-container">

<h2>Host Help Centre</h2>

<div className="help-section">
<h3>Getting Started</h3>

<div
className="help-item"
onClick={()=>navigate("/host-chatbot",{state:{question:"How to become a host?"}})}
>
How to become a host?
</div>

<div
className="help-item"
onClick={()=>navigate("/host-chatbot",{state:{question:"What documents are required?"}})}
>
What documents are required?
</div>

</div>

<div className="help-section">
<h3>Listing Your Homestay</h3>

<div
className="help-item"
onClick={()=>navigate("/host-chatbot",{state:{question:"How to add homestay?"}})}
>
How to add homestay?
</div>

<div
className="help-item"
onClick={()=>navigate("/host-chatbot",{state:{question:"How to upload photos?"}})}
>
How to upload photos?
</div>

</div>

<div className="help-section">
<h3>Bookings</h3>

<div
className="help-item"
onClick={()=>navigate("/host-chatbot",{state:{question:"How to manage bookings?"}})}
>
How to manage bookings?
</div>

<div
className="help-item"
onClick={()=>navigate("/host-chatbot",{state:{question:"How to contact guests?"}})}
>
How to contact guests?
</div>

</div>

<div className="help-section">
<h3>Still Need Help?</h3>

<div
className="help-item"
onClick={()=>navigate("/host-chatbot")}
>
Chat with Host AI Assistant
</div>

</div>

</div>

</>

);

}

export default HostHelp;