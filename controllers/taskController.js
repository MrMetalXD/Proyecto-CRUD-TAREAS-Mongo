const mongoose = require('mongoose');
const taskModel = require('../models/taskModel');

async function createTask(req, res) {
    const uid = req.user.uid;
    const { title, ...taskData } = req.body;

    // Cambiar el mensaje de error aquí
    if (!title) {
        return res.status(400).json({ message: 'El título es requerido' });
    }

    try {
        const newTask = await taskModel.createTask(uid, { title, ...taskData });
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ message: 'Error al crear la tarea' });
    }
}
async function getTasks(req, res) {
    const uid = req.user.uid;
    try {
        const tasks = await taskModel.getTask(uid);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
}

// taskController.js
async function updatedTask(req, res) {
    const uid = req.user.uid;
    const taskId = req.params.id;
    const updateData = req.body;

    // Verificar que el ID de la tarea sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    try {
        const updatedTask = await taskModel.updateTask(uid, taskId, updateData);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
}

async function deleteTask(req, res) {
    const uid = req.user.uid;
    const taskId = req.params.id;

    // Verificar que el ID de la tarea sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    try {
        const deletedTask = await taskModel.deleteTask(uid, taskId);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.status(200).json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
}


// taskController.js
// taskController.js
async function deleteTask(req, res) {
    const uid = req.user.uid;
    const taskId = req.params.id;

    // Verificar que el ID de la tarea sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    try {
        const deletedTask = await taskModel.deleteTask(uid, taskId);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.status(200).json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
}



module.exports = {
    createTask,
    getTasks,
    updatedTask,
    deleteTask
};
