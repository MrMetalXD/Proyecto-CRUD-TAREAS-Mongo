const taskModel = require('../models/taskModel');

async function createTask(req, res) {
    const uid = req.user.uid;
    const taskData = req.body;

    try{
        const newTask = await taskModel.createTask(uid, taskData);
        res.status(201).json(newTask);
    }catch(error){
        console.error('Error al crear tarea:', error);
        res.status(500).json({message: 'Error al crear la tarea'});
    }
}

async function getTasks(req, res){
    const uid = req.user.uid;
    try{
        const tasks = await taskModel.getTask(uid);
        res.status(200).json(tasks);
    }catch(error){
        console.error('Error al obtener tareas:', error);
        res.status(500).json({message: 'Error al obtener las tareas'});
    }
}

async function updatedTask(req, res){
    const uid = req.user.uid;
    const taskId = req.params.id;
    const updateData = req.body;
    
    try{
        const updatedTask = await taskModel.updateTask(uid, taskId, updateData);
        res.status(200).json(updatedTask);
    }catch(error){
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({message: 'Error al actualizar la tarea'});
    }
}

async function deleteTask(req, res){
    const uid = req.user.uid;
    const taskId = req.params.id;

    try{
        await taskModel.deleteTask(uid, taskId);
        res.status(200).json({message: 'Tarea eliminada correctamente'});
    }catch(error){
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({message: 'Error al eliminar la tarea'});  
    }
}

module.exports = {
    createTask,
    getTasks,
    updatedTask,
    deleteTask
};   