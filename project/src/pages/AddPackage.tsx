import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Package {
  title: string;
  destination: string;
  price: number | string; // Allow string to handle empty state
  duration: string;
  description: string;
  image: string;
}

export default function AddPackage() {
  const [packageData, setPackageData] = useState<Package>({
    title: '',
    destination: '',
    price: '', // Changed from 0 to '' to avoid default 0
    duration: '',
    description: '',
    image: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPackageData((prev) => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? '' : Number(value)) : value, // Handle empty string for price
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Ensure price is a number before submission
      const submissionData = {
        ...packageData,
        price: packageData.price === '' ? 0 : Number(packageData.price), // Default to 0 if empty on submit
      };
      await axios.post('http://localhost:5000/api/packages', submissionData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Package added successfully!');
      setPackageData({ title: '', destination: '', price: '', duration: '', description: '', image: '' });
    } catch (error) {
      console.error('Error adding package:', error);
      alert('Failed to add package');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-slate-200 font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-indigo-400/30 to-transparent filter blur-xl animate-glow"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-300 rounded-full mix-blend-overlay filter blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-slate-400 rounded-full mix-blend-overlay filter blur-2xl animate-float"></div>
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-2xl mx-auto py-16 px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-slate-300/40">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 text-center mb-8 tracking-tight drop-shadow-md">
            Craft Your Travel Package
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={inputVariants}>
              <input
                type="text"
                name="title"
                value={packageData.title}
                onChange={handleChange}
                placeholder="Package Title"
                className="w-full p-4 bg-slate-50/50 border border-indigo-200 rounded-lg text-indigo-800 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                required
              />
            </motion.div>

            <motion.div variants={inputVariants}>
              <input
                type="text"
                name="destination"
                value={packageData.destination}
                onChange={handleChange}
                placeholder="Destination"
                className="w-full p-4 bg-slate-50/50 border border-indigo-200 rounded-lg text-indigo-800 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                required
              />
            </motion.div>

            <motion.div variants={inputVariants} className="relative">
              <input
                type="number"
                name="price"
                value={packageData.price}
                onChange={handleChange}
                placeholder="Price in $"
                className="w-full p-4 bg-slate-50/50 border border-indigo-200 rounded-lg text-indigo-800 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 appearance-none"
                required
                min="0" // Prevent negative values
                step="0.01" // Allow decimals
              />
              
            </motion.div>

            <motion.div variants={inputVariants}>
              <input
                type="text"
                name="duration"
                value={packageData.duration}
                onChange={handleChange}
                placeholder="Duration (e.g., 5D/4N)"
                className="w-full p-4 bg-slate-50/50 border border-indigo-200 rounded-lg text-indigo-800 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                required
              />
            </motion.div>

            <motion.div variants={inputVariants}>
              <textarea
                name="description"
                value={packageData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-4 bg-slate-50/50 border border-indigo-200 rounded-lg text-indigo-800 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 h-36 resize-none"
                required
              />
            </motion.div>

            <motion.div variants={inputVariants}>
              <input
                type="url"
                name="image"
                value={packageData.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full p-4 bg-slate-50/50 border border-indigo-200 rounded-lg text-indigo-800 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-amber-600 text-white py-3 rounded-lg shadow-md hover:from-indigo-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all duration-300"
              whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(100, 116, 139, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              Add Package
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Custom CSS for Animations and Input Styling */}
      <style >{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        /* Remove number input arrows */
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] {
          -moz-appearance: textfield; /* Firefox */
        }
      `}</style>
    </div>
  );
}