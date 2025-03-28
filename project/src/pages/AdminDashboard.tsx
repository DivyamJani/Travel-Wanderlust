import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, DollarSign, Hotel } from 'lucide-react';

interface DashboardData {
  totalUsers: number;
  totalHotelOwners: number;
  totalPackages: number;
  totalBookings: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    totalUsers: 0,
    totalHotelOwners: 0,
    totalPackages: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setData({ totalUsers: 500, totalHotelOwners: 50, totalPackages: 200, totalBookings: 300 });
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-yellow-100 to-red-200 font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-300 rounded-full mix-blend-overlay filter blur-3xl animate-float delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-300"></div>
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto py-16 px-6 space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 text-center tracking-tight drop-shadow-lg">
          Admin Prism Dashboard
        </h1>

        {/* Dashboard Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            className="bg-white/20 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-green-300/30 hover:bg-white/30 transition-all duration-300"
            variants={cardVariants}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(34, 197, 94, 0.3)' }} // Green shadow
          >
            <div className="flex items-center">
              <Users className="h-10 w-10 text-green-500 mr-4" />
              <div>
                <p className="text-3xl font-bold text-green-700">{data.totalUsers}</p>
                <p className="text-green-400 text-sm">Total Users</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/20 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-red-300/30 hover:bg-white/30 transition-all duration-300"
            variants={cardVariants}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(239, 68, 68, 0.3)' }} // Red shadow
          >
            <div className="flex items-center">
              <Hotel className="h-10 w-10 text-red-500 mr-4" />
              <div>
                <p className="text-3xl font-bold text-red-700">{data.totalHotelOwners}</p>
                <p className="text-red-400 text-sm">Hotel Owners</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/20 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-yellow-300/30 hover:bg-white/30 transition-all duration-300"
            variants={cardVariants}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(234, 179, 8, 0.3)' }} // Yellow shadow
          >
            <div className="flex items-center">
              <Package className="h-10 w-10 text-yellow-500 mr-4" />
              <div>
                <p className="text-3xl font-bold text-yellow-700">{data.totalPackages}</p>
                <p className="text-yellow-400 text-sm">Total Packages</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/20 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-green-300/30 hover:bg-white/30 transition-all duration-300"
            variants={cardVariants}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(34, 197, 94, 0.3)' }} // Green shadow
          >
            <div className="flex items-center">
              <DollarSign className="h-10 w-10 text-green-500 mr-4" />
              <div>
                <p className="text-3xl font-bold text-green-700">{data.totalBookings}</p>
                <p className="text-green-400 text-sm">Total Bookings</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Custom CSS for Animations */}
      <style >{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}