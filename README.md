# WhatsApp Clone

A full-stack real-time chat application inspired by WhatsApp, built using the MERN stack and Socket.io.

---

   Features

-  User Authentication (Register/Login)
-  Real-time Messaging (Socket.io)
-  Chat History & Message Persistence (MongoDB)
-  Protected Routes for Authenticated Users
-  Clean UI with React + Plain CSS
-  Responsive Design (Mobile-friendly)
-  User List Sidebar with Avatars
-  Message Input with Send/Clear
-  Time/Date Display in Messages

---

## Tech Stack

### Frontend:
- React
- Plain CSS
- Axios
- React Router DOM

### Backend:
- Node.js
- Express
- MongoDB + Mongoose
- Socket.io
- JWT for Authentication
- bcrypt for Password Hashing
- CORS, dotenv## Deployment

### Backend Deployment (e.g., Render, Railway, Heroku)

1. **Environment Variables**: Set the following in your deployment platform:
   - `DATABASE_URL`: Your MongoDB connection string.
   - `JWT_SECRET_KEY`: A strong secret key for JWT.
   - `FRONTEND_URL`: The URL where your frontend is deployed (e.g., `https://your-app.vercel.app`).
   - `NODE_ENV`: Set to `production`.
   - `PORT`: Usually handled by the platform (Render expects `5000` or uses its own).
   - `COOKIE_EXPIRE`: Number of days for cookie expiry (e.g., `5`).
   - `JWT_EXPIRE`: JWT expiry time (e.g., `5d`).

2. **Build & Start**:
   - Build Command: `npm install`
   - Start Command: `npm start`

### Frontend Deployment (e.g., Vercel, Netlify, Render)

1. **Environment Variables**:
   - `REACT_APP_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.onrender.com`).

2. **Build & Start**:
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `build`

---

## Getting Started Locally

1. Clone the repository.
2. In the `backend` folder, create a `.env` file based on `.env.example`.
3. Run `npm install` and `npm run dev` in the `backend` folder.
4. In the `frontend` folder, run `npm install` and `npm start`.
