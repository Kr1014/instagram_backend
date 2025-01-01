const {
  getAll,
  create,
  remove,
  update,
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

module.exports = routerComentario;
