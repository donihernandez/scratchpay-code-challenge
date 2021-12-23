const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const {
  default: axios
} = require('axios');

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

// Routes
const indexRouter = require('./routes/index');
const clinicsRouter = require('./routes/clinics');

app.use('/', indexRouter);
app.use('/clinics', clinicsRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => console.log('Server started on port 3000'));
}

module.exports = app;