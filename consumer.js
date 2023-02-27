//const Kafka = require("kafkajs").Kafka
const {Kafka} = require("kafkajs")

const kafka = new Kafka({
    "clientId": "myapp",
    "brokers" :["kafka:9092"]
})

const consumer = kafka.consumer({ groupId: 'test-group' });

console.log('hello.....!!!')

const run = async () => {
    console.log("Consumer Connecting.....")
        await consumer.connect()
        console.log("Consumer Connected!")
        
        await consumer.subscribe({
            "topic": "Users",
            "fromBeginning": true
        })
        
        await consumer.run({
            "eachMessage": async result => {
                console.log(`RVD Msg ${result.message.value} on partition ${result.partition}`)
            }
        })

}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))


const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      await consumer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})
