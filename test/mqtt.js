const mqtt = require('mqtt')

var host = 'ws://localhost:9002'
const clientId = '5df84b48829bcb0006627187'

var options = {
  clientId: clientId,
  // username: '619e023e-91e9-491e-b6e8-78b87fe9133c',
  // password:
  //   'a6357184a4f4f7728bdc6fe88c76efb21abcc10aa4e3523048569f102c252438',
}

const client = mqtt.connect(host, options)
console.log('go')

client.on('error', function(err) {
  console.log(err)
  client.end()
})

client.on('connect', function() {
  console.log('client connected:' + clientId)
})

// client.subscribe(`/losant/${clientId}/state`)

// client.on('message', function(topic, message, packet) {
//   console.log(
//     'Received Message:= ' + message.toString() + '\nOn topic:= ' + topic,
//   )
// })

client.on('close', function() {
  console.log(clientId + ' disconnected')
})