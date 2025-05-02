import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';

interface Package {
  _id: string;
  title: string;
  destination: string;
  price: number;
  duration: string;
  image: string;
}

export default function PackageList() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrice, setFilterPrice] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/packages');
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setPackages([
          { _id: '1', title: 'Beach Getaway', destination: 'Maldives', price: 1200, duration: '5D/4N', image: 'https://via.placeholder.com/300x200' },
          { _id: '2', title: 'Mountain Retreat', destination: 'Himalayas', price: 800, duration: '4D/3N', image: 'https://via.placeholder.com/300x200' },
        ]);
      }
    };
    fetchPackages();
  }, []);

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) || pkg.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = filterPrice === 'all' || (filterPrice === 'low' ? pkg.price < 1000 : pkg.price >= 1000);
    return matchesSearch && matchesPrice;
  });

  const searchSuggestions = packages
    .filter((pkg) => (pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) || pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())) && searchTerm.length > 0)
    .slice(0, 5);

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const searchVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-teal-50 to-cyan-100 font-sans relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')", // Horizon image
        }}
        initial={{ y: 0 }}
        animate={{ y: -50 }}
        transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 bg-indigo-900/30 backdrop-blur-sm"></div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto py-20 px-6">
        {/* Header */}
        <motion.h1
          className="text-5xl sm:text-6xl font-extrabold text-white mb-12 text-center tracking-tight drop-shadow-2xl"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
         Explore Our Travel Packages
        </motion.h1>

        {/* Search and Filter */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 mb-16 relative"
          variants={searchVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-indigo-400" />
            <input
              type="text"
              placeholder="Search destinations or packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full pl-14 pr-6 py-4 bg-white/90 backdrop-blur-md border border-indigo-200 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-800 placeholder-indigo-300 transition-all duration-300"
            />
            {/* Search Suggestions */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <motion.div
                className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-indigo-200 z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {searchSuggestions.map((pkg) => (
                  <Link
                    key={pkg._id}
                    to={`/book-package/${pkg._id}`}
                    className="block px-4 py-2 text-indigo-700 hover:bg-indigo-50 transition-colors duration-200"
                  >
                    {pkg.title} - {pkg.destination}
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
          <select
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
            className="px-6 py-4 bg-white/90 backdrop-blur-md border border-indigo-200 rounded-full shadow-lg text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          >
            <option value="all">All Prices</option>
            <option value="low">Below $1000</option>
            <option value="high">Above $1000</option>
          </select>
        </motion.div>

        {/* Package Grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPackages.map((pkg, index) => (
            <motion.div
              key={pkg._id}
              className="relative bg-white/95 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-indigo-200/50 transform transition-all duration-500 hover:shadow-2xl"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05, rotateX: 8, rotateY: 8, z: 20 }}
            >
              <div className="relative">
                <img src={pkg.image} alt={pkg.title} className="w-full h-60 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <motion.div
                  className="absolute top-4 right-4 bg-indigo-500 text-white text-sm px-3 py-1 rounded-full shadow-md flex items-center"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <span>{pkg.duration}</span>
                  <span className="ml-2 font-bold">${pkg.price}</span>
                </motion.div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-indigo-800">{pkg.title}</h3>
                <p className="text-indigo-600 flex items-center mt-2">
                  <MapPin className="h-5 w-5 mr-2 text-indigo-500" /> {pkg.destination}
                </p>
                <Link
                  to={`/book-package/${pkg._id}`}
                  className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}