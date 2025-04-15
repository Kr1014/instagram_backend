const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");
const {
  getNotificaciones,
  marcarComoLeida,
} = require("../controllers/notificacionesController");

const routerNotificacion = express.Router();

routerNotificacion.route("/").get(verifyJwt, getNotificaciones);

routerNotificacion.route("/:id/leida").put(verifyJwt, marcarComoLeida);

module.exports = routerNotificacion;
