import "dotenv/config";
import express, { type Application } from "express";
import cors from "cors";
import { PaymentRouter } from "./payments/payments.route.js";

const app: Application = express();
const PORT = 3005;

app.use(cors({origin: process.env.FRONTEND}));

app.use((req, res, next) => {
  if (req.originalUrl === "/payments/webhook") {
    return next();
  } 
  express.json()(req, res, next);  
});

app.use("/payments", PaymentRouter);

app.listen(PORT, () => {
  console.log(`Standalone services running on port ${PORT}`);
});