const mongoose = require('mongoose');
const url = "mongodb+srv://padrinoelmejor97:xa2W6Ke0htRSXZec@cluster0.e9ihq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

async function connectDB() {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection failed ", error);
    }
}

module.exports = connectDB;