### Steps:

#### 1. **Launch EC2 Instance & Install Kafka**

```bash
wget https://downloads.apache.org/kafka/3.5.1/kafka_2.13-3.5.1.tgz
tar -xvf kafka_2.13-3.5.1.tgz
```

#### 2. **Install Java**

```bash
java -version
sudo yum install java-1.8.0-openjdk
java -version
cd kafka_2.13-3.5.1
```

#### 3. **Start ZooKeeper**

```bash
bin/zookeeper-server-start.sh config/zookeeper.properties
```

#### 4. **Start Kafka Server**

Duplicate the session and run the following commands:

```bash
export KAFKA_HEAP_OPTS="-Xmx256M -Xms128M"
cd kafka_2.13-3.5.1
bin/kafka-server-start.sh config/server.properties
```

Modify the `server.properties` file for public IP access:

- **Option 1**: Use `vi` editor:
  ```bash
  vi config/server.properties
  ```

  Update the following line:
  ```properties
  advertised.listeners=PLAINTEXT://<Public_IP>:9092
  ```

- **Option 2**: Use `WinSCP` to edit `server.properties` and set the `advertised.listeners` property to your EC2 instance's public IP.

---

#### 5. **Create a Topic**

```bash
cd kafka_2.13-3.5.1
bin/kafka-topics.sh --create --topic demo_testing2 --bootstrap-server <Public_IP>:9092 --replication-factor 1 --partitions 1
```

---

#### 6. **Start a Producer**

```bash
bin/kafka-console-producer.sh --topic demo_testing2 --bootstrap-server <Public_IP>:9092
```

---

#### 7. **Start a Consumer**

Duplicate the session and run:

```bash
cd kafka_2.13-3.5.1
bin/kafka-console-consumer.sh --topic demo_testing2 --bootstrap-server <Public_IP>:9092
```

---

### Key Changes:
- Updated the Kafka version to **3.5.1** (latest LTS as of now).
- Updated the `wget` URL.
- Ensured the script remains compatible with the newer Kafka distributions.

If you want the absolute latest version or to verify LTS details, visit the [Kafka Downloads page](https://kafka.apache.org/downloads).