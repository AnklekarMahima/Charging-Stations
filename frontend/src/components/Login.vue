<template>
  <div class="login-container">
    <h2 class="main-heading">Charging Stations</h2>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="input-group">
        <label for="username">Username</label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
          autocomplete="username"
          placeholder="Enter your username"
        />
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          placeholder="Enter your password"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="register-prompt">
        Don’t have an account?
        <router-link to="/register" class="register-link">Register</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      error: '',
    };
  },
  methods: {
    async handleLogin() {
      this.error = '';
      this.loading = true;
      try {
        const res = await axios.post('https://charging-stations-9su7.onrender.com/api/auth/login', {
          username: this.username,
          password: this.password,
        });
        const token = res.data.token;
        localStorage.setItem('token', token);
        alert('Login successful! Token saved.');
        this.$router.push('/chargers');
      } catch (err) {
        this.error =
          err.response?.data?.msg || 'Failed to login. Please try again.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 370px;
  margin: 60px auto;
  padding: 40px 32px 32px 32px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(0, 0, 0, 0.10);
  font-family: 'Inter', Arial, sans-serif;
  transition: box-shadow 0.2s;
}

.login-container:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14);
}

.main-heading {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #1a237e;
  letter-spacing: 1px;
  margin-bottom: 28px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 4px;
  font-weight: 500;
}

input {
  padding: 10px 12px;
  font-size: 1rem;
  border: 1.5px solid #e0e7ef;
  border-radius: 6px;
  outline: none;
  background: #f7fafd;
  transition: border 0.2s;
}

input:focus {
  border-color: #1976d2;
  background: #fff;
}

button {
  padding: 12px 0;
  font-size: 1.08rem;
  background: linear-gradient(90deg, #1976d2 60%, #43e97b 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(67, 233, 123, 0.07);
}

button:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}

.error {
  color: #e53935;
  background: #fff3f3;
  border-left: 4px solid #e53935;
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 6px;
  font-size: 0.98rem;
}

.register-prompt {
  text-align: center;
  font-size: 0.95rem;
  color: #374151;
  margin-top: 8px;
}

.register-link {
  color: #1976d2;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
}

.register-link:hover {
  text-decoration: underline;
}
</style>