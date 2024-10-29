const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Método para crear una tarea
taskSchema.statics.createTask = async function(uid, taskData) {
    const task = new this({ ...taskData, uid });
    const savedTask = await task.save();
    return savedTask.toObject({ getters: true }); // Incluye `id` en lugar de `_id`
};

// Método para obtener las tareas por usuario
taskSchema.statics.getTask = function(uid) {
    return this.find({ uid });
};

// Método para actualizar una tarea
taskSchema.statics.updateTask = function(uid, taskId, updateData) {
    return this.findOneAndUpdate({ _id: taskId, uid }, updateData, { new: true });
};

// Método para eliminar una tarea
taskSchema.statics.deleteTask = function(uid, taskId) {
    return this.findOneAndDelete({ _id: taskId, uid });
};

module.exports = mongoose.model('Task', taskSchema);
