const express = require('express')
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors')
const axios = require('axios')
const fs = require('fs/promises');
const port = 4000

const app = express()

app.use(cors({
    origin: ['http://localhost:3000','http://localhost:6060','http://localhost:4000'],
    methods: ['GET', 'POST','PUT'],
}));

app.use(express.json());


app.get('/', (req, res) => {
    res.send('API is running...');
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.get('/read-file',async(req,res)=>{
    const filePath = path.join(__dirname, '../report/scan-report.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        res.json(jsonData);
      } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

app.post('/secure-image', async (req, res) => {
    const imageName = req.body.imageName;
    const ipAddress = req.body.ipAddress;
    const reportPath = path.join(__dirname, '../report/scan-report.json');
    const pullImageCommand = `docker pull ${imageName}`;
  
    exec(pullImageCommand, async (pullError, pullStdout, pullStderr) => {
      if (pullError) {
        console.error(`Error pulling image: ${pullError.message}`);
        return res.status(500).json({ error: 'Internal Server Error', message: pullError.message });
      }
  
      console.log(`Image pulled successfully: ${imageName}`);
  
      // Run clair-scanner command
      const clairScannerCommand = `clair-scanner -c http://localhost:6060 --ip ${ipAddress} --report='${reportPath}' ${imageName}`;
      exec(clairScannerCommand, async (scanError, scanStdout, scanStderr) => {
        console.log("Ran Scanner Command: ", clairScannerCommand);
  
        console.log(`clair-scanner output: ${scanStdout}`);
        console.error(`clair-scanner error: ${scanStderr}`);
  
        // Check if scanStdout contains unapproved vulnerabilities warning
        if (scanStdout.includes('contains') && scanStdout.includes('unapproved vulnerabilities')) {
          console.warn('Image contains unapproved vulnerabilities. Treating as a warning.');
          // Continue with the flow or handle as needed
        }
  
        res.json({
          pullOutput: pullStdout,
          scanOutput: scanStdout,
        });
      });
      
    });
  });