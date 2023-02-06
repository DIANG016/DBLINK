const { deleteVotes, createVotes, totalVotes, getVotesById, votoPorId } = require('../db/votes');
const { getLinkById, getAllLinks } = require('../db/links');
const { generateError } = require('../helpers');
const { validationVote } = require('../schemas/schemas');

//votos totales

const getTotalVotesController = async (req, res, next) => {
  try {
    const votes = await totalVotes();
    res.send({
      status: 'ok',
      data: votes,
    });
  } catch (error) {
    next(error);
  }
};

// ubicar un voto específico según su id
const getSingleVotesController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vote = await getVotesById(id);

    res.send({
      status: 'ok',
      data: vote,
    });
  } catch (error) {
    next(error);
  }
};  

//controlador del nuevo voto
const votesController = async (req, res, next) => {
  try {
    await validationVote.validateAsync(req.body);
    const { id } = req.params;

    // Conseguir la información del link 
    const enlace = await getLinkById(id);
    

   // Compruebo que el usuario del token es el mismo que creó el link
    if (req.userId == enlace.user_id) {
      throw generateError(
        'Estás intentando votar por un link que has creado',
        401
      );
    } 
    
    const votes = await votoPorId(id, req.userId);

     if ( votes.length > 0) {
      throw generateError(
        'Solo se puede votar una vez',
        401
      );
    }  

    const { vote } = req.body;
    await createVotes(req.userId, enlace.id, vote);
    res.send({
      status: 'ok',
      message: `Has votado por el link con id: ${id} correctamente`,
      
    });
 
  } catch (error) {
    next(error);
  }

};

//borrar voto

const deleteVotesController = async (req, res, next) => {
  try {
    await validationVote.validateAsync(req.body);
    const { id } = req.params;

    // Conseguir la información del voto 
    const votes = await getVotesById(id);

    // Comprobar que el usuario del token es el mismo que creó el link
    if (req.userId !== votes.user_id) {
      throw generateError(
        'Estás intentando borrar un voto que no es tuyo',
        401
      );
    }
    await deleteVotes(id);

    res.send({
      status: 'ok',
      message: `El voto con id: ${id} fue borrado el voto correctamente`,
    });
  } catch (error) {
    next(error);
  }
}; 

module.exports = {
  getTotalVotesController,
  deleteVotesController,
  votesController,
  getSingleVotesController,
};
