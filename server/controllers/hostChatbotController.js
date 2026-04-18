// export const hostChatbotReply = (req, res) => {

// const { message } = req.body;

// if(!message){
// return res.json({reply:"Please type a question"});
// }

// const msg = message.toLowerCase();

// let reply = "Sorry, I didn't understand. Please ask about listing homestay, documents, bookings or pricing.";

// // greeting
// if(msg.includes("hi") || msg.includes("hello")){
// reply="Hello Host! I can help you with listing homestay, pricing, bookings and facilities.";
// }

// // become host
// else if(msg.includes("become host") || msg.includes("register")||
// msg.includes(" host") ||
// msg.includes("host registration")){
// reply="Steps to become a host:\n1. Login to your account\n2. Go to Host Dashboard\n3. Click Add Homestay\n4. Fill property details\n5. Submit listing";
// }

// // add homestay
// else if(msg.includes("add homestay") || msg.includes("listing")){
// reply="Steps to add homestay:\n1. Open Host Dashboard\n2. Click Add Homestay\n3. Enter name, location and description\n4. Upload photos\n5. Set price per night\n6. Save listing";
// }

// // documents
// else if(msg.includes("document")){
// reply="Required documents:\n1. Government ID proof\n2. Property ownership proof\n3. Address verification\n4. Bank account details";
// }

// // photos
// else if(msg.includes("photo") || msg.includes("upload")){
// reply="Upload clear photos of rooms, bathroom, outside view and surroundings.";
// }

// // price
// else if(msg.includes("price")){
// reply="Set your homestay price based on location, facilities and room quality.";
// }

// // bookings
// else if(msg.includes("booking")){
// reply="Hosts can manage bookings from Host Dashboard where guest details and dates are visible.";
// }

// // guest
// else if(msg.includes("guest")){
// reply="Guest contact details are available after booking confirmation.";
// }

// // payment
// else if(msg.includes("payment")){
// reply="Payment is transferred to host bank account after guest completes stay.";
// }

// // facilities
// else if(msg.includes("facility") || msg.includes("amenities")){
// reply="Recommended facilities:\nWiFi\nClean rooms\nDrinking water\nBathroom\nParking\nFurniture";
// }

// // safety
// else if(msg.includes("safety")){
// reply="Maintain safety with proper locks, emergency contact numbers and clean environment.";
// }

// res.json({reply});

// };
export const hostChatbotReply = (req, res) => {

const { message } = req.body;

if(!message){
return res.json({reply:"Please type a question"});
}

const msg = message.toLowerCase();

let reply = "Sorry, I didn't understand. Please ask about listing homestay, documents, bookings or pricing.";

// greeting
if(msg.includes("hi") || msg.includes("hello")){
reply="Hello Host! I can help you with listing homestay, pricing, bookings, facilities and setup.";
}

// become host
else if(
msg.includes("become host") ||msg.includes("become a host")||
msg.includes("register") ||
msg.includes("host registration")
){
reply="Steps to become a host:\n1 Login to your account\n2 Go to Host Dashboard\n3 Click Add Homestay\n4 Fill property details\n5 Submit listing";
}

// setup homestay
else if(
msg.includes("setup homestay") ||
msg.includes("start homestay") ||
msg.includes("homestay setup")
){
reply="To setup a homestay you need:\n1 Clean and comfortable rooms\n2 Beds and basic furniture\n3 Clean bathroom\n4 Electricity and water supply\n5 Good photos for listing\n6 Friendly host behaviour\n\nWatch guide: https://www.youtube.com/results?search_query=how+to+start+homestay+business";
}

// rooms required
else if(
msg.includes("rooms required") ||
msg.includes("how many rooms")
){
reply="Usually small homestays have 1–6 guest rooms depending on property size.";
}

// facilities
else if(
msg.includes("facility") ||
msg.includes("amenities")
){
reply="Recommended homestay facilities:\n• Clean beds\n• Attached bathroom\n• WiFi\n• Drinking water\n• Parking space\n• Local guidance for tourists";
}

// food
else if(
msg.includes("food") ||
msg.includes("meal")
){
reply="Many homestays offer home-cooked meals to guests. It is optional but improves guest experience.";
}

// wifi
else if(msg.includes("wifi")){
reply="Providing WiFi is recommended because most travelers expect internet access.";
}

// documents
else if(msg.includes("document")){
reply="Required documents:\n1 Government ID proof\n2 Property ownership proof or rental agreement\n3 Address verification\n4 Bank account details";
}

// add homestay
else if(
msg.includes("add homestay") ||
msg.includes("listing")
){
reply="Steps to add homestay:\n1 Open Host Dashboard\n2 Click Add Homestay\n3 Enter name, location and description\n4 Upload photos\n5 Set price per night\n6 Save listing";
}

// upload photos
else if(
msg.includes("photo") ||
msg.includes("upload")
){
reply="Upload clear photos of:\n• Rooms\n• Bathroom\n• Exterior view\n• Surroundings or tourist places";
}

// pricing
else if(msg.includes("price")){
reply="Set your homestay price based on:\n• Location\n• Facilities\n• Room quality\n• Tourist season";
}

// bookings
else if(msg.includes("booking")){
reply="Hosts can manage bookings from Host Dashboard where guest details and booking dates are visible.";
}

// guest contact
else if(msg.includes("guest")){
reply="Guest contact details become available after booking confirmation.";
}

// payment
else if(msg.includes("payment")){
reply="Payments are transferred to the host's registered bank account after the stay is completed.";
}

// safety
else if(msg.includes("safety")){
reply="Safety tips:\n• Secure door locks\n• Emergency contact numbers\n• Fire safety equipment\n• Clean environment";
}

// attract guests
else if(
msg.includes("more booking") ||
msg.includes("attract guests")
){
reply="To attract more guests:\n1 Upload high quality photos\n2 Maintain good cleanliness\n3 Offer competitive prices\n4 Get positive reviews from guests";
}
else if(msg.includes("attract more guests")){
reply="To attract more guests:\n1 Upload high quality photos\n2 Keep rooms clean\n3 Provide WiFi and meals\n4 Maintain good reviews.";
}

else if(msg.includes("improve homestay ratings")){
reply="Improve ratings by:\n1 Keeping rooms clean\n2 Being friendly with guests\n3 Providing quick support\n4 Offering local travel guidance.";
}

else if(msg.includes("video")){
reply="Watch this guide on starting a homestay:\nhttps://www.youtube.com/results?search_query=how+to+start+homestay+business";
}
else if (
  msg.includes("setup homestay") ||
  msg.includes("set up homestay") ||
  msg.includes("required to setup a homestay") ||
  msg.includes("start homestay")
) {
  reply = `To setup a homestay you need:

1. Clean and comfortable rooms
2. Beds and basic furniture
3. Clean bathroom
4. Electricity and water supply
5. Good photos of your property
6. Friendly host behaviour for guests`;
}

else if (
  msg.includes("facilities") ||
  msg.includes("homestay provide") ||
  msg.includes("facilities should a homestay provide")
) {
  reply = `Recommended homestay facilities:

1. WiFi internet
2. Clean beds and rooms
3. Bathroom with hot water
4. Drinking water
5. Parking space
6. Local tourist guidance`;
}

res.json({reply});

};