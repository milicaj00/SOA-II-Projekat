import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mqtt from "mqtt";
import csv from "csvtojson";
dotenv.config();

let client;
let data = [];
let i = 0;

csv()
  .fromFile("./FishPond.csv")
  .then((jsonObj) => {
    try {
      data = jsonObj;
    } catch (err) {
      console.log("err ", err);
    }
  });

(async () => {
  client = mqtt.connect("mtqq://test.mosquitto.org:1883");
  // mqtt.connect(this.host, { username: this.username, password: this.password });
  console.log("success");
})().catch((error) => {
  console.log("caught", error.message);
});

const app = express();
app.use(express.json());
app.use(cors());

client.on("connect", function () {
  try {
    client.subscribe("sensordata");
    // client.publish("sensordata", "Hello mqtt");
    console.log("subscribed");
  } catch (err) {
    console.log("err subscribe", err);
  }
});

client.on("message", function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.end();
});

client.on("error", function (err) {
  console.log("error", err);
});

app.get("/send", function (req, res) {
  client.publish("sensordata", "hello");
  res.status(200).send("Message sent to mqtt");
});

async function sendData(index) {
  try {
    client.publish("sensordata", JSON.stringify(data[index]));
    console.log("Message published");
    // app.get("/", (req, res) => res.send("Sending data... /n" + data));
  } catch (ex) {
    console.log(ex);
  }
}

setInterval(() => {
  if (i < data.length) sendData(i++);
}, 5000);

app.listen(8080, () => {
  console.log("Server is listening on port 8080.");
});

// docker-compose up --build
