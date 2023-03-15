import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
dotenv.config();

const db_username = process.env.MONGO_DB_USERNAME;
const db_password = process.env.MONGO_DB_PASSWORD;
const db_url = process.env.MONGO_DB_URL;

const uri =
  `mongodb+srv://${db_username}:${db_password}@${db_url}?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies
app.set("port", process.env.PORT || 3000);

app.post("/findOne", async (req, res) => {
  try {
    const { database, collection, filter, projection } = req.body;
    const db = client.db(database);
    const coll = db.collection(collection);

    const data = await coll.findOne(filter, projection);

    res.type("json");
    res.status(200);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.use((req, res) => {
  res.type("text/plain");
  res.status(404);
  res.send("404 - Not found");
});

app.listen(app.get("port"), () => {
  console.log("Express started");
});
