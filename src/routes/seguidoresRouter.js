const {
  seguir,
  eliminarMisSeguidores,
  verificarSeguimiento,
  obtenerLosUsuariosSeguidos,
} = require("../controllers/seguidorController");
const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");

const routerSeguidor = express.Router();

routerSeguidor
  .route("/:usuarioASeguir")
  .post(verifyJwt, (req, res) => seguir(req, res, req.io))
  .get(verifyJwt, (req, res) => obtenerLosUsuariosSeguidos(req, res, req.io));

routerSeguidor
  .route("/:userId/obtenerSeguidos")
  .get(verifyJwt, obtenerLosUsuariosSeguidos);

routerSeguidor
  .route("/:eliminarMiSeguidor")
  .delete(verifyJwt, eliminarMisSeguidores);

routerSeguidor
  .route("/:userId/seguido/:otherUserId")
  .get(verifyJwt, verificarSeguimiento);

module.exports = routerSeguidor;
