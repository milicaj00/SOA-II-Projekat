import csv
from flask import Flask
from flask_mqtt import Mqtt
import time

data = []

with open("./FishPond.csv") as file:
    csv_reader = csv.DictReader(file)
    for row in csv_reader:
          data.append(row)

app = Flask(__name__)

app.config['MQTT_BROKER_URL'] = 'broker.emqx.io'
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_USERNAME'] = ''  # Set this item when you need to verify username and password
app.config['MQTT_PASSWORD'] = ''  # Set this item when you need to verify username and password
app.config['MQTT_KEEPALIVE'] = 5  # Set KeepAlive time in seconds
app.config['MQTT_TLS_ENABLED'] = False  # If your server supports TLS, set it True
topic = '/flask/mqtt'

mqtt_client = Mqtt(app)

@mqtt_client.on_connect()
def handle_connect(client, userdata, flags, rc):
   if rc == 0:
       print('Connected successfully')
       mqtt_client.subscribe(topic) # subscribe topic
   else:
       print('Bad connection. Code:', rc)


@mqtt_client.on_message()
def handle_mqtt_message(client, userdata, message):
   data = dict(
       topic=message.topic,
       payload=message.payload.decode()
  )
#    print('Received message on topic: {topic} message : {payload}'.format(**data))

def sendData():
    i = 0
    while i < len(data):
        mqtt_client.publish(topic, str(data[i]))
        i += 1
        time.sleep(5)

    print("all data sent")

if __name__ == '__main__':
   sendData()
   app.run(host='127.0.0.1', port=5000)
   