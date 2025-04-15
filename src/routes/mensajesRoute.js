// const express = require("express");
// const {
//   obtenerConversacion,
//   marcarMensajesComoLeidos,
//   borrarMensajeParaUsuario,
//   borrarConversacionCompleta,
//   enviarMensaje,
//   todasLasConversaciones,
// } = require("../controllers/mensajeController");
// const { verifyJwt } = require("../utils/verifyJWT");

// const routerMensajes = express.Router();

// routerMensajes.get("/:remitenteId", verifyJwt, obtenerConversacion);
// routerMensajes.put("/:usuarioId/leidos", verifyJwt, marcarMensajesComoLeidos);
// routerMensajes.post("/", verifyJwt, enviarMensaje);
// routerMensajes.get(
//   "/allmessages/:usuarioId",
//   verifyJwt,
//   todasLasConversaciones
// );

// module.exports = routerMensajes;

const express = require("express");
const {
  obtenerConversacion,
  marcarMensajesComoLeidos,
  borrarMensajeParaUsuario,
  borrarConversacionCompleta,
  enviarMensaje,
  todasLasConversaciones,
} = require("../controllers/mensajeController");
const { verifyJwt } = require("../utils/verifyJWT");

const routerMensajes = express.Router();

routerMensajes.get("/:remitenteId", verifyJwt, obtenerConversacion);
routerMensajes.put("/:usuarioId/leidos", verifyJwt, marcarMensajesComoLeidos);
routerMensajes.post("/", verifyJwt, enviarMensaje);
routerMensajes.get(
  "/allmessages/:usuarioId",
  verifyJwt,
  todasLasConversaciones
);
routerMensajes.delete("/:id", verifyJwt, borrarMensajeParaUsuario);
routerMensajes.delete(
  "/conversacion/:usuarioId",
  verifyJwt,
  borrarConversacionCompleta
);

module.exports = routerMensajes;
