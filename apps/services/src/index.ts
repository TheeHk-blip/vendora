import "dotenv/config";
import express, { type Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import compression from "compression";
import { PaymentRouter } from "./payments/payments.route.js";
import { connectDB } from "@vendora/db";

await connectDB();

const app: Application = express();
const httpServer = createServer(app);
const PORT = 3005;

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND,
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
  }, 
  allowEIO3: true,
  pingTimeout: 60000
});

app.set("io", io);

app.use(compression())
app.use(cors({ origin: process.env.FRONTEND, credentials: true, methods: ["GET", "POST", "OPTIONS"] }));

app.use((req, res, next) => {
  if (req.originalUrl === "/payments/webhook") {
    return next();
  } 
  express.json()(req, res, next);  
});

io.on("connection", (socket) => {
  socket.on("join-order-room", (orderId) => {
    socket.join(orderId);
    console.log(`User joined room: ${orderId}`)
  });
});

app.use("/payments", PaymentRouter);

httpServer.listen(PORT, () => {
  console.log(`Standalone services running on port ${PORT}`);
});