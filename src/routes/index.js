const express = require("express");
const routerUser = require("./userRoute");
const routerComentario = require("./comentarioRoute");
const routerMeGusta = require("./meGustaRoute");
const routerPublicacion = require("./publicacionRoute");
const routerSeguidor = require("./seguidoresRouter");
const routerReel = require("./reelRouter");
const routerMensajes = require("./mensajesRoute");
const router = express.Router();

// colocar las rutas aquí

router.use("/users", routerUser);
router.use("/comentarios", routerComentario);
router.use("/megustas", routerMeGusta);
router.use("/publicaciones", routerPublicacion);
router.use("/seguidores", routerSeguidor);
router.use("/reels", routerReel);
router.use("/mensajes", routerMensajes);
module.exports = router;
