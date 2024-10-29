const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authenticateToken = require('./middleware/authMiddleware');
const connectMongo = require('./mongoConfig');

const app = express();
connectMongo();


app.use(bodyParser.json());

// Rutas públicas
app.use('/auth', authRoutes);

// Rutas protegidas
app.use('/tasks', authenticateToken, taskRoutes);

// Middleware para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ code: 404, message: 'Ruta no encontrada' });
});

module.exports = app; // <--- Aquí lo exportamos con CommonJS
