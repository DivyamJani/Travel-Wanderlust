import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';

// Define interfaces for the data structure
interface User {
  _id: string;
  name: string;
  email: string;
  hotelName?: string; // For hotel owners
  hotelLocation?: string; // For hotel owners
}

interface Package {
  _id: string;
  title: string;
  destination: string;
  price: number;
  createdBy: User; // Hotel owner who created the package
}

interface Booking {
  _id: string;
  userId: User; // User who booked the package
  packageId: Package;
  travelDate: string;
}

export default function AllBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/all-bookings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data: Booking[] = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching all bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }
      setBookings(bookings.filter((booking) => booking._id !== id));
      setExpandedRow(null); // Collapse if the deleted row was expanded
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    }
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 font-sans relative overflow-hidden">
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')",
        }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1, transition: { duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } }}
      >
        <div className="absolute inset-0 bg-teal-900/10 backdrop-blur-sm"></div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto py-16 px-6 space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <h1 className="text-5xl font-extrabold text-teal-900 text-center tracking-tight drop-shadow-xl">
          All Package Bookings
        </h1>

        {/* Table */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-teal-200/50">
          <table className="min-w-full divide-y divide-teal-200/50">
            <thead className="bg-teal-50/80">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-semibold text-teal-700 uppercase tracking-wider">User</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-teal-700 uppercase tracking-wider">Package</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-teal-700 uppercase tracking-wider">Hotel</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-teal-700 uppercase tracking-wider">Owner</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-teal-700 uppercase tracking-wider">Travel Date</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-teal-700 uppercase tracking-wider">Price</th>
                <th className="px-8 py-4 text-right text-sm font-semibold text-teal-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-200/50">
              {bookings.map((booking, index) => (
                <motion.tr
                  key={booking._id}
                  className="bg-white/90 hover:bg-teal-50/50 transition-colors duration-300 cursor-pointer"
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  onClick={() => toggleRow(booking._id)}
                >
                  <td className="px-8 py-5 whitespace-nowrap text-teal-800 font-medium">
                    {booking.userId.name} <span className="text-teal-600">({booking.userId.email})</span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-teal-800 font-medium">{booking.packageId.title}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-teal-800 font-medium">
                    {booking.packageId.createdBy.hotelName || 'N/A'}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-teal-800 font-medium">
                    {booking.packageId.createdBy.name || 'N/A'}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-teal-600">
                    {new Date(booking.travelDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-teal-700 font-bold">${booking.packageId.price}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <motion.button
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row toggle on delete click
                        handleDelete(booking._id);
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
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
                className="bg-teal-100/80 p-6 border-t border-teal-200/50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                {bookings.find((b) => b._id === expandedRow) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-teal-800">
                      {bookings.find((b) => b._id === expandedRow)!.packageId.title}
                    </h3>
                    <p className="text-teal-600">
                      <span className="font-medium">Booked by:</span> {bookings.find((b) => b._id === expandedRow)!.userId.name} (
                      {bookings.find((b) => b._id === expandedRow)!.userId.email})
                    </p>
                    <p className="text-teal-600">
                      <span className="font-medium">Hotel:</span>{' '}
                      {bookings.find((b) => b._id === expandedRow)!.packageId.createdBy.hotelName || 'N/A'}
                    </p>
                    <p className="text-teal-600">
                      <span className="font-medium">Hotel Owner:</span>{' '}
                      {bookings.find((b) => b._id === expandedRow)!.packageId.createdBy.name || 'N/A'} (
                      {bookings.find((b) => b._id === expandedRow)!.packageId.createdBy.email || 'N/A'})
                    </p>
                    <p className="text-teal-600">
                      <span className="font-medium">Hotel Location:</span>{' '}
                      {bookings.find((b) => b._id === expandedRow)!.packageId.createdBy.hotelLocation || 'N/A'}
                    </p>
                    <p className="text-teal-600">
                      <span className="font-medium">Travel Date:</span>{' '}
                      {new Date(bookings.find((b) => b._id === expandedRow)!.travelDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-teal-700 font-bold">
                      <span className="font-medium">Price:</span> ${bookings.find((b) => b._id === expandedRow)!.packageId.price}
                    </p>
                    <div className="flex gap-4">
                      <button
                        className="px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors duration-300 shadow-md"
                        onClick={() => alert(`Details for ${bookings.find((b) => b._id === expandedRow)!.packageId.title}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-300 shadow-md"
                        onClick={() => handleDelete(expandedRow)}
                      >
                        Delete Booking
                      </button>
                    </div>
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