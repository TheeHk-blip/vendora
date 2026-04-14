import "dotenv/config";
import express, { type Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import compression from "compression";
import { PaymentRouter } from "./payments/payments.route.js";
import { PaymentCallbackRouter } from "./callbacks/payments.callbacks.route.js";
import { connectDB, initJobs } from "@vendora/db/*";

const app: Application = express();
const httpServer = createServer(app);
const PORT = process.env.PORT as string;

const allowedOrigins = [
  process.env.STORE_APP,
  process.env.SELLER_APP
]

const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
  }, 
  allowEIO3: true,
  pingTimeout: 60000
});

async function startServer() {
  try {
    await connectDB();
    console.log("DB connected");

    await initJobs(io);
    console.log("Simulation Engine Ready")

    app.set("io", io);
    app.use(compression())
    app.use(cors({ 
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true, 
      methods: ["GET", "POST", "OPTIONS"] 
    }));

    app.use((req, res, next) => {
      if (req.originalUrl === "/callbacks/stripe") {
        return next();
      } 
      express.json()(req, res, next);  
    });

    io.on("connection", (socket) => {
      socket.on("join-order-room", (orderId) => {
        socket.join(orderId);
        console.log(`User joined room: ${orderId}`)
      });

      socket.on("join-subscription-room", (sellerId) => {
        socket.join(sellerId);
        console.log(`Seller joined subscription room: ${sellerId}`)
      })
    });

    app.use("/payments", PaymentRouter);
    app.use("/callbacks", PaymentCallbackRouter);

    httpServer.listen(PORT, () => {
      console.log(`Standalone services running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
  }
}

startServer();



