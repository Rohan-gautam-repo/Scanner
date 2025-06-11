// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // load env variables

const scanRoutes = require('./routes/scanRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/scan', scanRoutes); // Mount API

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
