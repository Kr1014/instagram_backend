const {
  getAll,
  create,
  remove,
  update,
  responderComentario,
  obtenerComentarioConRespuestas,
} = require("../controllers/comentarioController");
const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");

const routerComentario = express.Router();

routerComentario
  .route("/:publicacionId")
  .get(verifyJwt, getAll)
  .post(verifyJwt, create);

routerComentario
  .route("/:publicacionId/:comentarioId")
  .delete(verifyJwt, remove)
  .put(verifyJwt, update);

routerComentario
  .route("/:comentarioId/responder")
  .post(verifyJwt, responderComentario);

routerComentario
  .route("/:comentarioId/respuestas")
  .get(verifyJwt, obtenerComentarioConRespuestas);

module.exports = routerComentario;
