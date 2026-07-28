import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import nodemailer from "nodemailer";
import connection from "../config/redis.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, html, text, attachments } = job.data;

    console.log(`📩 Sending email to ${to} (job: ${job.name})`);

    const info = await transporter.sendMail({
      from: `"Shivam Kesharwani" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
      html,
      attachments: attachments || [],
    });

    console.log(`✅ Email sent to ${to}`, info.response);
    return { messageId: info.messageId, to };
  },
  {
    connection,
    concurrency: 5,
  }
);

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Email job failed for ${job?.data?.to}:`, err.message);
});

emailWorker.on("completed", (job) => {
  console.log(`🎉 Email job completed for ${job?.data?.to}`);
});

console.log("📬 Email worker started");
