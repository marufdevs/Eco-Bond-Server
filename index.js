import express from "express"
import { MongoClient } from 'mongodb';
import 'dotenv/config'
import cors from 'cors'
const app = express()
const port = 5000 || process.env.NEXT_PUBLIC_API_URL
app.use(cors());
app.use(express.json())
const client = new MongoClient(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ac-e1akoa1-shard-00-00.rbacfee.mongodb.net:27017,ac-e1akoa1-shard-00-01.rbacfee.mongodb.net:27017,ac-e1akoa1-shard-00-02.rbacfee.mongodb.net:27017/?ssl=true&replicaSet=atlas-ls1xwx-shard-0&authSource=admin`);

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}
const connection = await connectToMongoDB()
const myDB = connection.db("EcoBond");
const allEvents = myDB.collection("events");


app.get('/', (req, res) => {
    res.send('Hello World!')
})

//all event Get Api
app.get('/all-events', async (req, res) => {
    const findResult = await allEvents.findOne()
    res.send(findResult)
})
app.post('/new-event', async (req, res) => {
    const result = await allEvents.insertOne(req.body)
    res.send(result)
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})