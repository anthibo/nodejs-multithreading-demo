const { workerData, parentPort } = require("worker_threads");

let counter = 0;
const {thread_count} = workerData
console.log(thread_count)
for (let i = 0; i < 20_000_000_000/ thread_count; i++) {
  counter++;
}
parentPort.postMessage(counter);
