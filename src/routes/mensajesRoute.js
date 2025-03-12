const express = require("express");
const {
  obtenerConversacion,
  marcarMensajesComoLeidos,
  borrarMensaje,
  enviarMensaje,
  todasLasConversaciones,
} = require("../controllers/mensajeController");
const { verifyJwt } = require("../utils/verifyJWT");

const routerMensajes = express.Router();

routerMensajes.get("/:remitenteId", verifyJwt, obtenerConversacion);
routerMensajes.put("/:usuarioId/leidos", verifyJwt, marcarMensajesComoLeidos);
routerMensajes.delete("/:id", verifyJwt, borrarMensaje);
routerMensajes.post("/", verifyJwt, enviarMensaje);
routerMensajes.get(
  "/allmessages/:usuarioId",
  verifyJwt,
  todasLasConversaciones
);

module.exports = routerMensajes;
