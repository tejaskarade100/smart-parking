import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// Set default icon
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ParkingMap = ({ locations, selectedLocation, onLocationSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const selectedMarkerRef = useRef(null);
  const popupRef = useRef(null);
  const isInitialZoomRef = useRef(true);
  const { user } = useAuth();
  const [availableSpaces, setAvailableSpaces] = useState({
    twoWheeler: 0,
    fourWheeler: 0
  });

  // Effect to update popup content when availableSpaces changes
  useEffect(() => {
    if (popupRef.current && selectedMarkerRef.current) {
      const marker = selectedMarkerRef.current;
      const popup = marker.getPopup();
      if (popup) {
        popup.setContent(createPopupContent(selectedLocation));
        if (popup.isOpen()) {
          popup.update();
        }
      }
    }
  }, [availableSpaces, selectedLocation]);

  const createPopupContent = (location) => {
    const popupContent = document.createElement('div');
    popupContent.className = 'custom-popup';
    popupContent.innerHTML = `
      <div class="p-3 min-w-[250px]">
        <h3 class="text-lg font-bold mb-2">${location.name}</h3>
        <div class="space-y-2">
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">${location.accessHours || '24/7'}</span>
          </div>
          <div class="text-green-600 font-medium flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            ${location.price}
          </div>
          <div class="text-sm text-gray-600 mb-2">
            <div class="flex items-center justify-between border-b pb-1 mb-1">
              <span>Two Wheeler Spots:</span>
              <span class="font-semibold text-green-600">${availableSpaces.twoWheeler} available</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Four Wheeler Spots:</span>
              <span class="font-semibold text-green-600">${availableSpaces.fourWheeler} available</span>
            </div>
          </div>
          <div class="text-sm text-gray-600 border-t pt-2">
            <div class="font-medium mb-1">Security & Facilities:</div>
            ${location.securityMeasures?.map(measure => `
              <div class="flex items-center gap-1 mb-1">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>${measure}</span>
              </div>
            `).join('') || ''}
          </div>
          <div class="text-xs text-gray-500 mt-2">
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>For emergencies: ${location.emergencyContact || 'Contact admin'}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    return popupContent;
  };

  // Add function to fetch available spaces
  const fetchAvailableSpaces = async (location) => {
    try {
      console.log('Location data:', location);
      
      // Get admin ID from location
      const adminId = location.adminId;
      if (!adminId) {
        console.error('No admin ID found for location:', location);
        return;
      }

      // First get admin details
      const adminResponse = await api.get(`/admin/${adminId}`);
      const adminData = adminResponse.data;
      console.log('Admin data:', adminData);

      if (!adminData?.email) {
        console.error('No admin email found');
        return;
      }

      // Get admin stats
      console.log('Fetching stats for admin email:', adminData.email);
      const statsResponse = await api.get(`/admin/stats/${encodeURIComponent(adminData.email)}`);
      const statsData = statsResponse.data;
      console.log('Stats data:', statsData);

      // Get bookings to calculate active/completed counts
      const bookingsResponse = await api.get(`/admin/bookings/${adminId}`);
      const bookings = bookingsResponse.data;

      // Process bookings to calculate status
      const now = new Date();
      const processedBookings = bookings.map(booking => {
        const endDateTime = new Date(booking.endDateTime);
        return {
          ...booking,
          status: endDateTime > now ? 'Active' : 'Completed'
        };
      });

      // Filter active bookings
      const activeBookings = processedBookings.filter(b => b.status === 'Active');

      // Count active bookings by vehicle type
      const activeTwoWheelers = activeBookings.filter(b => 
        (b.vehicle?.category || b.vehicleDetails?.category) === 'two-wheeler'
      ).length;
      
      const activeFourWheelers = activeBookings.filter(b => 
        (b.vehicle?.category || b.vehicleDetails?.category) === 'four-wheeler'
      ).length;

      console.log('Active bookings count:', { 
        twoWheelers: activeTwoWheelers, 
        fourWheelers: activeFourWheelers 
      });

      // Calculate total spaces from admin data
      const totalTwoWheelerSpaces = parseInt(statsData.totalSpaces?.twoWheeler) || parseInt(location.twoWheelerSpaces) || 0;
      const totalFourWheelerSpaces = parseInt(statsData.totalSpaces?.fourWheeler) || parseInt(location.fourWheelerSpaces) || 0;
      
      console.log('Total spaces:', {
        twoWheelers: totalTwoWheelerSpaces,
        fourWheelers: totalFourWheelerSpaces
      });

      // Calculate available spaces by subtracting active bookings
      const availableTwoWheelerSpaces = Math.max(0, totalTwoWheelerSpaces - activeTwoWheelers);
      const availableFourWheelerSpaces = Math.max(0, totalFourWheelerSpaces - activeFourWheelers);

      console.log('Calculated available spaces:', {
        twoWheelers: availableTwoWheelerSpaces,
        fourWheelers: availableFourWheelerSpaces
      });

      setAvailableSpaces({
        twoWheeler: availableTwoWheelerSpaces,
        fourWheeler: availableFourWheelerSpaces
      });

    } catch (error) {
      console.error('Error fetching available spaces:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    // Cleanup function to handle map instance cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      // Initialize map centered on India
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [20.5937, 78.9629], // Center of India
        zoom: 5, // Show all of India
        scrollWheelZoom: true,
        zoomControl: true,
        zoomAnimation: true,
        markerZoomAnimation: true,
        fadeAnimation: true
      });

      // Add tile layer with expanded zoom range
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, // Increased max zoom
        minZoom: 3,  // Decreased min zoom
        attribution: ' OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    selectedMarkerRef.current = null;

    // If we have locations, zoom from India view to city view
    if (locations.length > 0 && isInitialZoomRef.current) {
      const validLocations = locations.filter(loc => loc.lat && loc.lng);
      if (validLocations.length > 0) {
        // First zoom out to India view (if not already there)
        mapInstanceRef.current.setView([20.5937, 78.9629], 5, {
          animate: true,
          duration: 1
        });

        // Then after a short delay, zoom to the city
        setTimeout(() => {
          const bounds = L.latLngBounds(validLocations.map(loc => [loc.lat, loc.lng]));
          mapInstanceRef.current.flyToBounds(bounds, {
            padding: [50, 50],
            maxZoom: 14,
            duration: 2,
            easeLinearity: 0.5
          });
        }, 1000);

        isInitialZoomRef.current = false;
      }
    }

    // Add markers for each location
    locations.forEach(location => {
      if (location.lat && location.lng) {
        const isSelected = selectedLocation?.name === location.name;
        
        const marker = L.marker([location.lat, location.lng], {
          riseOnHover: true,
          title: location.name,
          zIndexOffset: isSelected ? 1000 : 0
        }).addTo(mapInstanceRef.current);

        const popup = L.popup({
          closeButton: true,
          closeOnClick: false,
          className: `custom-popup ${isSelected ? 'selected-popup' : ''}`,
          maxWidth: 250,
          minWidth: 200,
          openAnimation: true,
          closeAnimation: true,
          offset: [0, -5]
        });

        // Set initial popup content
        popup.setContent(createPopupContent(location));
        marker.bindPopup(popup);
        
        // Store reference to selected marker
        if (isSelected) {
          selectedMarkerRef.current = marker;
          // Add a highlight effect to selected marker
          if (marker._icon) {
            marker._icon.classList.add('selected-marker');
          }
          // Fetch available spaces for selected location
          fetchAvailableSpaces(location);
        }

        // Store popup reference if this is the selected marker
        if (isSelected) {
          popupRef.current = popup;
        }

        marker.on('click', () => {
          // Remove highlight from previously selected marker
          Object.values(markersRef.current).forEach(m => {
            if (m._icon) {
              m._icon.classList.remove('selected-marker');
            }
          });
          
          // Add highlight to newly selected marker
          if (marker._icon) {
            marker._icon.classList.add('selected-marker');
          }
          
          // Update selected marker and popup references
          selectedMarkerRef.current = marker;
          popupRef.current = marker.getPopup();
          
          onLocationSelect(location);
          fetchAvailableSpaces(location);
        });

        markersRef.current[location.name] = marker;
      }
    });

    // Handle selected location with improved transition
    if (selectedLocation?.lat && selectedLocation?.lng) {
      const marker = markersRef.current[selectedLocation.name];
      if (marker) {
        // First pan to location
        mapInstanceRef.current.flyTo(
          [selectedLocation.lat, selectedLocation.lng],
          16,
          {
            animate: true,
            duration: 2,
            easeLinearity: 0.5
          }
        );

        // Open popup after pan completes
        setTimeout(() => {
          marker.openPopup();
        }, 2000);

        // Ensure marker is centered
        setTimeout(() => {
          const px = mapInstanceRef.current.project([selectedLocation.lat, selectedLocation.lng]);
          px.y -= mapInstanceRef.current.getSize().y / 4;
          mapInstanceRef.current.panTo(mapInstanceRef.current.unproject(px), {
            animate: true,
            duration: 1
          });
        }, 2200);
      }
    }
  }, [locations, selectedLocation, onLocationSelect]);

  // Add smooth zoom controls
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.on('zoomend', () => {
        const currentZoom = mapInstanceRef.current.getZoom();
        // Ensure markers scale smoothly with zoom
        Object.values(markersRef.current).forEach(marker => {
          const scale = Math.min(1 + (currentZoom - 13) * 0.1, 1.5);
          marker._icon.style.transform += ` scale(${scale})`;
        });
      });
    }
  }, []);

  // Update the styles
  const style = document.createElement('style');
  style.textContent = `
    .selected-marker {
      filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.8));
      transform-origin: bottom center;
      animation: bounce 0.5s ease-out;
      z-index: 1000 !important;
    }

    @keyframes bounce {
      0% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    }

    .selected-popup .leaflet-popup-content-wrapper {
      border: 2px solid #3b82f6;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
    }

    .leaflet-popup-content-wrapper {
      padding: 0.5rem;
      font-size: 0.9rem;
    }

    .leaflet-popup-content {
      margin: 0;
      min-width: 200px;
    }
  `;
  document.head.appendChild(style);

  return (
    <div className="relative w-full h-full" style={{ zIndex: 1 }}>
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  );
};

export default ParkingMap;