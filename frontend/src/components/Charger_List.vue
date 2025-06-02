<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Charging Stations</h2>

    <!-- Add New Charger Form -->
    <div class="mb-6 bg-white p-6 rounded shadow-md">
      <form @submit.prevent="addCharger" class="grid">
        <div>
          <label>Name</label>
          <input
            v-model="newCharger.name"
            type="text"
            class="form-input"
            required
          />
        </div>
        <div>
          <label>Latitude</label>
          <input
            v-model.number="newCharger.location.latitude"
            type="number"
            class="form-input"
            required
          />
        </div>
        <div>
          <label>Longitude</label>
          <input
            v-model.number="newCharger.location.longitude"
            type="number"
            class="form-input"
            required
          />
        </div>
        <div class="status-field">
          <label>Status</label>
          <select v-model="newCharger.status" class="form-input" required>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label>Power Output</label>
          <input
            v-model.number="newCharger.powerOutput"
            type="number"
            class="form-input"
            required
          />
        </div>
        <div>
          <label>Connector Type</label>
          <input
            v-model="newCharger.connectorType"
            type="text"
            class="form-input"
            required
          />
        </div>
        <div>
          <button type="submit">Add Charger</button>
        </div>
      </form>
    </div>

    <!-- Filters -->
    <div class="filters-container">
      <h3 class="filter-heading">Filter by</h3>
      <div>
        <label class="block font-semibold mb-1">Status</label>
        <select v-model="filters.status" class="filter-input">
          <option value="">All</option>
          <option
            v-for="status in uniqueStatuses"
            :key="status"
            :value="status"
          >
            {{ status }}
          </option>
        </select>
      </div>

      <div>
        <label class="block font-semibold mb-1">Power Output (kW)</label>
        <select v-model="filters.powerOutput" class="filter-input">
          <option value="">All</option>
          <option
            v-for="power in uniquePowerOutputs"
            :key="power"
            :value="power"
          >
            {{ power }}
          </option>
        </select>
      </div>

      <div>
        <label class="block font-semibold mb-1">Connector Type</label>
        <select v-model="filters.connectorType" class="filter-input">
          <option value="">All</option>
          <option
            v-for="type in uniqueConnectorTypes"
            :key="type"
            :value="type"
          >
            {{ type }}
          </option>
        </select>
      </div>
    </div>

    <router-link to="/map">
      <button class="map-view-btn">Map View</button>
    </router-link>

    <!-- Table -->
    <div v-if="loading">Loading...</div>
    <div v-else-if="filteredChargers.length === 0">No chargers found.</div>

    <div class="table-container" v-else>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Status</th>
            <th>Power Output</th>
            <th>Connector Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="charger in filteredChargers" :key="charger._id">
            <template v-if="editingId === charger._id">
              <td data-label="Name"><input v-model="editForm.name" class="edit-input" /></td>
              <td data-label="Location">
                <input
                  v-model.number="editForm.location.latitude"
                  class="coord-input"
                />
                ,
                <input
                  v-model.number="editForm.location.longitude"
                  class="coord-input"
                />
              </td>
              <td data-label="Status">
                <select v-model="editForm.status" class="edit-input">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </td>
              <td data-label="Power Output">
                <input
                  v-model.number="editForm.powerOutput"
                  class="edit-input"
                />
              </td>
              <td data-label="Connector Type">
                <input v-model="editForm.connectorType" class="edit-input" />
              </td>
              <td data-label="Actions">
                <div class="button-group">
                    <button @click="saveEdit(charger._id)" class="save-btn">
                        Save
                    </button>
                    <button @click="cancelEdit" class="cancel-btn">Cancel</button>
                </div>
              </td>
            </template>
            <template v-else>
              <td data-label="Name">{{ charger.name }}</td>
              <td data-label="Location">
                {{ charger.location.latitude }},
                {{ charger.location.longitude }}
              </td>
              <td data-label="Status">{{ charger.status }}</td>
              <td data-label="Power Output">{{ charger.powerOutput }} kW</td>
              <td data-label="Connector Type">{{ charger.connectorType }}</td>
              <td data-label="Actions">
                <div class="button-group">
                  <button @click="editCharger(charger)" class="edit-btn">
                    Edit
                  </button>
                  <button
                    @click="deleteCharger(charger._id)"
                    class="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ChargerList",
  data() {
    return {
      chargers: [],
      loading: true,
      showMap: false,
      editingId: null,
      editForm: {
        name: "",
        location: { latitude: 0, longitude: 0 },
        status: "Active",
        powerOutput: 0,
        connectorType: "",
      },
      filters: {
        status: "",
        powerOutput: "",
        connectorType: "",
      },
      newCharger: {
        name: "",
        location: { latitude: 0, longitude: 0 },
        status: "Active",
        powerOutput: 0,
        connectorType: "",
      },
    };
  },
  computed: {
    filteredChargers() {
      return this.chargers.filter((charger) => {
        const matchesStatus =
          this.filters.status === "" || charger.status === this.filters.status;
        const matchesPower =
          this.filters.powerOutput === "" ||
          charger.powerOutput == this.filters.powerOutput;
        const matchesConnector =
          this.filters.connectorType === "" ||
          charger.connectorType === this.filters.connectorType;
        return matchesStatus && matchesPower && matchesConnector;
      });
    },
    uniqueStatuses() {
      return [...new Set(this.chargers.map((c) => c.status))];
    },
    uniquePowerOutputs() {
      return [...new Set(this.chargers.map((c) => c.powerOutput))].sort(
        (a, b) => a - b
      );
    },
    uniqueConnectorTypes() {
      return [...new Set(this.chargers.map((c) => c.connectorType))];
    },
  },
  methods: {
    async fetchChargers() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://charging-stations-9su7.onrender.com/api/stations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.chargers = res.data;
      } catch (err) {
        console.error("Failed to fetch chargers:", err);
      } finally {
        this.loading = false;
      }
    },
    async addCharger() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          "https://charging-stations-9su7.onrender.com/api/stations",
          this.newCharger,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.chargers.push(res.data);
        // Reset form
        this.newCharger = {
          name: "",
          location: { latitude: 0, longitude: 0 },
          status: "Active",
          powerOutput: 0,
          connectorType: "",
        };
      } catch (err) {
        console.error("Failed to add charger:", err);
        alert("Error adding charger. Please try again.");
      }
    },
    async deleteCharger(id) {
      if (!confirm("Are you sure you want to delete this charger?")) return;
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://charging-stations-9su7.onrender.com/api/stations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.chargers = this.chargers.filter((c) => c._id !== id);
      } catch (err) {
        console.error("Failed to delete charger:", err);
      }
    },
    editCharger(charger) {
      this.editingId = charger._id;
      this.editForm = {
        name: charger.name,
        location: { ...charger.location },
        status: charger.status,
        powerOutput: charger.powerOutput,
        connectorType: charger.connectorType,
      };
    },
    cancelEdit() {
      this.editingId = null;
      this.editForm = {
        name: "",
        location: { latitude: 0, longitude: 0 },
        status: "Active",
        powerOutput: 0,
        connectorType: "",
      };
    },
    async saveEdit(id) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(
          `https://charging-stations-9su7.onrender.com/api/stations/${id}`,
          this.editForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const idx = this.chargers.findIndex((c) => c._id === id);
        if (idx !== -1) this.chargers[idx] = res.data;
        this.cancelEdit();
      } catch (err) {
        console.error("Failed to update charger:", err);
      }
    },
  },
  mounted() {
    this.fetchChargers();
  },
};
</script>

