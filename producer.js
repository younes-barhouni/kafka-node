//const Kafka = require("kafkajs").Kafka
const {Kafka, Partitioners} = require("kafkajs");

const kafka = new Kafka({
    "clientId": "myapp",
    "brokers" :["kafka:9092"]
})




function getRandomName() {
    const categories = ['CAT', 'DOG', 'Amal', 'Johanna', 'Younes'];
    return categories[Math.floor(Math.random() * categories.length)];
}

const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
console.log("Producer Connecting.....");


async function sendMessage(){
    const name = getRandomName();
    //A-M 0 , N-Z 1 
    const partition = name[0] < "N" ? 0 : 1;
    const result =  await producer.send({
        "topic": "Users",
        "messages": [
            {
                "value": name,
                "partition": partition
            }
        ]
    })

    console.log(`Send Successfully! ${JSON.stringify(result)}`)

}

const run = async () => {
    await producer.connect();
    console.log("Producer Connected!")
    setInterval(sendMessage, 6000)
}

// setInterval(() => {
//     run();
// }, 9000);

run().catch(e => console.error(`[example/producer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
  process.on(type, async () => {
    try {
      console.log(`process.on ${type}`)
      await producer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await producer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})