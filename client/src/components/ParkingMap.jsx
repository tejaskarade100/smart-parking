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
  const selectedMarkerRef = useRef(null);
  const isInitialZoomRef = useRef(true);

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
        attribution: '© OpenStreetMap contributors'
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

        // Store reference to selected marker
        if (isSelected) {
          selectedMarkerRef.current = marker;
          // Add a highlight effect to selected marker
          if (marker._icon) {
            marker._icon.classList.add('selected-marker');
          }
        }

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
          className: `custom-popup ${isSelected ? 'selected-popup' : ''}`,
          maxWidth: 250,  // Reduced from 300
          minWidth: 200,  // Reduced from 250
          openAnimation: true,
          closeAnimation: true,
          offset: [0, -5]
        }).setContent(popupContent);

        marker.bindPopup(popup);
        
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
          
          onLocationSelect(location);
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