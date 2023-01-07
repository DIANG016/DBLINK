const express = require('express');
const morgan = require('morgan');

const app = express();
// Middleware de gestión de errores

// Lanzamos el servidor
app.listen(4000, () => {
  console.log('Servidor funcionando!');
});
