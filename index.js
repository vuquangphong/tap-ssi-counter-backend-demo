const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./src/configs/database');
const auth = require('./src/middleware/auth');
require('dotenv').config();

// Connect database mongodb
db.connectDb();

app.use(express.json());
app.use(cors());

const http = require('http').createServer(app);

// Routes
app.use('/api', require('./src/routes/authRouter'));
// app.use(auth);

app.get('/api', (req, res) => res.send('Hello world'));

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
