import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Allowed origins setup (Naya Vercel URL yahan add kar diya hai)
const allowedOrigins = [
  "https://chat-app-frontend-1-gilt.vercel.app",
  "https://chat-app-frontend-seven-xi.vercel.app",
  "http://localhost:5173"
];

// Initialize socket.io server with strict CORS
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// Store online users
export const userSocketMap = {}; //{userId: socketId}

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
   
  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Express CORS Fix (Exact origins with credentials allowed)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Policy Blocked This Origin"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

const PORT = process.env.PORT || 5002;

// Server Listen first, then connect Database
server.listen(PORT, async () => {
  console.log("Server is running on PORT: " + PORT);
  await connectDB();
});

export default app;