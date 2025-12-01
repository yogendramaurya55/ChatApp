import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import connectDB from "./lib/db.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { Server } from "socket.io";

//create express and http server
const app = express();
const server = http.createServer(app);

//Initialize scoket.io server
const io = new Server(server, {
  cors: { origin: "*" },
});

//store online user
const userScoketMap = {}; //{userId: scoketId}

//Scoket.io connection handler
io.on("connection", (scoket) => {
  const userId = scoket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) {
    userScoketMap[userId] = scoket.id;
  }

  //Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userScoketMap));

  scoket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userScoketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userScoketMap));
  });
});

//Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//routes setup
app.use("/api/status", (req, res) => {
  res.send("Server is Live");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

//Connect to MONGODB

await connectDB();

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}
//export server for vercel
export { io, userScoketMap};

export default server;
