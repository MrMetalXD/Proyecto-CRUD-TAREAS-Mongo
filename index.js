const app = require('./app'); // Sintaxis CommonJS  // Añadir extensión .js en ESM
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});