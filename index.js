const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tksup.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   // await client.connect();
    // Send a ping to confirm a successful connection
    const db = client.db("greenPlate")
    const foodCollection = db.collection("foods")

    app.get("/foods",async(req,res)=>{
    const  result = await foodCollection.find().toArray()
    res.send(result)
    })

    app.get("/highest-foods",async(req,res)=>{
      const cursor = foodCollection.find()
      const sorted = cursor.sort({food_quantity:'asc'})
    const  result = await sorted.limit(6).toArray()
    res.send(result)
    })
    app.post("/foods", async(req,res)=>{
      const data = req.body
      const result = await foodCollection.insertOne(data)
      res.send({
        success:true,
        result,
      })
    })
    app.get("/foods/:id",async(req,res)=>{
      const {id} = req.params
      const objectId = new ObjectId(id)
      const result = await foodCollection.findOne({_id:objectId})
       res.send({
        success:true,
        result,
      })
    })
      app.put("/foods/:id",async(req,res)=>{
      const {id} = req.params
      const data=req.body
      const objectId = new ObjectId(id)
        const filter = {_id: objectId}
      const update={
        $set:data
      }
      
      
      const result = await foodCollection.updateOne(filter,update)
       res.send({
        success:true,
        result,
      })
    })

    //delete
        app.delete("/foods/:id",async(req,res)=>{
      const {id} = req.params
      const result = await foodCollection.deleteOne({_id: new ObjectId(id)})
       res.send({
        success:true,
        result,
      })
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("greenplate server")
})
app.listen(port,(req,res)=>{
    console.log(`server is running on port ${port}`)
})