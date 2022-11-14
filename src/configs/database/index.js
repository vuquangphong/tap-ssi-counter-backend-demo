const mongoose = require('mongoose');

// Connect to database
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected successfully.');
    } catch (err) {
        console.log(err);
        console.log('Fail to connect to Mongodb.');
        process.exit(1);
    }
};

module.exports = { connectDb };
