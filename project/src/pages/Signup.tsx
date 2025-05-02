import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    hotelName: '',
    hotelLocation: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signup', formData);
      console.log('Signup success:', response.data);
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Signup error:', error.response.data);
        setError(error.response.data.message || 'Signup failed');
      } else {
        console.error('Signup error:', error);
        setError('An unexpected error occurred');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const bgVariants = {
    initial: { opacity: 0.7, scale: 1.1 },
    animate: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: 'easeInOut' } },
  };

  return (
    <div className="min-h-screen flex overflow-hidden font-sans">
      {/* Left Side - Travel Background */}
      <motion.div
        className="hidden lg:block w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
        }}
        variants={bgVariants}
        initial="initial"
        animate="animate"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/70 to-transparent"></div>
        <div className="absolute bottom-12 left-12 text-white">
          <h1 className="text-5xl font-extrabold tracking-tight">Plan Your Next Adventure</h1>
          <p className="text-lg mt-3 opacity-85">Sign up to explore the world.</p>
        </div>
      </motion.div>

      {/* Right Side - Signup Form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
          {/* CardHeader */}
          <div className="space-y-1 text-center border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-teal-800">Create Account</h2>
            <p className="text-sm text-teal-600">
              Enter your information to create an account
            </p>
          </div>

          {/* CardContent */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence>
                {error && (
                  <motion.p
                    className="text-red-500 text-center text-sm bg-red-50 p-3 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-teal-700">Full Name</label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-teal-700">Email</label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-teal-700">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-400" />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-0 top-0 h-full px-3 text-teal-400 hover:text-teal-600 focus:outline-none"
                  >
                    {showPassword ? 
                      <EyeOff className="h-4 w-4" /> : 
                      <Eye className="h-4 w-4" />
                    }
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-teal-700">Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {['admin', 'hotelOwner', 'user'].map((r) => (
                    <motion.label
                      key={r}
                      className={`flex items-center justify-center p-2 rounded-lg cursor-pointer text-sm ${
                        formData.role === r ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r}
                        onChange={handleChange}
                        className="hidden"
                      />
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </motion.label>
                  ))}
                </div>
              </div>

              {formData.role === 'hotelOwner' && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="hotelName" className="text-sm font-medium text-teal-700">Hotel Name</label>
                    <input
                      id="hotelName"
                      type="text"
                      name="hotelName"
                      placeholder="Hotel Name"
                      value={formData.hotelName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="hotelLocation" className="text-sm font-medium text-teal-700">Hotel Location</label>
                    <input
                      id="hotelLocation"
                      type="text"
                      name="hotelLocation"
                      placeholder="Hotel Location"
                      value={formData.hotelLocation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              <div className="text-xs text-teal-600">
                By creating an account, you agree to our{' '}
                <Link to="#" className="text-teal-700 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="#" className="text-teal-700 hover:underline">
                  Privacy Policy
                </Link>
              </div>

              <motion.button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md transition-colors duration-200 font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Account
              </motion.button>
            </form>
          </div>

          {/* CardFooter */}
          <div className="p-6 border-t border-teal-200 flex justify-center">
            <div className="text-center text-sm text-teal-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-teal-700 font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}