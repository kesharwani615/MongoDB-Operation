import { Queue } from "bullmq";
import connection from "../config/redis.js";

// Gmail-friendly rate limit: ~20 emails/minute to reduce spam flags
export const emailQueue = new Queue("emailQueue", {
    connection,

    limiter: {
        max: 20,
        duration: 60_000,
    },
});