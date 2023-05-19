const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.TOY_USER}:${process.env.TOY_PASS}@cluster0.ysrfscy.mongodb.net/?retryWrites=true&w=majority`;


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
    await client.connect();

    const toysCollection = client.db('allToys').collection('toys');

    // app.get('/toys', async (req, res) => {
      
    //     const cursor = toysCollection.find();
    //     const result = await cursor.toArray();
    //     res.send(result);
     
    // });
    

    // get all data from the database
    
    
    app.get('/toys/all', async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // app.get('/toys/all/email', async (req, res) => {
    //   console.log(req.query.email)
    //   let query = {}
    //   if (req.query?.email) {
    //     const query = {email : req.query?.email}
    //   }
    //   console.log(query)
    //   const result = await toysCollection.find(query).toArray();
    //   res.send(result);
    // });

    app.get('/toys/all/email', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query?.email }; // Remove the "let" keyword
      }
      console.log(query);
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    });

    

    


// sub category alll data
    app.get('/toys', async (req, res) => {
      const selectedCategory = req.query.category;
    
      if (selectedCategory) {
        const query = { subcategory: selectedCategory };
        const cursor = toysCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } else {
        res.send([]);
      }
    });
    

    // signledata toys
    app.get('/toys/shopby/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const toy = await toysCollection.findOne(query);
      res.send(toy);
    })

// add toys collection
    app.post("/toys", async(req, res)=>{
      const body = req.body;
      const result = await toysCollection.insertOne(body);
      console.log(result)
      res.send(result);
    });


    
    // update the current data
    app.put('/toys/all/email/:id', async (req, res,)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true};
      const updatetoys = req.body;
      
      const updateDoc = {
        $set: {
          price: updatetoys.price,
          details: updatetoys.details,
          availablequality: updatetoys.availablequality
        }
      }
      const result = await toysCollection.updateOne(filter, updateDoc, options)
      res.send(result);
          })
      



// delete the data
app.delete('/toys/all/email/:id', async(req, res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await toysCollection.deleteOne(query)
  res.send(result);
})
//  app.delete('/toys/all/email/:email', async (req, res) => {
//   const email = req.params.email;
//   const query = { email: email };
//   const result = await toysCollection.deleteOne(query);
//   res.send(result);
// });




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('toy server Hello World!')
})

app.listen(port, () => {
  console.log(`toy server on port ${port}`)
})