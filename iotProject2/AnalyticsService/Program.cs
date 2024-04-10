using MQTTnet.Client;
using MQTTnet;
using System.Text;
using AnalyticsService;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Drawing;
using InfluxDB.Client;
using InfluxDB.Client.Api.Domain;
using InfluxDB.Client.Writes;
using System.Net.Sockets;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

var sensorDummyTopic = "sensor_dummy/values";
var eKuiperTopic = "eKuiper/anomalies"; // broker.emqx.io
string address = "192.168.0.29";
var port = 1883;
var client = InfluxDBClientFactory.Create(url: "http://192.168.0.29:8086", "bisenicct", "Tijana22!".ToCharArray());
int i = 1;

var mqttService = MqttService.Instance();

await mqttService.ConnectAsync(address, port);
await mqttService.SubsribeToTopicsAsync(new List<string> { sensorDummyTopic, eKuiperTopic });

async Task ApplicationMessageReceivedAsync(MqttApplicationMessageReceivedEventArgs e)
{
    string payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
    if (e.ApplicationMessage.Topic == sensorDummyTopic)
    {
        mqttService.PublishMessage("analytics/values", payload);
        return;
    }

    Console.WriteLine($"eKuiper send: {payload}");
    var data = (JObject)JsonConvert.DeserializeObject(payload);
    string entry_id = data.SelectToken("entry_id").Value<string>();
    string nitrate = data.SelectToken("NITRATE").Value<string>();
    await WriteToDatabase(nitrate, entry_id);
}

async Task WriteToDatabase(string nitrate, string id)
{
    var point = PointData
        .Measurement("NITRATE")
        .Tag("id", id)
        .Tag("NITRATE",nitrate)
        .Field("nitrate_value", nitrate)
        .Timestamp(DateTime.UtcNow, WritePrecision.Ns);

    await client.GetWriteApiAsync().WritePointAsync(point, "FishPond", "JoJoBi");
    Console.WriteLine($"Write in InfluxDb: nitrate_{i}");
    i++;
}

mqttService.AddApplicationMessageReceived(ApplicationMessageReceivedAsync);

while (true) ;