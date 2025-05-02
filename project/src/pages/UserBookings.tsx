import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define interfaces for the data structure
interface Package {
  _id: string;
  title: string;
  price: number;
}

interface Booking {
  _id: string;
  packageId: Package;
  travelDate: string;
}

export default function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data: Booking[] = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-teal-50 to-cyan-100 font-sans relative overflow-hidden">
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1596478946932-24e63213b3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')", // Vintage map
        }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1, transition: { duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } }}
      >
        <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-sm"></div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto py-16 px-6 space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <h1 className="text-5xl font-extrabold text-indigo-900 text-center tracking-tight drop-shadow-xl">
          My Travel Bookings
        </h1>

        {/* Table */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-indigo-200/50">
          <table className="min-w-full divide-y divide-indigo-200/50">
            <thead className="bg-indigo-50/80">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">Package</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">Travel Date</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">Price</th>
                <th className="px-8 py-4"></th> {/* Expand button column */}
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-200/50">
              {bookings.map((booking, index) => (
                <motion.tr
                  key={booking._id}
                  className="bg-white/90 hover:bg-indigo-50/50 transition-colors duration-300"
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  onClick={() => toggleRow(booking._id)}
                >
                  <td className="px-8 py-5 whitespace-nowrap text-indigo-800 font-medium">{booking.packageId.title}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-indigo-600">
                    {new Date(booking.travelDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-indigo-700 font-bold">${booking.packageId.price}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <motion.button
                      className="text-indigo-500 hover:text-indigo-700 focus:outline-none"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {expandedRow === booking._id ? '↑' : '↓'}
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Expanded Row Details */}
          <AnimatePresence>
            {expandedRow && (
              <motion.div
                className="bg-indigo-100/80 p-6 border-t border-indigo-200/50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                {bookings.find((b) => b._id === expandedRow) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-indigo-800">
                      {bookings.find((b) => b._id === expandedRow)!.packageId.title}
                    </h3>
                    <p className="text-indigo-600">
                      <span className="font-medium">Travel Date:</span>{' '}
                      {new Date(bookings.find((b) => b._id === expandedRow)!.travelDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-indigo-700 font-bold">
                      <span className="font-medium">Price:</span> ${bookings.find((b) => b._id === expandedRow)!.packageId.price}
                    </p>
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-md"
                      onClick={() => alert(`Details for ${bookings.find((b) => b._id === expandedRow)!.packageId.title}`)}
                    >
                      View Full Details
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}