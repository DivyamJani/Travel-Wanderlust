import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BookingConfirmation() {
  const location = useLocation();
  const { packageTitle, destination, price } = location.state || {};

  return (
    <motion.div 
      className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Booking Confirmed!</h1>
      <p className="text-lg mb-4">Thank you for your booking. Here's your trip details:</p>
      <div className="bg-gray-100 p-4 rounded">
        <p><strong>Package:</strong> {packageTitle}</p>
        <p><strong>Destination:</strong> {destination}</p>
        <p><strong>Total Price:</strong> ${price}</p>
      </div>
      <p className="mt-4">A confirmation email has been sent to your registered email address.</p>
    </motion.div>
  );
}