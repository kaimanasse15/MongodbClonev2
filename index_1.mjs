import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
dotenv.config()
// Replace the uri string with your connection string.

const db_username = process.env.MONGO_DB_USERNAME;
const db_password = process.env.MONGO_DB_PASSWORD;
const db_url = process.env.MONGO_DB_URL;

const uri =
  `mongodb+srv://${db_username}:${db_password}@${db_url}?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

const app = express();
app.use(cors());
app.set('port', process.env.PORT || 3000);

app.get('/findOne', async (req,res) => {
  try {
    const database = client.db('sample_airbnb');
    const movies = database.collection('listingsAndReviews');
    
    const query = {};
    if (req.query.property_type) {
      query.property_type = req.query.property_type;
    }
    if (req.query.bedrooms) {
      query.bedrooms = parseInt(req.query.bedrooms);
    }
    if (req.query.beds) {
      query.beds = parseInt(req.query.beds);
    }
    
    const movie = await movies.findOne(query);

    res.type('json');
    res.status(200);
    res.json({
      _id: movie._id,
      listing_url: movie.listing_url,
      name: movie.name,
      summary: movie.summary,
      property_type: movie.property_type,
      bedrooms: movie.bedrooms,
      beds: movie.beds
    });

  } catch (error) {
    console.log(error)  
  } finally {
   
  }
});

app.use((req, res) => {
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
  console.log('Express started');
});
