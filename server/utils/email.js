const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendBookingEmails = async (booking, guestEmail, hostEmail) => {
  const html = `
    <h2>Booking Confirmed</h2>
    <p>CheckIn: ${booking.checkIn}</p>
    <p>CheckOut: ${booking.checkOut}</p>
    <p>Total: ₹${booking.finalPrice}</p>
    <p>Payment: ${booking.paymentMethod}</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: guestEmail,
    subject: "Booking Confirmed",
    html
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: hostEmail,
    subject: "New Booking Received",
    html
  });
};




// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// exports.sendBookingEmails = async (booking, guest, home) => {
//   try {

//     /* =============================
//        DATA EXTRACT
//     ============================= */

//     const host = home.owner;

//     const checkIn = new Date(booking.checkIn).toDateString();
//     const checkOut = new Date(booking.checkOut).toDateString();

//     /* =============================
//        GUEST EMAIL
//     ============================= */

//     const guestHtml = `
//       <h2>🏡 Booking Confirmed</h2>

//       <h3>Property Details</h3>
//       <p><b>House:</b> ${home.housename}</p>
//       <p><b>Location:</b> ${home.address.city}, ${home.address.state}</p>
//       <p><b>Host:</b> ${host.name}</p>
//       <p><b>Host Phone:</b> ${host.phone}</p>

//       <hr/>

//       <h3>Your Booking</h3>
//       <p><b>Check-In:</b> ${checkIn}</p>
//       <p><b>Check-Out:</b> ${checkOut}</p>
//       <p><b>Rooms:</b> ${booking.roomsNeeded}</p>
//       <p><b>Guests:</b> ${booking.guestsCount}</p>

//       <p><b>Total Price:</b> ₹${booking.finalPrice}</p>
//       <p><b>Payment:</b> ${booking.paymentMethod}</p>

//       <hr/>

//       <p>Thank you for booking with Homestay-Haven ❤️</p>
//     `;

//     /* =============================
//        HOST EMAIL
//     ============================= */

//     const hostHtml = `
//       <h2>📢 New Booking Received</h2>

//       <h3>Guest Details</h3>
//       <p><b>Name:</b> ${booking.guestName}</p>
//       <p><b>Email:</b> ${guest.email}</p>
//       <p><b>Phone:</b> ${booking.phone}</p>

//       <hr/>

//       <h3>Property</h3>
//       <p><b>House:</b> ${home.housename}</p>
//       <p><b>City:</b> ${home.address.city}</p>

//       <hr/>

//       <h3>Booking Info</h3>
//       <p><b>Check-In:</b> ${checkIn}</p>
//       <p><b>Check-Out:</b> ${checkOut}</p>
//       <p><b>Rooms:</b> ${booking.roomsNeeded}</p>
//       <p><b>Guests:</b> ${booking.guestsCount}</p>

//       <p><b>Total Earn:</b> ₹${booking.finalPrice}</p>
//       <p><b>Payment:</b> ${booking.paymentMethod}</p>
//     `;

//     /* =============================
//        SEND TO GUEST
//     ============================= */

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: guest.email,
//       subject: "Your Booking is Confirmed 🏡",
//       html: guestHtml
//     });

//     /* =============================
//        SEND TO HOST
//     ============================= */

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: host.email,
//       subject: "New Booking on Your Property",
//       html: hostHtml
//     });

//   } catch (err) {
//     console.log("Email error:", err.message);
//   }
// };