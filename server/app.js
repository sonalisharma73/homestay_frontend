// // Core Modules
// const path = require("path");
// const session = require("express-session");
// require("dotenv").config();
// // External Modules
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const MongoDBStore = require("connect-mongodb-session")(session);


// // Local Modules
// const AuthRouter = require("./routes/AuthRouter");
// const StoreRouter = require("./routes/storeRouter");
// const HostRouter = require("./routes/hostRouter");
// const BookingRouter = require("./routes/BookingRouter");
// const eventRoutes = require("./routes/eventRoutes");
// const chatbotRoutes =require ("./routes/chatbotRoutes");
// const app = express();

// // ✅ MongoDB URL
// const url_path = "mongodb+srv://bittugudhainiya:Sonali123@cluster0.bbwgrmj.mongodb.net/homestay?retryWrites=true&w=majority&appName=Cluster0";

// // ✅ Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // ✅ Allow frontend access
// app.use(
//   cors({
//     origin: "http://localhost:5173", // your React app’s port
//     credentials: true,
//   })
// );

// // ✅ Session store
// const store = new MongoDBStore({
//   uri: url_path,
//   collection: "sessions",
// });

// // app.use(
// //   session({
// //     secret: "My homestay",
// //     resave: false,
// //     saveUninitialized: false,
// //     store: store,
// //   })
// // );
// app.use(
//   session({
//     secret: "My homestay",
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//     cookie: {
//       httpOnly: true,
//       secure: false,     // localhost ke liye false
//       sameSite: "lax",   // ⭐ MOST IMPORTANT FIX
//     },
//   })
// );

// app.use((req, res, next) => {
//   req.isLoggedIn = req.session.isLoggedIn;
//   next();
// });

// // ✅ Static files (serve uploaded images)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ✅ Routes
// app.use("/api/auth", AuthRouter);
// app.use("/store", StoreRouter);
// app.use("/host", HostRouter); // <--- Important: add /host prefix
// app.use("/booking", BookingRouter);
// app.use("/events", eventRoutes);
// app.use("/api", chatbotRoutes);

// // ✅ Default route
// app.get("/", (req, res) => {
//   res.send("🏠 Homestay Backend Running Successfully!");
// });

// // ✅ Start server
// const PORT = 5000;
// mongoose
//   .connect(url_path)
//   .then(() => {
//     console.log("✅ Connected to MongoDB");
//     app.listen(PORT, () =>
//       console.log(`🚀 Server running on http://localhost:${PORT}`)
//     );
//   })
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));



// Core Modules
const path = require("path");
const session = require("express-session");
require("dotenv").config();

// External Modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongodb-session")(session);

// Local Modules
const AuthRouter = require("./routes/AuthRouter");
const StoreRouter = require("./routes/storeRouter");
const HostRouter = require("./routes/hostRouter");
const BookingRouter = require("./routes/BookingRouter");
const eventRoutes = require("./routes/eventRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express();

// ✅ CHANGED: MongoDB URL from env
const url_path = process.env.MONGO_URL;

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ CHANGED: CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// ✅ Session store
const store = new MongoDBStore({
  uri: url_path,
  collection: "sessions",
});

// ✅ CHANGED: cookie settings for production
app.use(
  session({
    secret: "My homestay",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: true,      // ✅ changed
      sameSite: "none",  // ✅ changed
    },
  })
);

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

// ✅ Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", AuthRouter);
app.use("/store", StoreRouter);
app.use("/host", HostRouter);
app.use("/booking", BookingRouter);
app.use("/events", eventRoutes);
app.use("/api", chatbotRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🏠 Homestay Backend Running Successfully!");
});

// ✅ CHANGED: PORT
const PORT = process.env.PORT || 5000;

mongoose
  .connect(url_path)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));