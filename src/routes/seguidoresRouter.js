const {
  seguir,
  eliminarMisSeguidores,
  verificarSeguimiento,
} = require("../controllers/seguidorController");
const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");

const routerSeguidor = express.Router();

routerSeguidor.route("/:usuarioASeguir").post(verifyJwt, seguir);

routerSeguidor
  .route("/:elimnarMiSeguidor")
  .delete(verifyJwt, eliminarMisSeguidores);

routerSeguidor
  .route("/:userId/seguido/:otherUserId")
  .get(verifyJwt, verificarSeguimiento);

module.exports = routerSeguidor;
