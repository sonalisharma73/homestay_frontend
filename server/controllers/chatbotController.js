export const chatbotReply = (req,res)=>{


const { message } = req.body;
const msg = message.toLowerCase();

let reply = "Sorry, I didn't understand. Please try another question.";

// booking
if(msg.includes("book") || msg.includes("booking")){
reply="Steps to book a homestay:\n1. Go to the 'Homes' page.\n2. Select the homestay you like.\n3. Click the 'Book' button.\n4. A booking page will open.\n5. Fill check-in, check-out, guests and rooms.\n6. Check availability.\n7. Select payment method.\n8. Click 'Confirm Booking'.";
}

else if(msg.includes("cancel")){
reply="Steps to cancel booking:\n1. Go to 'My Bookings' page.\n2. Find the booking you want to cancel.\n3. Click the 'Cancel' button on that booking card.\n4. Your booking will be cancelled instantly.";
}

else if(msg.includes("modify") || msg.includes("change booking")){
reply="You can modify your booking by contacting the host or cancelling and rebooking.";
}

else if(msg.includes("availability")){
reply="Availability can be checked on the homestay page before booking.";
}

else if(msg.includes("price") || msg.includes("cost")){
reply="Homestay prices depend on location, facilities and season.";
}

else if(msg.includes("discount")){
reply="Discounts may be available during special offers or festivals.";
}

else if(msg.includes("payment")){
reply="Payments are made during the booking process.";
}

else if(msg.includes("refund")){
reply="Refund policies depend on the cancellation rules of the homestay.";
}

else if(msg.includes("check in")){
reply="Check-in time usually starts after 12 PM.";
}

else if(msg.includes("check out")){
reply="Check-out time is usually before 11 AM.";
}

else if(msg.includes("confirm booking")){
reply="You will receive a confirmation message after successful booking.";
}

else if(msg.includes("advance payment")){
reply="Some homestays may require advance payment during booking.";
}

else if(msg.includes("booking id")){
reply="Your booking ID is generated automatically after confirming the booking.";
}

// homestay info
else if(msg.includes("amenities")){
reply="Amenities may include WiFi, meals, parking and local tour guidance.";
}

else if(msg.includes("wifi")){
reply="Most homestays provide WiFi for guests.";
}

else if(msg.includes("parking")){
reply="Parking facilities depend on the homestay location.";
}

else if(msg.includes("food") || msg.includes("meal")){
reply="Many homestays provide home-cooked meals on request.";
}

else if(msg.includes("room")){
reply="Room details and photos are available on the homestay listing page.";
}

else if(msg.includes("rating")){
reply="You can see ratings and reviews on each homestay page.";
}

else if(msg.includes("review")){
reply="Guests can leave reviews after completing their stay.";
}

// tourist
else if(msg.includes("tourist") || msg.includes("place")){
reply="You can explore nearby tourist attractions listed on the homestay page.";
}

else if(msg.includes("nearby")){
reply="Nearby attractions and landmarks are displayed on the property page.";
}

else if(msg.includes("local culture")){
reply="Homestays allow guests to experience local culture and traditions.";
}

else if(msg.includes("guide")){
reply="Some hosts provide local tour guidance for tourists.";
}

else if(msg.includes("transport")){
reply="Local transport options include taxis, buses and rental vehicles.";
}

// account
else if(msg.includes("login")){
reply="You can login using your registered email and password.";
}

else if(msg.includes("signup") || msg.includes("register")){
reply="Create an account using the signup option on the homepage.";
}

else if(msg.includes("forgot password")){
reply="Use the 'Forgot Password' option on the login page.";
}

else if(msg.includes("profile")){
reply="You can update your profile information in the profile section.";
}

else if(msg.includes("logout")){
reply="Click the logout button in the navigation bar to sign out.";
}

// host related


else if(msg.includes("become host")){
reply="You can become a host by registering your property in the host section.";
}

else if(msg.includes("contact host")){
reply="If you already booked:\n1. Go to 'Help Centre'.\n2. Select 'Booking Help'.\n3. Open 'Upcoming or Completed Bookings'.\n4. Click the booking and view host details.\n\nIf you have not booked yet:\n1. Go to the Homes page.\n2. Open the homestay details by clicking the card.\n3. Host information will be visible on the details page.";
}
else if(msg.includes("host rules")){
reply="Each homestay may have its own rules listed in the property description.";
}

// safety
else if(msg.includes("safety")){
reply="Our platform ensures verified hosts and safe booking experiences.";
}

else if(msg.includes("secure")){
reply="All payments and data are securely processed.";
}

else if(msg.includes("support") || msg.includes("help")){
reply="You can contact support or use this AI assistant for help.";
}

// travel
else if(msg.includes("best time")){
reply="The best time to travel depends on the destination and weather.";
}

else if(msg.includes("family")){
reply="Many homestays are family-friendly with spacious rooms.";
}

else if(msg.includes("solo")){
reply="Homestays are safe and comfortable for solo travelers.";
}

else if(msg.includes("couple")){
reply="Many homestays provide private rooms suitable for couples.";
}

else if(msg.includes("group")){
reply="Some homestays offer multiple rooms for group travelers.";
}

// recommendation
else if(msg.includes("recommend")){
reply="Our system recommends homestays based on your preferences.";
}

else if(msg.includes("suggest")){
reply="You can explore recommended homestays on the homepage.";
}

else if(msg.includes("popular")){
reply="Popular homestays are shown in the featured section.";
}

else if(msg.includes("top")){
reply="Top-rated homestays are based on user reviews and ratings.";
}



else if(msg.includes("host")){
reply="Do you want to contact the host for a booked homestay or a homestay you haven't booked yet?";
}

// general
else if(msg.includes("hello") || msg.includes("hi")){
reply="Hello! How can I help you today?";
}

else if(msg.includes("thank")){
reply="You're welcome! Happy to help.";
}

else if(msg.includes("favourite") || msg.includes("favorite")){
reply="Steps to add a homestay to favourites:\n1. Go to the 'Homes' page.\n2. Find the homestay you like.\n3. Click the 'Add to Favourites' button.\n4. The homestay will be saved in your Favourite section.";
}
else if(msg.includes("remove favourite") || msg.includes("remove favorite")){
reply="Steps to remove from favourites:\n1. Go to the 'Favourite' page.\n2. Find the saved homestay.\n3. Click the 'Remove from Favourites' button.\n4. The homestay will be removed from your list.";
}

else if(msg.includes("bye")){
reply="Goodbye! Have a great trip.";
}

res.json({ reply });

};