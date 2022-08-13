const { Worker } = require("worker_threads");
const os = require('os')
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const numOfCpus = os.cpus().length;
const THREAD_COUNT = numOfCpus;

function createWorker() {
  return new Promise(function (resolve, reject) {
    const worker = new Worker("./four_workers.js", {
      workerData: { thread_count: THREAD_COUNT },
    });
    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (msg) => {
      reject(`An error ocurred: ${msg}`);
    });
  });
}

app.get("/non-blocking/", (req, res) => {
    res.status(200).send("This page is non-blocking");
});
app.get("/blocking", async (req, res) => {
    const worker = new Worker("./worker.js");
    worker.on("message", (data) => {
      res.status(200).send(`result is ${data}`);
    });
    worker.on("error", (msg) => {
      res.status(404).send(`An error occurred: ${msg}`);
    });});
app.get('/enhanced-blocking', async (req, res) => {
  const workerPromises = [];
  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromises.push(createWorker());
  }
  const thread_results = await Promise.all(workerPromises);
  const total = thread_results.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0)
  res.status(200).send(`result is ${total}`);
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});