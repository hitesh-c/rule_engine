"use strict";

const { Engine } = require("./engine");

class Worker {
  #engine;

  constructor(rules, engineOptions) {
    this.#engine = new Engine(rules, engineOptions);
  }

  async run(iterator, successRecords) {
    while (true) {
      const { value, done } = await iterator.next();
      if (done) {
        break;
      }
      const results = await this.#engine.run(value);

      // Store processed records
      successRecords.push({
        Record: value,
        Actions: results.events,
        "Valid Conditions": results.results,
      });
    }
  }
}

module.exports = Worker;
