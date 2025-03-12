const express = require("express");
const routerUser = require("./userRoute");
const routerComentario = require("./comentarioRoute");
const routerMeGusta = require("./meGustaRoute");
const routerPublicacion = require("./publicacionRoute");
const routerSeguidor = require("./seguidoresRouter");
const routerMensajes = require("./mensajesRoute");
const routerGuardarPublicacion = require("./publicacionGuardada.route");

const routerMeGustaComentario = require("./meGustaComentarioRoute");
const router = express.Router();

// colocar las rutas aquí

router.use("/users", routerUser);
router.use("/comentarios", routerComentario);
router.use("/megustas", routerMeGusta);
router.use("/publicaciones", routerPublicacion);
router.use("/seguidores", routerSeguidor);
router.use("/mensajes", routerMensajes);
router.use("/publicacionesGuardadas", routerGuardarPublicacion);
router.use("/meGustaComentarios", routerMeGustaComentario);

module.exports = router;
