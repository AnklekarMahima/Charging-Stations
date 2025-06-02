<template>
  <div class="map-container">
    <div class="header-container">
      <h2 class="page-title">Charging Stations - Map View</h2>
      <router-link to="/chargers" class="list-view-btn">
        <button class="btn list-view">
          List View
        </button>
      </router-link>
    </div>
    <div id="map" class="map-view"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix Leaflet marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
});

export default {
  name: 'MapView',
  data() {
    return {
      map: null,
      markers: []
    };
  },
  methods: {
    async loadChargers() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/stations', {
          headers: { Authorization: `Bearer ${token}` }
        });

        res.data.forEach(charger => {
          const marker = L.marker([
            charger.location.latitude,
            charger.location.longitude
          ])
            .addTo(this.map)
            .bindPopup(`
              <div class="popup-content">
                <h3 class="popup-title">${charger.name}</h3>
                <p class="popup-detail"><strong>Status:</strong> ${charger.status}</p>
                <p class="popup-detail"><strong>Power:</strong> ${charger.powerOutput} kW</p>
                <p class="popup-detail"><strong>Connector:</strong> ${charger.connectorType}</p>
              </div>
            `);
          this.markers.push(marker);
        });

        if (res.data.length > 0) {
          const bounds = L.latLngBounds(
            res.data.map(c => [c.location.latitude, c.location.longitude])
          );
          this.map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (err) {
        console.error('Error loading chargers:', err);
      }
    }
  },
  mounted() {
    this.map = L.map('map').setView([20.5937, 78.9629], 5); // Center on India

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.loadChargers();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (this.map) {
        setTimeout(() => {
          this.map.invalidateSize();
        }, 100);
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', () => {
      if (this.map) {
        this.map.invalidateSize();
      }
    });
  }
};
</script>

<style scoped>
/* Base styles */
.map-container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  background: linear-gradient(90deg, #2563eb 60%, #43e97b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Map styles */
.map-view {
  width: 100%;
  height: 600px;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  background: white;
}

/* Button styles */
.btn {
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  border: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.list-view {
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.list-view:hover {
  background: linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%);
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Popup styles */
.popup-content {
  padding: 0.5rem;
}

.popup-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.popup-detail {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: #4a5568;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .map-view {
    height: 500px;
  }
}

@media (max-width: 768px) {
  .map-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .map-view {
    height: 400px;
  }
  
  .btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 640px) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .map-view {
    height: 350px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.25rem;
  }
  
  .map-view {
    height: 300px;
    border-radius: 0.5rem;
  }
  
  .btn {
    width: 100%;
    padding: 0.75rem;
  }
  
  .popup-title {
    font-size: 0.875rem;
  }
  
  .popup-detail {
    font-size: 0.75rem;
  }
}
</style>