
# 🧑‍💼 Staff Task Manager

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing staff and their assigned tasks.  
Includes authentication, task assignment, file uploads, and real-time updates using Socket.IO.

---

## 🚀 Features

### ✅ **Staff & Authentication**
- Secure login with JWT
- Password hashing with bcrypt
- Role-based access (Admin / Staff)

### ✅ **Task Management**
- Create, update, assign, and delete tasks
- Track task status (Pending → In-Progress → Completed)
- Upload task attachments or staff profile images (Cloudinary)
- Real-time updates (notify staff instantly)

### ✅ **Real-Time System (Socket.IO)**
- Live task notifications
- Live task status updates
- Staff online/offline tracking

### ✅ **Frontend (React + Tailwind + DaisyUI)**
- Modern UI built with TailwindCSS & DaisyUI
- React Router v7 navigation
- Toast notifications
- Mobile responsive
- Uses Axios for API calls

### ✅ **Backend (Node.js + Express + MongoDB)**
- Fully RESTful API
- Secure routes with JWT middleware
- Cloudinary + Multer storage for uploads
- Mongoose models & validations
- Seeder for demo data

---

## 🏗️ Tech Stack

### **Frontend**
- React 19
- React Router 7
- Axios
- TailwindCSS + DaisyUI
- Socket.IO Client
- React Hot Toast
- JWT Decode

### **Backend**
- Node.js
- Express 5
- MongoDB + Mongoose
- JWT Authentication
- Multer + Cloudinary
- Socket.IO
- dotenv

---

## 📂 Folder Structure

```

staff-task-manager/
│
├── staff-task-backend/        # Backend (Node.js, Express, MongoDB)
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── seeder.js
│   ├── .env  (not committed)
│   ├── package.json
│
└── staff-task-frontend/       # Frontend (React)
├── src/
├── public/
├── tailwind.config.js
├── package.json

````

---

## 🔧 Installation & Setup

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/Projects-Kanyuy/staff-task-manager.git
cd staff-task-manager
````

---

## 🗄️ **Backend Setup**

```bash
cd staff-task-backend
npm install
```

### **Create a `.env` file**

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_new_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **Start backend**

```bash
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

## 🎨 **Frontend Setup**

```bash
cd ../staff-task-frontend
npm install
```

### **Start frontend**

```bash
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🧪 Database Seeder (Optional)

### Import sample data:

```bash
npm run seed:import
```

### Destroy sample data:

```bash
npm run seed:destroy
```

---

## 🔌 Real-Time Communication (Socket.IO)

The app uses:

* `socket.io` on the backend
* `socket.io-client` on the frontend

Used for:

* New task notifications
* Task updates
* Realtime syncing between staff and admin dashboard

---


