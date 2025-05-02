import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Package {
  _id: string;
  title: string;
  destination: string;
  price: number;
  duration: string;
  description: string;
  image: string;
}

export default function BookPackage() {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [travelDate, setTravelDate] = useState('');

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/packages/${id}`);
        const data = await response.json();
        setPkg(data);
      } catch (error) {
        console.error('Error fetching package:', error);
      }
    };
    fetchPackage();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/bookings',
        { packageId: id, travelDate, userEmail: localStorage.getItem('email') },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Booking successful!');
      setTravelDate('');
    } catch (error) {
      console.error('Error booking package:', error);
      alert('Failed to book package');
    }
  };

  if (!pkg) return <div>Loading...</div>;

  return (
    <motion.div className="max-w-4xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img src={pkg.image} alt={pkg.title} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-2xl font-bold">{pkg.title}</h1>
          <p className="text-gray-600">{pkg.destination} - {pkg.duration}</p>
          <p className="text-blue-600 font-bold mt-2">${pkg.price}</p>
          <p className="mt-4">{pkg.description}</p>

          <form onSubmit={handleBooking} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Travel Date</label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}