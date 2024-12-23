import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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

const ParkingMap = ({ locations, selectedLocation, onLocationSelect, onBookNow }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [18.5204, 73.8567], // Default to Pune
        zoom: 14, // More zoomed in city level
        scrollWheelZoom: true,
        zoomControl: true,
        dragging: true,
        doubleClickZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 13,
        attribution: ' OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add markers for each location
    locations.forEach(location => {
      const marker = L.marker([location.lat, location.lng], {
        riseOnHover: true,
        title: location.name
      }).addTo(mapInstanceRef.current);

      const popupContent = document.createElement('div');
      popupContent.className = 'custom-popup';
      popupContent.innerHTML = `
        <div class="p-3 min-w-[200px]">
          <h3 class="text-lg font-bold mb-2">${location.name}</h3>
          <div class="space-y-2">
            <p class="text-green-600 font-medium">${location.price}</p>
            <div class="text-sm text-gray-600">
              ${location.facilities.map(f => `
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>${f}</span>
                </div>
              `).join('')}
            </div>
            <button 
              class="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              onclick="window.bookNow('${location.name}')"
            >
              Book Now
            </button>
          </div>
        </div>
      `;

      const popup = L.popup({
        closeButton: true,
        closeOnClick: false,
        autoClose: true, // Close when clicking elsewhere
        className: 'custom-popup',
        maxWidth: 300,
        minWidth: 250
      }).setContent(popupContent);

      marker.bindPopup(popup);
      
      // Show popup on hover
      marker.on('mouseover', () => {
        marker.openPopup();
      });

      // Hide popup when mouse leaves
      marker.on('mouseout', () => {
        marker.closePopup();
      });

      // Handle click
      marker.on('click', () => {
        onLocationSelect(location);
        marker.openPopup();
      });

      markersRef.current[location.name] = marker;
    });

    // Only zoom to fit markers on first load with locations
    if (locations.length > 0 && isFirstLoadRef.current) {
      const group = new L.featureGroup(Object.values(markersRef.current));
      const bounds = group.getBounds();
      
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [100, 100], // Add padding around the bounds
        maxZoom: 13, // Limit max zoom to keep context
        minZoom: 11, // Don't zoom out too far
        animate: true,
        duration: 1
      });
      
      isFirstLoadRef.current = false;
    }

    // Just open popup for selected location without zooming
    if (selectedLocation) {
      const marker = markersRef.current[selectedLocation.name];
      if (marker) {
        marker.openPopup();
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, selectedLocation, onLocationSelect]);

  // Add global function for booking
  useEffect(() => {
    const handleMarkerClick = (locationName) => {
      const location = locations.find(loc => loc.name === locationName);
      if (location) {
        onLocationSelect(location);
        onBookNow(location);
      }
    };

    window.bookNow = handleMarkerClick;

    return () => {
      delete window.bookNow;
    };
  }, [locations, onLocationSelect, onBookNow]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default ParkingMap;