import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface Package {
  _id: string;
  title: string;
  destination: string;
  price: number;
  image: string;
}

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/packages/featured');
        const data = await response.json();
        setFeaturedPackages(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching packages:', error);
        setFeaturedPackages([
          { _id: '1', title: 'Beach Getaway', destination: 'Maldives', price: 1200, image: 'https://via.placeholder.com/300x200' },
          { _id: '2', title: 'Mountain Retreat', destination: 'Himalayas', price: 800, image: 'https://via.placeholder.com/300x200' },
          { _id: '3', title: 'City Adventure', destination: 'New York', price: 1500, image: 'https://via.placeholder.com/300x200' },
        ]);
      }
    };
    fetchFeaturedPackages();
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
  };

  const globeVariants = {
    initial: { rotate: 0, scale: 0.8 },
    animate: { rotate: 360, scale: 1, transition: { duration: 20, repeat: Infinity, ease: 'linear' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-teal-50 to-cyan-100 font-sans overflow-hidden">
      {/* Hero Section with Parallax */}
      <div className="relative h-[700px] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')", // Horizon image
          }}
          initial={{ y: 0 }}
          animate={{ y: -50 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent"></div>
        </motion.div>

        {/* Animated Globe Element */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 z-0"
          variants={globeVariants}
          initial="initial"
          animate="animate"
        >
          <svg width="300" height="300" viewBox="0 0 100 100" fill="none" stroke="#ffffff" strokeWidth="0.5">
            <circle cx="50" cy="50" r="45" />
            <path d="M50 5a45 45 0 0 1 0 90" />
            <path d="M5 50h90" />
          </svg>
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <motion.h1
            className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            Journey Beyond Horizons
          </motion.h1>
          <motion.p
            className="mt-6 text-xl sm:text-2xl text-indigo-100 max#w-3xl drop-shadow-lg"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            Elevate your travel with curated, world-class experiences
          </motion.p>
          {!isLoggedIn && (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to="/signup"
                className="px-10 py-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 font-semibold text-lg border border-indigo-500/50"
              >
                Embark Now
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Featured Packages */}
      <motion.section
        className="py-20 px-6 relative z-10 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        // variants={sectionVariants}
      >
        <h2 className="text-4xl font-bold text-indigo-900 text-center mb-16 tracking-wide">Signature Travel Packages</h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPackages.map((pkg, index) => (
            <motion.div
              key={pkg._id}
              className="relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.2 }}
              whileHover={{ rotateX: 5, rotateY: 5 }}
            >
              <div className="relative">
                <img src={pkg.image} alt={pkg.title} className="w-full h-60 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <motion.div
                  className="absolute top-4 right-4 bg-indigo-500 text-white text-sm px-3 py-1 rounded-full"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  ${pkg.price}
                </motion.div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-indigo-800">{pkg.title}</h3>
                <p className="text-indigo-600 flex items-center mt-2">
                  <MapPin className="h-5 w-5 mr-2 text-indigo-500" /> {pkg.destination}
                </p>
                <Link
                  to={`/book-package/${pkg._id}`}
                  className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 font-medium shadow-md"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}