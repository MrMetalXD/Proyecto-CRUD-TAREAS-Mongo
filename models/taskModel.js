const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description : {type: String},
    completed: {type: Boolean, default: false},
    createdaAt: {type: Date, default: Date.now},
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Task', taskSchema);