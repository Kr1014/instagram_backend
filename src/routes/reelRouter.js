const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/reelControllers");
const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");
const upload = require("../confi/multerConfig"); // Importa la configuración de Multer

const routerReel = express.Router();

// Rutas de Reel
routerReel
  .route("/")
  .get(verifyJwt, getAll)
  .post(verifyJwt, upload.single("video"), create); // Agrega Multer como middleware

routerReel
  .route("/:id")
  .get(verifyJwt, getOne)
  .delete(verifyJwt, remove)
  .put(verifyJwt, update);

module.exports = routerReel;
