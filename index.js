const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
    res.status(200).send('server running');
});

// mongodb-------------------------------------------




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwnyjff.mongodb.net/?retryWrites=true&w=majority`;

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

        const doctorsCollection = client.db('hospitalsDB').collection('doctors');
        const servicesCollection = client.db('hospitalsDB').collection('services');


        // doctors collection start -------------------------------------

        // insert/post One 
        app.post('/doctors', async (req, res) => {
            const doctors = req.body;
            const result = await doctorsCollection.insertOne(doctors);
            res.status(200).send(result);
        });


        // find/get all 
        app.get('/doctors', async (req, res) => {
            const cursor = await doctorsCollection.find().toArray();
            res.status(200).send(cursor);
        });


        // find/get One 
        app.get('/doctors/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await doctorsCollection.findOne(query);
            res.status(200).send(result);
        });


        // find/get using email 
        app.get('/doctorsEmail', async (req, res) => {
            let query = {};
            const email = req.query?.email;
            if (email) {
                query = { email: email }
            }
            const result = await doctorsCollection.find(query).toArray();
            console.log(result);
            res.status(200).send(result);
        });


        // put/update One 
        app.put('/doctors/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const doctor = req.body;
            const updateDoctors = {
                $set: {
                    name: doctor.name,
                    email: doctor.email,
                    phone: doctor.phone,
                    degree: doctor.degree,
                    date: doctor.date,
                    profileImg: doctor.profileImg
                }
            }
            const result = await doctorsCollection.updateOne(filter, updateDoctors, options);
            res.status(200).send(result);
        });

        // patch/update 
        app.patch('/doctors/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const service = req.body;
            const updateService = {
                $set: {
                    status: service.status
                }
            }
            const result = await servicesCollection.updateOne(filter, updateService);
            res.status(200).send(result);
        });



        // delete/remove One 
        app.delete('/doctors/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await doctorsCollection.deleteOne(query);
            res.status(200).send(result);
        })
        // doctors collection end -------------------------------------


        // services collection start ---------------------------------------------

        // find/get One 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.status(200).send(result);
        })



        // find/get 
        app.get('/services', async (req, res) => {
            let query = {};
            const email = req.query?.email;
            if (email) {
                query = { email: email };
            }
            const result = await servicesCollection.find(query).toArray();
            res.status(200).send(result);
        })


        // post/insert One 
        app.post('/services', async (req, res) => {
            const query = req.body;
            const result = await servicesCollection.insertOne(query);
            res.status(200).send(result);
        });


        // update/put one 
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const service = req.body;
            const options = { upsert: true };
            const updateService = {
                $set: {
                    name: service.name,
                    email: service.email,
                    phone: service.phone,
                    degree: service.degree,
                    date: service.date,
                    profileImg: service.profileImg,
                }
            }
            const result = await servicesCollection.updateOne(filter, updateService, options);
            res.status(200).send(result);
        });



        // put/update 
        app.patch('/services/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const service = req.body;
            const updateService = {
                $set: {
                    status: service.status
                }
            }
            const result = await servicesCollection.updateOne(filter, updateService);
            res.status(200).send(result);
        });


        // delete/remove One 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.status(200).send(result);
        })



        // services collection end ---------------------------------------------


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





// mongodb-------------------------------------------



app.listen(port, () => {
    console.log(`server running at port ${port}`);
});
