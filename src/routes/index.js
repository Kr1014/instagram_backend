const express = require("express");
const routerUser = require("./userRoute");
const routerComentario = require("./comentarioRoute");
const routerMeGusta = require("./meGustaRoute");
const routerPublicacion = require("./publicacionRoute");
const routerSeguidor = require("./seguidoresRouter");
const routerMensajes = require("./mensajesRoute");
const routerGuardarPublicacion = require("./publicacionGuardada.route");

const routerMeGustaComentario = require("./meGustaComentarioRoute");
const routerNotificacion = require("./notificationRoute");
const routerHistoria = require("./historiaRoute");
const router = express.Router();

router.use("/users", routerUser);
router.use("/comentarios", routerComentario);
router.use("/megustas", routerMeGusta);
router.use("/publicaciones", routerPublicacion);
router.use("/seguidores", routerSeguidor);
router.use("/mensajes", routerMensajes);
router.use("/publicacionesGuardadas", routerGuardarPublicacion);
router.use("/meGustaComentarios", routerMeGustaComentario);
router.use("/notificaciones", routerNotificacion);
router.use("/historias", routerHistoria);

module.exports = router;
