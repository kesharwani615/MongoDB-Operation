import { parentPort } from "worker_threads";

parentPort.on("message", (limit) => {

    console.log("Worker Started");

    let sum = 0;

    for (let i = 0; i <= limit; i++) {
        sum += i;
    }

    console.log("Worker Finished");

    parentPort.postMessage(sum);

});