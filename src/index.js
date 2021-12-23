const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
 
app.use(bodyParser.json()); 
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => console.log('Server started on port 3000'));