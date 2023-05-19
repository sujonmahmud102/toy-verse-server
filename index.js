const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
// app.use(application.json());
console.log(process.env.DB_PASS)

app.get('/', (req, res) => {
    res.send('Toy server is running')
});

app.listen(port, ()=>{
    console.log(`Toy server running on port: ${port}`)
})
