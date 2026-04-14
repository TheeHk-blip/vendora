import { Agenda } from "agenda";
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

  agenda.define(`update-order-status`, async(job: any) => {
    const { orderId, buyerId, status } = job.attrs.data;
    await Order.findByIdAndUpdate(orderId, { status });

    io.to(buyerId).emit("order-status-update", {orderId, status});
    console.log(`[SIMULATION] Order ${orderId} updated to: ${status}`);
  });

  agenda.define(`cleanup-unattended-order`, async(job: any) => {
    const { orderId } = job.attrs.data;

    const order = await Order.findById(orderId);

    if (order && order.status === "awaitingCommitment") {
      await Order.findByIdAndDelete(orderId);
      console.log(`[CLEANUP] Order ${orderId} removed from DB due to inactivity.`);
    }
  })

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

  await agenda.schedule("in 45 minutes", "cleanup-unattended-order", {orderId})
};