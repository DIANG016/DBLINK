const { createLink, getAllLinks, getLinkById, deleteLinkById, deleteVotesByLinkId } = require("../db/links");
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');
const { generateError, createPathIfNotExists } = require('../helpers');
const {validationLink} = require('../schemas/schemas')

//controlador del new link
const newLinkController = async (req, res, next) => {
  try {
   await validationLink.validateAsync(req.body);
   const { enlace, titulo, descripcion } = req.body;

   let imageFileName;
   //Procesar la imagen
   if (req.files && req.files.image) {
     //path del directorio uploads
     const uploadsDir = path.join(__dirname, '../uploads');

     // Creo el directorio si no existe
     await createPathIfNotExists(uploadsDir);
     console.log(req.files.image);
     // Procesar la photo
     const image = sharp(req.files.image.data);
     image.resize(500);

     // Guardo la photo con un nombre aleatorio en el directorio uploads
     imageFileName = `${nanoid(24)}.jpg`;

     await image.toFile(path.join(uploadsDir, imageFileName));
   }



   const id = await createLink(req.userId, enlace, titulo, descripcion, imageFileName);
   res.send({
     status: 'ok',
     message: `Link con id: ${id} creado correctamente`,
   });
 } catch (error) {
   next(error);
 }
};

// Listar todos los links
const getLinksController = async (req, res, next) => {
  try {
    const enlaces = await getAllLinks();
    res.send({
        status: 'ok',
        data: enlaces
    });
  } catch (error) {
    next(error);
  }
};


// ubicar un link específico según su id
const getSingleLinkController = async (req, res, next) => {
    try {
      const { id } = req.params;
      const enlace = await getLinkById(id);
  
      res.send({
        status: 'ok',
        data: enlace,
      });
    } catch (error) {
      next(error);
    }
  };

  //borrar un link
  const deleteLinkController = async (req, res, next) => {

    try {
      //req.userId
      const { id } = req.params;
  
      // Conseguir la información del link que quiero borrar
      const enlace = await getLinkById(id);
  
      // Comprobar que el usuario del token es el mismo que creó el link
      if (req.userId !== enlace.user_id) {
        throw generateError(
          'Estás intentando borrar un link que no has creado',
          401
        );
      }
      const vote = await deleteVotesByLinkId(id);
      //comprobar si el link tiene un voto asociado
      if (req.vote == enlace.user_id) {
        throw generateError(
          `Estás intentando borrar un ${vote} que no has creado`,
          401
        );
      }

      // Borrar el link
      await deleteLinkById(id);
  
      res.send({
        status: 'ok',
        message: `El link con id: ${id} fue borrado`,
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getLinksController,
  newLinkController,
  getSingleLinkController,
  deleteLinkController,
};
