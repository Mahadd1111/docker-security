const express = require('express')
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors')
const axios = require('axios')
const fs = require('fs/promises');
const { comma } = require('postcss/lib/list');
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
    const fileName = req.query.fileName
    const filePath = path.join(__dirname, '../report/'+fileName);
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        res.json(jsonData);
      } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

app.post('/secure-image-trivy',async (req,res)=>{
  const imageName = req.body.imageName
  const reportPath = path.join(__dirname, '../report/scan-report-trivy.json');
  const command = `trivy image --format json --output ${reportPath} ${imageName}`;
  console.log("Running Command: ",command)
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Trivy execution error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    // if (stderr) {
    //   console.error('Trivy error:', stderr);
    //   return res.status(400).json({ error: 'Trivy Error', details: stderr });
    // }
    try {
      res.json({success:true});
    } catch (parseError) {
      console.error('Error parsing JSON result:', parseError);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
})

app.post('/secure-image-clair', async (req, res) => {
    const imageName = req.body.imageName;
    const ipAddress = req.body.ipAddress;
    const reportPath = path.join(__dirname, '../report/scan-report-clair.json');
    const pullImageCommand = `docker pull ${imageName}`;
    exec(pullImageCommand, async (pullError, pullStdout, pullStderr) => {
      if (pullError) {
        console.error(`Error pulling image: ${pullError.message}`);
        return res.status(500).json({ error: 'Internal Server Error', message: pullError.message });
      }
      console.log(`Image pulled successfully: ${imageName}`);
      const clairScannerCommand = `clair-scanner -c http://localhost:6060 --ip ${ipAddress} --report='${reportPath}' ${imageName}`;
      exec(clairScannerCommand, async (scanError, scanStdout, scanStderr) => {
        console.log("Ran Scanner Command: ", clairScannerCommand);
        console.log(`clair-scanner output: ${scanStdout}`);
        console.error(`clair-scanner error: ${scanStderr}`);
        if (scanStdout.includes('contains') && scanStdout.includes('unapproved vulnerabilities')) {
          console.warn('Image contains unapproved vulnerabilities. Treating as a warning.');
        }
        res.json({
          pullOutput: pullStdout,
          scanOutput: scanStdout,
        });
      });
    });
  });