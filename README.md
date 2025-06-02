# ⚡ Charging Stations Management Web App

A full-stack web application to manage electric vehicle charging stations, allowing authenticated users to perform CRUD operations. The app is built using **Node.js**, **Express**, **MongoDB**, and **Vue.js**, with **JWT authentication** for secure access.

---

## 🚀 Features

- 🔐 User Signup/Login with JWT Authentication
- 📄 Create, Read, Update, Delete (CRUD) Charging Stations
- 🌐 Responsive UI built with Vue 3
- 🛡️ Protected backend routes using JWT
- ⚙️ RESTful API with Express
- 🌍 Deployment-ready with environment variables

---

## 🔧 Technologies Used

### Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (JSON Web Tokens)
- dotenv
- CORS

### Frontend:
- Vue.js 3 with Composition API
- Axios
- Vue Router
- Vite

---

## 🔑 Environment Variables

### 📦 Backend `.env`
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
-----

## 🧪 Running Locally
### 1. Clone the repository:
      git clone https://github.com/your-username/charging-stations-app.git
      cd charging-stations-app

### 2. Setup Backend:
      cd backend
      npm install
      # Add your .env file
      npm start

### 3. Setup Frontend:
      cd ../frontend
      npm install
      # Add your .env file
      npm run dev


