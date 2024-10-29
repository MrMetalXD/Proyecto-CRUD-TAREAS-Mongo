const mongoose = require('mongoose');
const url = "mongodb+srv://alancuevas:12345@clustertasks.dlf6l.mongodb.net/?retryWrites=true&w=majority&appName=clusterTasks"

async function connectDB() {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection failed ", error);
    }
}

module.exports = connectDB;