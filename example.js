"use strict";
const { Engine } = require("./engine");
const rules = require("./data/rules.json");
const Records = require("./data/facts_array.json");

// initialize with options
let options = {
  allowUndefinedFacts: true,
};

const successRecords = [];

//Worker Thread responsible for processing records
class Worker {
  #engine;
  constructor(rules, engineOptions) {
    this.#engine = new Engine(rules, engineOptions);
  }

  async run(iterator) {
    while (true) {
      const { value, done } = await iterator.next();
      if (done) {
        break;
      }
      const results = await this.#engine.run(value);
      // do something with results
      successRecords.push({
        Record: value,
        Actions: results.events,
        "Valid Conditions": results.results,
      });
    }
  }
}

// Convert Records array to an async iterator
async function* getDataFromQueue() {
  for (const record of Records) {
    yield record;
  }
}

// Advance Parallel Processing:
// Each call to iterator.next() returns the next item in the sequence.
// Since all workers share the same iterator, each next() call moves the iterator forward, and only one worker processes each record.
// This means each worker retrieves unique records in turn from the iterator, so no duplicate processing occurs.

const iterator = getDataFromQueue()[Symbol.asyncIterator]();

const promises = [];
const worker_count = 3; // Number of Workers/Threads
for (let i = 0; i < worker_count; i++) {
  promises.push(new Worker(rules, options).run(iterator));
}

(async () => {
  console.time("Engine Execution Time");
  await Promise.allSettled(promises);
  console.timeEnd("Engine Execution Time");
  console.log("Total Records Count:", successRecords.length);
  const fs = require("fs");
  fs.writeFileSync("data/output.json", JSON.stringify(successRecords, null, 2));
})();
