const express = require('express')
const cors = require('cors')
const axios = require('axios')
const port = 4000

const app = express()

app.use(cors({
    origin: ['http://localhost:3000','http://localhost:6060','http://localhost:4000'],
    methods: ['GET', 'POST','PUT'], // Add 'POST' to the allowed methods
}));

app.use(express.json());


app.get('/', (req, res) => {
    res.send('API is running...');
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


app.post('/manifest-digest',async(req,res)=>{
    imageName=req.body.imageName
    imageTag=req.body.imageTag
    response = {i:imageName,j:imageTag}
    return res.json(response)
})

app.post('/secure-image',async(req,res)=>{
    const manifest = JSON.stringify(req.body.data)

    const headers = {
    'Content-Type': 'application/json', 
    'Accept': 'application/json',
    };
    
    try {
        const response = await axios.post('http://localhost:6060/indexer/api/v1/index_report', manifest, { headers });
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
      

})