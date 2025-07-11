import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Thermometer, Droplet, Leaf, AlertTriangle, Calendar, Clock } from 'lucide-react';

const FarmingDashboard = () => {
  // State for storing data
  const [weatherData, setWeatherData] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [plantRecommendations, setPlantRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [cautions, setCautions] = useState([]);

  // Dummy data for initial render (will be replaced by API calls)
  useEffect(() => {
    // Simulating API calls
    setTimeout(() => {
      // Weather data
      setWeatherData({
        today: { temp: 24, conditions: 'sunny', humidity: 45, chance_of_rain: 10 },
        week: { temp: 22, conditions: 'partly_cloudy', humidity: 50, chance_of_rain: 30 },
        month: { temp: 20, conditions: 'rainy', humidity: 60, chance_of_rain: 70 },
        year: { avg_temp: 18, conditions: 'varied', humidity: 55, seasonal_notes: 'Expect a mild winter' }
      });
      
      // Soil data
      setSoilData({
        humidity: 65,
        temperature: 18,
        moisture: 58
      });
      
      // Plant recommendations
      setPlantRecommendations([
        {
          id: 1,
          name: 'Wheat',
          confidence: 95,
          image: '/api/placeholder/120/120',
          planting_season: 'Now'
        },
        {
          id: 2,
          name: 'Corn',
          confidence: 82,
          image: '/api/placeholder/120/120',
          planting_season: 'In 2 weeks'
        }
      ]);
      
      // Cautions
      setCautions([
        'Watch for aphids due to rising temperatures',
        'Consider irrigation as rainfall is below normal',
        'Soil nitrogen levels may need supplementation'
      ]);
      
      setLoading(false);
    }, 1500);
  }, []);

  // Weather icon selector
  const getWeatherIcon = (condition) => {
    switch(condition) {
      case 'sunny':
        return <Sun size={40} className="text-yellow-500" />;
      case 'partly_cloudy':
        return <Cloud size={40} className="text-gray-400" />;
      case 'rainy':
        return <CloudRain size={40} className="text-blue-400" />;
      case 'snowy':
        return <CloudSnow size={40} className="text-blue-200" />;
      default:
        return <Cloud size={40} className="text-gray-400" />;
    }
  };

  // Format date
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="text-xl text-green-800 font-semibold">Loading your farming dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-4 font-sans">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Farmer's Friend Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{formatDate()}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Weather Forecast</h2>
          
          {/* Weather Period Selector */}
          <div className="flex space-x-2 mb-4">
            <button 
              onClick={() => setSelectedPeriod('today')}
              className={`px-4 py-2 rounded ${selectedPeriod === 'today' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              Today
            </button>
            <button 
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-2 rounded ${selectedPeriod === 'week' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              This Week
            </button>
            <button 
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded ${selectedPeriod === 'month' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              This Month
            </button>
            <button 
              onClick={() => setSelectedPeriod('year')}
              className={`px-4 py-2 rounded ${selectedPeriod === 'year' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              This Year
            </button>
          </div>
          
          {/* Weather Data Display */}
          <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              {getWeatherIcon(weatherData[selectedPeriod].conditions)}
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {selectedPeriod === 'year' ? 
                    `${weatherData[selectedPeriod].avg_temp}°C (avg)` : 
                    `${weatherData[selectedPeriod].temp}°C`}
                </div>
                <div className="text-gray-600 capitalize">
                  {weatherData[selectedPeriod].conditions.replace('_', ' ')}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end text-blue-700 mb-2">
                <Droplet className="mr-1" />
                <span>Humidity: {weatherData[selectedPeriod].humidity}%</span>
              </div>
              {selectedPeriod !== 'year' ? (
                <div className="text-blue-700">
                  Chance of Rain: {weatherData[selectedPeriod].chance_of_rain}%
                </div>
              ) : (
                <div className="text-blue-700">
                  {weatherData[selectedPeriod].seasonal_notes}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Soil Data Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Current Soil Conditions</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-amber-50 p-4 rounded-lg flex flex-col items-center">
              <Thermometer className="text-red-500 mb-2" size={32} />
              <div className="text-xl font-bold">{soilData.temperature}°C</div>
              <div className="text-gray-600">Soil Temp</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center">
              <Droplet className="text-blue-500 mb-2" size={32} />
              <div className="text-xl font-bold">{soilData.humidity}%</div>
              <div className="text-gray-600">Soil Humidity</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center">
              <Leaf className="text-green-500 mb-2" size={32} />
              <div className="text-xl font-bold">{soilData.moisture}%</div>
              <div className="text-gray-600">Soil Moisture</div>
            </div>
          </div>
        </div>

        {/* Plant Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Recommended Plantings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plantRecommendations.map(plant => (
              <div key={plant.id} className="border border-green-200 rounded-lg p-4 flex items-center">
                <img src={plant.image} alt={plant.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="ml-4">
                  <div className="font-bold text-lg">{plant.name}</div>
                  <div className="text-sm text-gray-600">Plant {plant.planting_season}</div>
                  <div className="text-sm text-green-700">Confidence: {plant.confidence}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cautions/Alerts */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-yellow-700 mb-4 flex items-center">
            <AlertTriangle className="mr-2 text-yellow-500" />
            Current Cautions
          </h2>
          <ul className="space-y-2">
            {cautions.map((caution, index) => (
              <li key={index} className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                {caution}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer with API Information */}
      <footer className="mt-6 text-center text-sm text-gray-600 p-4 bg-white rounded-lg shadow-md">
        <p>Connect to your preferred weather API endpoint at: <code className="bg-gray-100 px-2 py-1 rounded">/api/weather/forecast</code></p>
        <p className="mt-2">Connect to your AI plant prediction model at: <code className="bg-gray-100 px-2 py-1 rounded">/api/plants/recommend</code></p>
      </footer>
    </div>
  );
};

export default FarmingDashboard;
