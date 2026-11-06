import express from "express"
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
import cors from 'cors'
const app = express()
const port = process.env.PORT || 5000
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
if (!connection) {
    console.error("Could not connect to MongoDB. Exiting.");
    process.exit(1);
}
const myDB = connection.db("EcoBond");
const allEvents = myDB.collection("events");


app.get('/', (req, res) => {
    res.send('Hello World!')
})

//all event Get Api
app.get('/all-events', async (req, res) => {
    try {
        const allValues = await allEvents
            .find({ status: "published" })
            .sort({ date: 1 })
            .toArray();
        res.send(allValues);
    } catch (error) {
        console.error("Failed to load events:", error);
        res.status(500).json({ message: "Failed to load events" });
    }
})

//single event Get Api
app.get('/event/:id', async (req, res) => {
    try {
        const event = await allEvents.findOne({
            _id: new ObjectId(req.params.id),
            status: "published",
        });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.send(event);
    } catch (error) {
        console.error("Failed to load event:", error);
        res.status(400).json({ message: "Invalid event id" });
    }
})

//single event Post Api
app.post('/new-event', async (req, res) => {
    try {
        const result = await allEvents.insertOne(req.body)
        res.send(result)
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } catch (error) {
        console.error("Failed to create event:", error);
        res.status(500).json({ message: "Failed to create event" });
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})