const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();


app.use(cors()); 

app.use(express.json());
app.use(express.static(path.join(__dirname, 'my-app/build')));

app.get('/api/data', (req, res) => {

    try {
      const data = fs.readFileSync('./data.json','utf-8');
      const jsonData = JSON.parse(data);
      return res.json(jsonData);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Error parsing JSON.' });
    }
  
});


// app.post('/api/receiveData', (req, res) => {
//   const receivedData = req.body;
//   console.log('Received Data:', receivedData);
//   res.json({ success: true });
// });

app.post('/api/postData', (req, res) => {
  const newData = req.body;

  try {
    const data = fs.readFileSync('./data.json', 'utf-8');
    const jsonData = JSON.parse(data);
    jsonData.push(newData);

    fs.writeFileSync('./data.json', JSON.stringify(jsonData, null, 2));

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating data.json:', error);
    res.status(500).json({ error: 'Error updating data.json.' });
  }
});

app.all('/api/dataFormat', (req, res) => {
  const acceptHeader = req.get('Accept');
  const data = { key: 'value' };

  if (acceptHeader.includes('text/html')) {
    res.send(`<html><body><p>${data.key}</p></body></html>`);
  } else if (acceptHeader.includes('application/xml')) {
    res.type('application/xml').send(`<root><key>${data.key}</key></root>`);
  } else {
    res.json(data);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
