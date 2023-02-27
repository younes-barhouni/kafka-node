//const Kafka = require("kafkajs").Kafka
const {Kafka} = require("kafkajs")

run();
async function run(){
    try
    {
         const kafka = new Kafka({
              "clientId": "myapp",
              "brokers" :["kafka:9092"]
         })

        const admin = kafka.admin();
        console.log("Topic Connecting.....")
        await admin.connect()
        console.log("Topic Connected!")
        //A-M, N-Z
        await admin.createTopics({
            "topics": [{
                "topic" : "Users",
                "numPartitions": 2
            }]
        })
        console.log("Topic Created Successfully!")
        await admin.disconnect();
    }
    catch(ex)
    {
        console.error(`Topic Something bad happened ${ex}`)
    }
    finally{
        process.exit(0);
    }


}