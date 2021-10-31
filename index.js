const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3pim7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run(){
  try{
    await client.connect();
    const database = client.db("ServiceCluster")
    const serviceCollection = database.collection("services");
    
    //get api
    app.get('/services',async(req,res)=>{
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services)
    })
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      // console.log('load user with id: ', id);
      res.send(service);
  })
   app.post('/services',async (req,res)=>{
     const service = req.body;
     const result = await serviceCollection.insertOne(service)
     res.json(result)
   })

   app.post('/order', async(req,res)=>{
     const book = req.body;
     const bookedservice = await serviceCollection.insertOne(book)
     res.json(bookedservice)
   })

   app.get('/order', async(req,res)=>{
    const booking = serviceCollection.find({});
      const setbookings = await booking.toArray();
      res.send(setbookings)
   })
   app.delete('/order/:id', async(req,res)=>{
     const id = req.params.id;
     const query = {_id:ObjectId(id)}
     const result = await serviceCollection.deleteOne(query);
     console.log('deleting order',result)
     res.json(result)
   })
  }
  finally{
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('db connected');
});

app.listen(port,()=>{
    console.log('db connected in port :',port);
});

