const express = require("express");
const {
  obtenerConversacion,
  marcarMensajesComoLeidos,
  borrarMensaje,
  enviarMensaje,
} = require("../controllers/mensajeController");
const { verifyJwt } = require("../utils/verifyJWT");

const routerMensajes = express.Router();

routerMensajes.get("/:usuarioId", verifyJwt, obtenerConversacion);
routerMensajes.put("/:usuarioId/leidos", verifyJwt, marcarMensajesComoLeidos);
routerMensajes.delete("/:id", verifyJwt, borrarMensaje);
routerMensajes.post("/", verifyJwt, enviarMensaje);

module.exports = routerMensajes;
