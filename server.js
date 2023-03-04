require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const {
  anonymousUsers,
  getAnonymousUsersController,
  loginController,
  editUserImage,
  editUser,
  editUserPassword,
  getMeController,
  getUserLinksController,
} = require('./controllers/users');

const {
  getLinksController,
  newLinkController,
  getSingleLinkController,
  deleteLinkController,
} = require('./controllers/links');

const { authUser } = require('./middlewares/auth');
const {
  votesController,
  deleteVotesController,
  getTotalVotesController,
} = require('./controllers/votes');

const app = express();

app.use(fileUpload());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('./uploads'));
app.use(cors());

//Rutas de usuario
app.post('/user', anonymousUsers); //nos permite registrar
app.get('/user/:id', /*authUser,*/ getAnonymousUsersController); //nos da información de un usuario por id
app.get('/user/:id/enlaces', /* authUser, */ getUserLinksController);
app.get('/user', authUser, getMeController); // Aporta información de cada usuario
app.post('/login', loginController); //nos permite logearnos
app.put('/user/:id', authUser, editUser); //modificar usuario
app.post('/user/:id/password', authUser, editUserPassword); // Editar password de usuario
app.post('/user/:id/photo', authUser, editUserImage);

//Rutas de link
app.post('/', authUser, newLinkController); //creo los link
app.get('/', /*authUser, */ getLinksController); //listo los link, incluyendo los votos que tienen cada uno
app.get('/enlace/:id', authUser, getSingleLinkController); //Devuelvo un link
app.delete('/enlace/:id', authUser, deleteLinkController); //borro un link

//ruta de votos
app.post('/votes/:id', authUser, votesController);
app.get('/totalvotes', getTotalVotesController);
app.delete('/votes/:id', authUser, deleteVotesController);

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
