
import csv
import paho.mqtt.client as mqtt
from flask import Flask
import time
import random
#hostname
broker="test.mosquitto.org"
#port
port=1883

def on_publish(client,userdata,result):
    print("Device 1 : Data published.")
    pass

def on_connect(client, userdata, flags, rc):
  print("Connected with result code "+str(rc))
  client.subscribe("/data")

def on_message(client, userdata, msg):
    print(msg.payload.decode())

app = Flask(__name__)

# data = []
# i = 0
# with open("./FishPond.csv") as file:
#     csv_reader = csv.DictReader(file)
#     for row in csv_reader:
#         data.append(row)
#     print('data', data[0])

client = mqtt.Client()
client.on_publish = on_publish
client.connect(broker,port)
client.on_connect = on_connect
client.on_message = on_message
client.loop_forever()
# client.connect("test.mosquitto.org", 1883)

for i in range(20):
    d=random.randint(1,5)
    
 #telemetry to send 
    message="Device 1 : Data " + str(i)
time.sleep(d)
    
#publish message
ret= client.publish("/data",message)

# @app.route("/send", methods=["GET"])
# def send():
#     client.publish("sensordata", "hello")
#     return "Message sent to mqtt", 200

@app.route("/", methods=["GET"])
def sendData():
    data = []
    with open("./FishPond.csv") as file:
      csv_reader = csv.DictReader(file)
      for row in csv_reader:
          data.append(row)
    return data, 200

# @app.route("/", methods=["GET"])
# def sendData():
#     global i
#     if i >= len(data):
#         i = 0
#     client.publish("sensordata", str(data[i]))
#     i += 1
#     return "Sending data...", 200

if __name__ == "__main__":
    app.run()
