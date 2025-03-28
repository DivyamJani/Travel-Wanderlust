import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import axios from 'axios';

export default function TravelLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError('Please select a role');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password, role });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', role);
      navigate('/');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const bgVariants = {
    initial: { opacity: 0.7, scale: 1.1 },
    animate: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: 'easeInOut' } },
  };

  return (
    <div className="min-h-screen flex overflow-hidden font-sans">
      {/* Left Side - Scenic Background */}
      <motion.div
        className="hidden lg:block w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
        }}
        variants={bgVariants}
        initial="initial"
        animate="animate"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/70 to-transparent"></div>
        <div className="absolute bottom-12 left-12 text-white">
          <h1 className="text-5xl font-extrabold tracking-tight">Embark on Your Journey</h1>
          <p className="text-lg mt-3 opacity-85">Your adventure starts here.</p>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-4xl font-extrabold text-teal-800 text-center mb-6 tracking-wide">
            Embark on Your Journey
          </h2>
          <AnimatePresence>
            {error && (
              <motion.p
                className="text-orange-600 text-center mb-6 font-medium bg-orange-100 p-3 rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-10 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder-teal-400 transition-all duration-300"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500">✉️</span>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-10 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder-teal-400 transition-all duration-300"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500">🔒</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-teal-700">
              {['admin', 'hotelOwner', 'user'].map((r) => (
                <motion.label
                  key={r}
                  className={`flex items-center justify-center p-2 rounded-lg cursor-pointer ${
                    role === r ? 'bg-teal-600 text-white' : 'bg-teal-50 hover:bg-teal-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    onChange={(e) => setRole(e.target.value)}
                    className="hidden"
                  />
                  {r === 'admin' ? 'Explorer' : r === 'hotelOwner' ? 'Host' : 'Traveler'}
                </motion.label>
              ))}
            </div>
            <motion.button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors duration-300 font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Adventure
            </motion.button>
          </form>
          <p className="text-center text-teal-600 mt-4 text-sm">
            New here?{' '}
            <a href="/signup" className="underline hover:text-teal-800">
              Plan your first trip!
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}