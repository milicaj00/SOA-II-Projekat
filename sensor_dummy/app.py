import os
import csv
import paho.mqtt.client as mqtt
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

data = []
i = 0
with open("./FishPond.csv") as file:
    csv_reader = csv.DictReader(file)
    for row in csv_reader:
        data.append(row)

client = mqtt.Client()
client.connect("test.mosquitto.org", 1883)

@app.route("/send", methods=["GET"])
def send():
    client.publish("sensordata", "hello")
    return "Message sent to mqtt", 200

@app.route("/", methods=["GET"])
def sendData():
    global i
    if i >= len(data):
        i = 0
    client.publish("sensordata", str(data[i]))
    i += 1
    return "Sending data...", 200

if __name__ == "__main__":
    app.run()
