import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ParkingStatusVisualization = () => {
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState({
    daily: [],
    vehicleTypes: { twoWheeler: 0, fourWheeler: 0 },
    occupancyRate: { twoWheeler: 0, fourWheeler: 0 },
    dailyRevenue: []
  });
  const [selectedView, setSelectedView] = useState('daily'); // daily, weekly, monthly
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookingData();
  }, [user, selectedView]);

  const fetchBookingData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/admin/bookings/${user._id}`);
      const bookings = response.data;

      // Process bookings data
      const now = new Date();
      const processedData = processBookingsData(bookings, now);
      setBookingData(processedData);
    } catch (error) {
      console.error('Error fetching booking data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processBookingsData = (bookings, now) => {
    // Get dates for the selected time range
    const dates = Array.from({ length: 7 }, (_, i) => subDays(now, i))
      .reverse()
      .map(date => format(date, 'MMM dd'));

    // Initialize daily bookings count
    const dailyData = dates.map(date => ({
      date,
      total: 0,
      twoWheeler: 0,
      fourWheeler: 0
    }));

    // Process each booking
    let totalTwoWheeler = 0;
    let totalFourWheeler = 0;
    const revenueByDate = {};

    bookings.forEach(booking => {
      const bookingDate = format(new Date(booking.date), 'MMM dd');
      const dayData = dailyData.find(d => d.date === bookingDate);
      
      if (dayData) {
        dayData.total++;
        // Normalize vehicle type check to match BookingsList logic
        const vehicleType = booking.vehicleType?.toLowerCase().includes('four') ? 'four-wheeler' : 
                          booking.vehicleType?.toLowerCase().includes('two') ? 'two-wheeler' : 
                          booking.vehicle?.category?.toLowerCase().includes('four') ? 'four-wheeler' :
                          booking.vehicle?.category?.toLowerCase().includes('two') ? 'two-wheeler' :
                          booking.vehicleDetails?.category?.toLowerCase().includes('four') ? 'four-wheeler' :
                          booking.vehicleDetails?.category?.toLowerCase().includes('two') ? 'two-wheeler' :
                          'four-wheeler'; // default to four-wheeler if unspecified

        if (vehicleType === 'two-wheeler') {
          dayData.twoWheeler++;
          totalTwoWheeler++;
        } else {
          dayData.fourWheeler++;
          totalFourWheeler++;
        }

        // Track daily revenue
        const bookingTotal = parseFloat(booking.total) || 0;
        revenueByDate[bookingDate] = (revenueByDate[bookingDate] || 0) + bookingTotal;
      }
    });

    // Convert revenue data to array format matching dates
    const dailyRevenue = dates.map(date => ({
      date,
      amount: revenueByDate[date] || 0
    }));

    // Calculate occupancy rates
    const totalSpaces = {
      twoWheeler: parseInt(user?.twoWheelerSpaces) || 1,
      fourWheeler: parseInt(user?.fourWheelerSpaces) || 1
    };

    const occupancyRate = {
      twoWheeler: (totalTwoWheeler / (totalSpaces.twoWheeler * 7)) * 100,
      fourWheeler: (totalFourWheeler / (totalSpaces.fourWheeler * 7)) * 100
    };

    return {
      daily: dailyData,
      vehicleTypes: { twoWheeler: totalTwoWheeler, fourWheeler: totalFourWheeler },
      occupancyRate,
      dailyRevenue
    };
  };

  const dailyBookingsData = {
    labels: bookingData.daily.map(d => d.date),
    datasets: [
      {
        label: 'Two Wheeler',
        data: bookingData.daily.map(d => d.twoWheeler),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Four Wheeler',
        data: bookingData.daily.map(d => d.fourWheeler),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  };

  const vehicleTypeData = {
    labels: ['Two Wheeler', 'Four Wheeler'],
    datasets: [{
      data: [bookingData.vehicleTypes.twoWheeler, bookingData.vehicleTypes.fourWheeler],
      backgroundColor: [
        'rgba(53, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)'
      ],
      borderColor: [
        'rgba(53, 162, 235, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Parking Bookings Analysis'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6 space-y-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Parking Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('daily')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setSelectedView('weekly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Daily Bookings Line Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Booking Trends</h3>
              <div className="h-64">
                <Line data={dailyBookingsData} options={options} />
              </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Revenue Trends</h3>
              <div className="h-64">
                <Line
                  data={{
                    labels: bookingData.dailyRevenue.map(d => d.date),
                    datasets: [{
                      label: 'Daily Revenue (₹)',
                      data: bookingData.dailyRevenue.map(d => d.amount),
                      borderColor: 'rgb(34, 197, 94)',
                      backgroundColor: 'rgba(34, 197, 94, 0.5)',
                      tension: 0.4
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `Revenue: ₹${context.parsed.y.toFixed(2)}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '₹' + value;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Type Distribution */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Vehicle Distribution</h3>
              <div className="h-64">
                <Doughnut 
                  data={vehicleTypeData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Occupancy Rate */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Space Utilization</h3>
              <div className="h-64">
                <Bar
                  data={{
                    labels: ['Two Wheeler', 'Four Wheeler'],
                    datasets: [{
                      label: 'Occupancy Rate (%)',
                      data: [
                        bookingData.occupancyRate.twoWheeler,
                        bookingData.occupancyRate.fourWheeler
                      ],
                      backgroundColor: [
                        'rgba(53, 162, 235, 0.8)',
                        'rgba(255, 99, 132, 0.8)'
                      ]
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: value => `${value}%`
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ParkingStatusVisualization;
