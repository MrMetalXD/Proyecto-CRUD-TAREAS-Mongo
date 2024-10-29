const Task = require('../models/taskModel');

// Crear una nueva tarea
async function createTask(uid, data) {
    try {
        const newTask = new Task({
            title: data.title,
            description: data.description,
            uid: uid
        });
        await newTask.save();
        return newTask;
    }catch(error) {
        console.error('Error al crear tarea:', error);
    }
}

// Obtener tareas de un usuario especifico
async function getTask(uid) {
    try {
        const tasks = await Task.find({uid});
        return tasks;
    } catch(error) {
        console.error('Error al obtener tareas:', error);
    }
}

// Actualizar una tarea especifica
async function updateTask(uid, taskId, data) {
    try {
        if(!task){
            throw new Error('Tarea no encontrada');
        }
        Object.assign(task, data);
        await task.save();
        return task;
    } catch(error) {
        console.error('Error al actualizar tarea:', error);
    }
}

// Eliminar una tarea especifica
async function deleteTask(uid, taskId) {
    try {
        const task = await Task.findOneAndDelete({uid, _id: taskId});
        if(!task){
            throw new Error('Tarea no encontrada');
        }
        return task;
    } catch(error) {
        console.error('Error al eliminar tarea:', error);
        throw new Error('Error al eliminar la tarea');
    }
}

module.exports = {
    createTask,
    getTask,
    updateTask,
    deleteTask
}