<style scoped>
/* Base styles */
.p-4 {
  padding: 1rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%);
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
}

h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2.5rem;
  color: #22223b;
  background: linear-gradient(90deg, #2563eb 30%, #7c3aed 100%);
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Form styles */
.mb-6.bg-white.p-6.rounded.shadow-md {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

form.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  margin-top: 0.25rem;
}

form button[type="submit"] {
  background: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  margin-top: 1.5rem;
}

/* Filter styles */
.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.filter-heading {
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #3730a3;
}

.filter-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  min-width: 150px;
  margin: 1rem;
}

/* Button styles */

.map-view-btn {
  background: linear-gradient(90deg, #2563eb 60%, #7c3aed 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  margin-bottom: 1.5rem;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.05rem;
  margin-left: 1rem;
}

/* Table styles */
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background: #f3f4f6;
  font-weight: 600;
}

/* Edit form styles */
.edit-input {
  width: 100%;
  padding: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
}

.coord-input {
  width: 80px;
  padding: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
}

/* Button styles */
.button-group {
  display: flex;
  gap: 1.0rem;
}

.edit-btn,
.save-btn {
  background: #2563eb;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
}

.delete-btn,
.cancel-btn {
  background: #dc2626;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
}

/* Responsive table */
@media (max-width: 768px) {
  form.grid {
    grid-template-columns: 1fr;
  }

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
  }

  td {
    border: none;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    position: absolute;
    left: 0.5rem;
    width: 45%;
    padding-right: 0.5rem;
    white-space: nowrap;
    content: attr(data-label);
    font-weight: 600;
    color: #3730a3;
  }
}

@media (max-width: 480px) {
  .filters-container {
    flex-direction: column;
  }

  .filter-input {
    width: 100%;
  }

  td:before {
    width: 40%;
  }
}
</style>
