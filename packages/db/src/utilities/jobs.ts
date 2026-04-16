import { Agenda, type Job } from "agenda";
import { MongoBackend } from "@agendajs/mongo-backend";
import { clientPromise } from "#db/connection/client";
import Order from "#db/models/order";
import { Server } from "socket.io";

export let agenda: Agenda;

export const initJobs = async (io: Server) => {
  if (agenda) return agenda;

  const client = await clientPromise;
  const db = client.db();

  agenda = new Agenda({
    backend: new MongoBackend({
      mongo: db,
      collection: "Jobs"
    }),
    processEvery: "30 seconds"
  });

  agenda.define(`update-order-status`, async(job: Job<{
    orderId: string;
    buyerId: string;
    status: string
  }>) => {
    const { orderId, buyerId, status } = job.attrs.data;
    await Order.findByIdAndUpdate(orderId, { status });

    io.to(buyerId).emit("order-status-update", {orderId, status});
    console.log(`[SIMULATION] Order ${orderId} updated to: ${status}`);
  });

  agenda.define(`cleanup-unattended-order`, async(job: Job) => {    
    console.log("!!! CLEANUP TRIGGERED AT:", new Date().toISOString());
    const cutOffTime = new Date(Date.now() - 15 * 60 * 1000);

    const result = await Order.deleteMany({
      status: "awaitingCommitment",
      createdAt: { $lt: cutOffTime }
    });

    if (result.deletedCount > 0) {
      console.log(`[CLEANUP] Removed ${result.deletedCount} unattended orders due to inactivity`);
    } else {
      console.log(`[CLEANUP] No unattended orders found to clean up`)
    }
    
  });

  const collection = db.collection("Jobs");
  const result = await collection.updateMany(
    { lockedAt: { $exists: true } }, 
    { $set: { lockedAt: null } }
  );
  
  if (result.modifiedCount > 0) {
    console.log(`[AGENDA] Unlocked ${result.modifiedCount} stale jobs from previous run.`);
  }

  
  await agenda.start();
  
  console.log("Agenda simulation service started");
  return agenda;
};

export const startOrderLifeCycle = async (orderId: string, buyerId: string) => {
  if (!agenda) throw new Error("Agenda not initialized");

  await agenda.schedule("in 2 minutes", "update-order-status", {
    orderId,
    buyerId,
    status: "inTransit"
  });

  await agenda.schedule("in 5 minutes", "update-order-status", {
    orderId,
    buyerId,
    status: "delivered"
  });
  
  await agenda.every("1 minute", "cleanup-unattended-order", {}, { timezone: "UTC"});
};