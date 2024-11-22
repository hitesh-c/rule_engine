To integrate Kafka with the rule engine for real-time processing, we can create a **Kafka module** that connects to the Kafka broker, listens to a specific topic, processes incoming messages using the rule engine, and produces results to an output topic. Here’s the updated solution:

---

### **Kafka Module**

#### **Dependencies**
Ensure you have the following dependencies installed:
```bash
npm install kafkajs
```

---

#### **Kafka Module** (`kafka.js`)
```javascript
"use strict";

const { Kafka } = require("kafkajs");
const Worker = require("./worker");
const rules = require("./data/rules.json");

// Kafka Configuration
const kafkaConfig = {
  clientId: "rule-engine-client",
  brokers: ["<EC2_PUBLIC_IP>:9092"], // Replace <EC2_PUBLIC_IP> with your EC2 Kafka broker IP
  topic: {
    input: "rule-engine-input",  // Input topic where records are received
    output: "rule-engine-output", // Output topic where results are sent
  },
};

// Options for the Rule Engine
const engineOptions = {
  allowUndefinedFacts: true,
};

class KafkaModule {
  constructor(config, rules, options) {
    this.kafka = new Kafka({ clientId: config.clientId, brokers: config.brokers });
    this.consumer = this.kafka.consumer({ groupId: `${config.clientId}-group` });
    this.producer = this.kafka.producer();
    this.worker = new Worker(rules, options);
  }

  async connect() {
    await this.consumer.connect();
    await this.producer.connect();
    console.log("Connected to Kafka Broker.");
  }

  async run() {
    await this.consumer.subscribe({ topic: kafkaConfig.topic.input, fromBeginning: true });

    console.log(`Subscribed to topic: ${kafkaConfig.topic.input}`);

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const record = JSON.parse(message.value.toString());
          const successRecords = [];

          // Process the record using the rule engine
          const results = await this.worker.run([record][Symbol.asyncIterator](), successRecords);

          // Send the processed results to the output topic
          const outputMessage = JSON.stringify({
            Record: record,
            Actions: successRecords[0]?.Actions || [],
            "Valid Conditions": successRecords[0]?.["Valid Conditions"] || [],
          });

          console.log("Processed Record:", outputMessage);

          await this.producer.send({
            topic: kafkaConfig.topic.output,
            messages: [{ value: outputMessage }],
          });

          console.log("Result sent to output topic.");
        } catch (err) {
          console.error("Error processing message:", err);
        }
      },
    });
  }

  async disconnect() {
    await this.consumer.disconnect();
    await this.producer.disconnect();
    console.log("Disconnected from Kafka Broker.");
  }
}

module.exports = KafkaModule;
```

---

#### **Main Script** (`main.js`)
```javascript
"use strict";

const KafkaModule = require("./kafka");
const rules = require("./data/rules.json");

(async () => {
  const kafkaModule = new KafkaModule(
    {
      clientId: "rule-engine-client",
      brokers: ["<EC2_PUBLIC_IP>:9092"], // Replace <EC2_PUBLIC_IP> with your EC2 Kafka broker IP
      topic: {
        input: "rule-engine-input", // Topic for incoming records
        output: "rule-engine-output", // Topic for processed results
      },
    },
    rules,
    { allowUndefinedFacts: true } // Options for the rule engine
  );

  try {
    console.time("Kafka Rule Engine Execution");

    await kafkaModule.connect();
    await kafkaModule.run();

    console.timeEnd("Kafka Rule Engine Execution");
  } catch (err) {
    console.error("Error in Kafka Rule Engine:", err);
  }

  // Graceful shutdown on exit
  process.on("SIGINT", async () => {
    await kafkaModule.disconnect();
    process.exit(0);
  });
})();
```

---

### **How It Works**

1. **Kafka Consumer**:
   - Subscribes to the input topic (`rule-engine-input`) to listen for new messages.
   - Processes each message with the rule engine.
   
2. **Kafka Producer**:
   - Sends the processed results to the output topic (`rule-engine-output`).

3. **Worker Integration**:
   - Uses the `Worker` class to run the rule engine for each record.

4. **Parallel Processing**:
   - Each record is processed asynchronously as it is received from the Kafka topic.

---

### **Setup Kafka Topics**
Before running, create the required Kafka topics:
```bash
bin/kafka-topics.sh --create --topic rule-engine-input --bootstrap-server <EC2_PUBLIC_IP>:9092 --replication-factor 1 --partitions 1
bin/kafka-topics.sh --create --topic rule-engine-output --bootstrap-server <EC2_PUBLIC_IP>:9092 --replication-factor 1 --partitions 1
```

---

### **Run the Application**
1. Start your Kafka broker on the EC2 instance.
2. Run the Kafka-powered rule engine:
   ```bash
   node main.js
   ```

3. Produce test messages to the `rule-engine-input` topic:
   ```bash
   bin/kafka-console-producer.sh --topic rule-engine-input --bootstrap-server <EC2_PUBLIC_IP>:9092
   ```

4. Consume processed results from the `rule-engine-output` topic:
   ```bash
   bin/kafka-console-consumer.sh --topic rule-engine-output --bootstrap-server <EC2_PUBLIC_IP>:9092
   ```

---

This implementation processes messages in real time using Kafka and integrates seamlessly with the rule engine.