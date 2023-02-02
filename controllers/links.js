const { createLink, getAllLinks, getLinkById, deleteLinkById, deleteVotesByLinkId } = require("../db/links");
const { generateError } = require('../helpers');
const {validationLink} = require('../schemas/schemas')

// Listar todos los links
const getLinksController = async (req, res, next) => {
  try {
    const links = await getAllLinks();
    res.send({
        status: 'ok',
        data: links
    });
  } catch (error) {
    next(error);
  }
};

//controlador del new link
const newLinkController = async (req, res, next) => {
   try {
    await validationLink.validateAsync(req.body);
    const { link, titulo, descripcion } = req.body;
    const id = await createLink(req.userId, link, titulo, descripcion);
    res.send({
      status: 'ok',
      message: `Link con id: ${id} creado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

// ubicar un link específico según su id
const getSingleLinkController = async (req, res, next) => {
    try {
      const { id } = req.params;
      const link = await getLinkById(id);
  
      res.send({
        status: 'ok',
        data: link,
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
      const link = await getLinkById(id);
  
      // Comprobar que el usuario del token es el mismo que creó el link
      if (req.userId !== link.user_id) {
        throw generateError(
          'Estás intentando borrar un link que no has creado',
          401
        );
      }
      const vote = await deleteVotesByLinkId(id);
      //comprobar si el link tiene un voto asociado
      if (req.vote == link.user_id) {
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
