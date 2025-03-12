const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");
const {
  darLikeComentarios,
  verificarLikeComentario,
} = require("../controllers/meGustaComentarioController");

const routerMeGustaComentario = express.Router();

routerMeGustaComentario
  .route("/:comentarioId")
  .post(verifyJwt, darLikeComentarios)
  .get(verifyJwt, verificarLikeComentario);

module.exports = routerMeGustaComentario;
