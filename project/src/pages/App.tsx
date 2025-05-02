import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from './Home';
import PackageList from './PackageList';
import AddPackage from './AddPackage';
import BookPackage from './BookPackage';
import AdminDashboard from './AdminDashboard';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import VerifyOtp from './VerifyOtp';
import UserBookings from './UserBookings';
import HotelBookings from './HotelBookings';
import Booking from './Booking';
import BookingConfirmation from './BookingConfirmation';
import AllBooking from './AllBooking';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route
              path="/packages"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <PackageList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-package/:id"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <BookPackage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-package"
              element={
                <ProtectedRoute allowedRoles={['hotelOwner']}>
                  <AddPackage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hotel-bookings"
              element={
                <ProtectedRoute allowedRoles={['hotelOwner']}>
                  <HotelBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['user', 'hotelOwner']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-bookings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AllBooking />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
            // In your App.tsx or router file
<Route path="/book-package/:packageId" element={<Booking />} />
<Route path="/booking-confirmation" element={<BookingConfirmation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; // This is the default export