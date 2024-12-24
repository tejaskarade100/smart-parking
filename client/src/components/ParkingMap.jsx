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

const ParkingMap = ({ locations, selectedLocation, onLocationSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

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
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [18.5204, 73.8567], // Default to Pune
        zoom: 14,
        scrollWheelZoom: true,
        zoomControl: true
      });

      // Add tile layer
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
          </div>
        </div>
      `;

      const popup = L.popup({
        closeButton: true,
        closeOnClick: false,
        className: 'custom-popup',
        maxWidth: 300,
        minWidth: 250
      }).setContent(popupContent);

      marker.bindPopup(popup);
      
      // Add click handler
      marker.on('click', () => {
        onLocationSelect(location);
      });

      // Store marker reference
      markersRef.current[location.name] = marker;
    });

    // Update map view if locations exist
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    // Handle selected location
    if (selectedLocation) {
      const marker = markersRef.current[selectedLocation.name];
      if (marker) {
        marker.openPopup();
        mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], 15);
      }
    }
  }, [locations, selectedLocation, onLocationSelect]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  );
};

export default ParkingMap;