import { Router } from "express";
import { withWorker, withoutWorker } from "../controller/worker-thread/createWorker.js";
const router = Router();


router.get("/", (req, res) => {
    res.send("Server is running...");
});

// Without Worker Thread
router.get("/without-worker", withoutWorker);

// With Worker Thread
router.get("/with-worker", withWorker);


export default router;