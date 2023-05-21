const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.voqisr3.mongodb.net/?retryWrites=true&w=majority`;

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

        // toys collection
        const toyscollection = client.db('toyMarketplace').collection('toys');

        // getting toys from mongodb
        app.get('/toys', async (req, res) => {
            // console.log(req.query.sort)
            let query = {};
            if (req.query.sellerEmail) {
                query = {
                    sellerEmail: req.query.sellerEmail
                }
            }
            // data sorting
            let options = {}
            if (req.query.sort === 'desc') {
                options = {
                    sort: {
                        price: -1
                    }
                }
            }
            if (req.query.sort === 'asc') {
                options = {
                    sort: {
                        price: 1
                    }
                }
            }

            const result = await toyscollection.find(query, options).collation({
                locale: "en_US",
                numericOrdering: true
            }).limit(20).toArray();
            res.send(result)
        })

        // getting single toy from mongodb
        app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const result = await toyscollection.findOne(query);
            res.send(result);
        })

        // toy info collect from client side
        app.post('/addAToy', async (req, res) => {
            const newToy = req.body;
            const result = await toyscollection.insertOne(newToy);
            res.send(result);

        })

        // delete toy
        app.delete('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const result = await toyscollection.deleteOne(query);
            res.send(result);
        })

        // update toy
        app.put('/updateToy/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id)
            };
            const updatedToy = req.body;
            const options = {
                upsert: true
            };
            const toy = {
                $set: {
                    photo: updatedToy.photo,
                    toyName: updatedToy.toyName,
                    subCategory: updatedToy.subCategory,
                    rating: updatedToy.rating,
                    quantity: updatedToy.quantity,
                    description: updatedToy.description,
                }
            };
            const result = await toyscollection.updateOne(filter, toy, options);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({
        //     ping: 1
        // });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Toy server is running')
});

app.listen(port, () => {
    console.log(`Toy server running on port: ${port}`)
})