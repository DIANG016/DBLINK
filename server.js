const express = require('express');
const morgan = require('morgan');

const app = express();

// Middleware de gestión de errores
const {
  anonymousUsers,
  getAnonymousUsersController,
  loginController,
  editUser,
} = require('./controllers/users');

const {
  getLinksController,
  newLinkController,
  getSingleLinkController,
  deleteLinkController,
  //editUser,
} = require('./controllers/links');

const { authUser } = require('./middlewares/auth');

//Rutas de usuario
app.post('/user', anonymousUsers); //nos permite registrar
app.get('/user/:id', getAnonymousUsersController); //nos da informacion de un usuario
app.post('/login', loginController); //nos permite logearnos
app.put('/user/:id', authUser, editUser); //modificar usuario

//Rutas de link
app.post('/', authUser, newLinkController); //creo los link
app.get('/', getLinksController); //listo los link
app.get('/link/:id', getSingleLinkController); //Devuelvo un link
app.delete('/link/:id', authUser, deleteLinkController); //borro un link

// Middleware de 404
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

// Middleware de gestión de errores
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});
// Lanzamos el servidor
app.listen(4000, () => {
  console.log('Servidor funcionando!');
});
