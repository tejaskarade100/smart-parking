import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchForm() {
  const [searchType, setSearchType] = useState('hourly')
  const [location, setLocation] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    if (location.trim()) {
      navigate('/dashboard', { state: { location: location.trim() } })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && location.trim()) {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="bg-gray-100 p-1 rounded-lg inline-flex">
        <button
          onClick={() => setSearchType('hourly')}
          className={`px-6 py-2 rounded-md text-sm ${
            searchType === 'hourly'
              ? 'bg-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Hourly/Daily
        </button>
        <button
          onClick={() => setSearchType('monthly')}
          className={`px-6 py-2 rounded-md text-sm ${
            searchType === 'monthly'
              ? 'bg-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Monthly
        </button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Where are you going?"
            className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E5EFF] focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          <input
            type="text"
            defaultValue="Dec, 22 9:00 PM - Dec, 23 12:00 AM"
            className="w-full px-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E5EFF] focus:border-transparent"
          />
        </div>

        <button 
          onClick={handleSearch}
          className="w-full py-2 bg-[#1E5EFF] hover:bg-[#1E5EFF]/90 text-white rounded-md"
        >
          Find Parking Spots
        </button>
      </div>
    </div>
  )
}

export default SearchForm