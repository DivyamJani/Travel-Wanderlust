import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, User, Calendar } from 'lucide-react';

interface Package {
  _id: string;
  title: string;
  destination: string;
  price: number;
  image: string;
}

interface BookingForm {
  fullName: string;
  creditCardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function Booking() {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState<BookingForm>({
    fullName: '',
    creditCardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/packages/${packageId}`);
        const data = await response.json();
        setSelectedPackage(data);
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Failed to load package details');
      }
    };
    fetchPackage();
  }, [packageId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Basic form validation
      if (!formData.fullName || !formData.creditCardNumber || !formData.expiryDate || !formData.cvv) {
        throw new Error('Please fill in all fields');
      }

      // In a real application, you'd want to:
      // 1. Validate credit card number format
      // 2. Validate expiry date
      // 3. Validate CVV length
      // 4. Encrypt sensitive data before sending

      const bookingData = {
        packageId,
        userId: localStorage.getItem('userId'), // Assuming you store userId in localStorage after login
        ...formData,
        bookingDate: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      // On success, redirect to confirmation page or home
      navigate('/booking-confirmation', { 
        state: { 
          packageTitle: selectedPackage?.title,
          destination: selectedPackage?.destination,
          price: selectedPackage?.price
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during booking');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPackage && !error) {
    return <div className="text-center mt-10">Loading package details...</div>;
  }

  return (
    <motion.div 
      className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Book Your Trip</h1>
      
      {selectedPackage && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold">{selectedPackage.title}</h2>
          <p className="text-gray-600">Destination: {selectedPackage.destination}</p>
          <p className="text-blue-600 font-bold">Price: ${selectedPackage.price}</p>
        </div>
      )}

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="mt-1 relative">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border rounded-md"
                placeholder="John Doe"
                required
              />
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Credit Card Number</label>
            <div className="mt-1 relative">
              <input
                type="text"
                name="creditCardNumber"
                value={formData.creditCardNumber}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border rounded-md"
                placeholder="1234 5678 9012 3456"
                required
              />
              <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  placeholder="MM/YY"
                  required
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="123"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}