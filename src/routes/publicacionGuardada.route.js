const {
  guardarPublicaciones,
  getPublicacionesGuardadas,
  verificarGuardado,
} = require("../controllers/publicacionGuardadaController");

const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");

const routerGuardarPublicacion = express.Router();

routerGuardarPublicacion.route("/").get(verifyJwt, getPublicacionesGuardadas);

routerGuardarPublicacion
  .route("/:publicacionId")
  .post(verifyJwt, guardarPublicaciones)
  .get(verifyJwt, verificarGuardado);
module.exports = routerGuardarPublicacion;
