import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MapPin, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const role = localStorage.getItem('role') || '';
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const navItems = {
    common: [{ path: '/', label: 'Home' }],
    user: [
      { path: '/packages', label: 'Packages' },
      { path: '/my-bookings', label: 'My Bookings' },
    ],
    hotelOwner: [
      { path: '/add-package', label: 'Add Package' },
      { path: '/hotel-bookings', label: 'Hotel Bookings' },
    ],
    admin: [
      { path: '/admin-dashboard', label: 'Dashboard' },
      { path: '/all-bookings', label: 'All Bookings' },
    ],
  };

  const items = [
    ...navItems.common,
    ...(role === 'user' ? navItems.user : []),
    ...(role === 'hotelOwner' ? navItems.hotelOwner : []),
    ...(role === 'admin' ? navItems.admin : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setIsOpen(false);
    navigate('/login');
  };

  const navLinkVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 }
    },
    open: { 
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <MapPin className="h-8 w-8 text-white group-hover:text-yellow-300" />
            </motion.div>
            <span className="ml-2 text-white font-bold text-xl tracking-tight group-hover:text-yellow-300 transition-colors duration-300">
              Travel Explorer
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {items.map((item) => (
                <motion.div
                  key={item.path}
                  variants={navLinkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-blue-100 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && (
                          <motion.span
                            layoutId="underline"
                            className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-300"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
              {token ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full text-sm font-medium text-white bg-red-500/20 hover:bg-red-500/40 transition-all duration-300"
                >
                  Logout
                </motion.button>
              ) : (
                <div className="flex space-x-1">
                  <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          isActive ? 'text-white bg-white/10' : 'text-blue-100 hover:text-white'
                        }`
                      }
                    >
                      Login
                    </NavLink>
                  </motion.div>
                  <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                    <NavLink
                      to="/signup"
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          isActive ? 'text-white bg-white/10' : 'text-blue-100 hover:text-white'
                        }`
                      }
                    >
                      Signup
                    </NavLink>
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-white hover:bg-white/10 transition-colors duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden bg-gradient-to-b from-blue-600 to-indigo-600"
          >
            <div className="px-2 pt-2 pb-3 space-y-2">
              {items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              {token ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-white bg-red-500/20 hover:bg-red-500/40 transition-all duration-300"
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-blue-100 hover:bg-white/10 hover:text-white'
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-blue-100 hover:bg-white/10 hover:text-white'
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    Signup
                  </NavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}