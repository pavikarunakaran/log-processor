const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
console.log(routes)
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});