"use strict";

const Worker = require("./worker");
const rules = require("./data/rules.json");
const Records = require("./data/facts_array.json");
const fs = require("fs");

// Options for the Engine
const options = {
  allowUndefinedFacts: true,
};

// Convert Records array to an async iterator
async function* getDataFromQueue() {
  for (const record of Records) {
    yield record;
  }
}

(async () => {
  const successRecords = [];
  const iterator = getDataFromQueue()[Symbol.asyncIterator]();

  const workerCount = 3; // Number of Workers/Threads
  const promises = [];

  for (let i = 0; i < workerCount; i++) {
    promises.push(new Worker(rules, options).run(iterator, successRecords));
  }

  console.time("Engine Execution Time");
  await Promise.allSettled(promises);
  console.timeEnd("Engine Execution Time");

  console.log("Total Records Count:", successRecords.length);

  fs.writeFileSync("data/output.json", JSON.stringify(successRecords, null, 2));
})();
