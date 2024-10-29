const User = require('../user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'rodo1234';

const JWT_EXPIRES_IN = '1h';

// Registro de usuario

async function register(req, res){
    const { email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({code: 400, message: 'El usuario ya existe'});
        }
        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        
        //Crear y guardar el nuevo usuario
        const newUser = new User({email, password: hashedPassword});
        await newUser.save();
        res.status(201).json({code: 201, message: 'Usuario creado', user});
    }catch {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({code: 500, message: 'Error al registrar usuario'});
    }
}

// Inicio de sesion

async function login(req, res){
    const { email, password } = req.body;

    try{
        // Obtener usuario por email
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({code: 400, message: 'Usuario no encontrado'});
        }

        //Verificar contraseña
        const isPasswordValid = await user.compare(password);
        if(!isPasswordValid){
            return res.status(400).json({code: 400, message: 'Contraseña incorrecta'});
        }

        //Generar token JWT
        const token = jwt.sign({uid: user._id, email: user.email}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
        res.status(200).json({code: 200, message: 'Sesion iniciada', token});
    }catch(error){
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({code: 500, message: 'Error al iniciar sesión'});
    }
}

module.exports = {
    register,
    login
}   