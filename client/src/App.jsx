
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./componets/Navbar";
import ProtectedRoute from "./componets/ProtectedRoute";

import Login from "./pages/login";
import Signup from "./pages/Signup";
import AddHome from "./pages/addHome";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/home";
import HomeList from "./pages/homelist";
import Booking from "./pages/Booking";
import Details from "./pages/details";
import Dashboard from "./pages/Dashboard";
import Favourite from "./pages/favourite";
import MyBookings from "./pages/myBookings";
import BookingStatus from "./pages/BookingStatus";
import Profile from "./pages/Profile";
import EditProfile from "./pages/Editprofile";
import HostBookings from "./pages/HostBookings";
import HostDashboard from "./pages/HostDashboard";
import HelpCentre from "./pages/Helpcenter";
import Contact from "./pages/Contact";
import Chatbot from "./componets/chatbot";
import BookingHistory from "./pages/Bookinghistory";
import HostHelp from "./pages/HostHelp";
import HostChatbotPage from "./pages/HostChatbotPage";
import Index from "./pages/index";
import EventList from "./pages/EventList";
import AddEvent from "./pages/AddEvent";
import EventDetails from "./pages/EventDetails";
import HostEvents from "./pages/HostEvents";
import EditEvent from "./pages/EditEvent";



function App() {
  return (
    <>
      <Router>
        <Navbar />

        <div className="page-container">
          <Routes>
            {/* Public Routes */}
            <Route path="/homes" element={<Home />} />
             <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route path="/booking/:id" element={
              <ProtectedRoute role="guest">
                <Booking />
              </ProtectedRoute>
            } />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/booking-status" element={<BookingStatus />} />

            {/* Guest Protected */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute role="guest">
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/favourites"
              element={
                <ProtectedRoute role="guest">
                  <Favourite />
                </ProtectedRoute>
              }
            />


            
               <Route path="/booking-history" element={
                <ProtectedRoute role="guest">
                  <BookingHistory/>
                </ProtectedRoute>
              }/>
              
             <Route path="/contact" element={ 
                <ProtectedRoute >
                  <Contact/>
                </ProtectedRoute>
              }/>
             
           <Route path="/event/:id" element={<EventDetails />} />


            <Route path="/chatbot" element={
              <ProtectedRoute role="guest">
                <Chatbot/>
              </ProtectedRoute>
            } />
            
           <Route path="/event/eventlist" element={<EventList />} />


           
            <Route path="/help/guest" element={
              <ProtectedRoute role="guest">
                <HelpCentre/>
              </ProtectedRoute>
            } />

            {/* Host Protected */}

            <Route path="/host-help" element={
              <ProtectedRoute role="host">
                <HostHelp/>
              </ProtectedRoute>
            }/>

             <Route path="/host-chatbot" element={
              <ProtectedRoute role="host">
                <HostChatbotPage/>
              </ProtectedRoute>
            }/>
              <Route path="/edit-event/:id" element={
                <ProtectedRoute role="host">
                  <EditEvent />
                </ProtectedRoute>
              } />
            <Route
              path="/addHome"
              element={
                <ProtectedRoute role="host">
                  <AddHome />
                </ProtectedRoute>
              }
            />

            <Route
              path="/host/addHome/:homeId"
              element={
                <ProtectedRoute role="host">
                  <AddHome />
                </ProtectedRoute>
              }
            />
             <Route path="/add-event" element={
              <ProtectedRoute role="host">
                <AddEvent />
              </ProtectedRoute>
            } />

            <Route
              path="/homelist"
              element={
                <ProtectedRoute role="host">
                  <HomeList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/host-dashboard"
              element={
                <ProtectedRoute role="host">
                  <HostDashboard />
                </ProtectedRoute>
              }
            />

           

            <Route
              path="/host-bookings"
              element={
                <ProtectedRoute role="host">
                  <HostBookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-events"
              element={
                <ProtectedRoute role="host">
                  <HostEvents />
                </ProtectedRoute>
              }
            />

            {/* Common Protected */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />

            
            
          </Routes>
        </div>
          <ToastContainer position="top-right" autoClose={3000} />
      </Router>
            
    
    </>
  );
}

export default App;