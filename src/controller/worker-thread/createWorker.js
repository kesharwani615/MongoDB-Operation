import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const withoutWorker = (req, res) => {

    console.log("Heavy calculation started...");

    let sum = 0;

    for (let i = 0; i <= 10000000000; i++) {
        sum += i;
    }

    console.log("Calculation finished");

    res.json({
        message: "Without Worker Thread",
        sum
    });

}

export const withWorker = (req, res) => {

    console.log("Creating Worker...");

    const worker = new Worker(path.join(__dirname, "worker.js"));

    worker.postMessage(10000000000);

    worker.on("message", (result) => {

        res.json({
            message: "With Worker Thread",
            sum: result
        });

        worker.terminate();
    });

    worker.on("error", (err) => {
        console.log(err);
        res.status(500).send(err.message);
    });

}
