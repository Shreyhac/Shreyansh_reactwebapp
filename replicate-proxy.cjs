require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Proxy endpoint for Replicate API
app.post('/api/replicate', async (req, res) => {
  try {
    console.log('Proxying to Replicate with body:', JSON.stringify(req.body, null, 2));
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      req.body,
      {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.toString() });
    }
  }
});

const PORT = process.env.REPLICATE_PROXY_PORT || 5001;
app.listen(PORT, () => console.log(`Replicate proxy server running on port ${PORT}`));
