const {
  getAll,
  create,
  getOne,
  remove,
  update,
  explorar,
  getVideos,
} = require("../controllers/publicacionController");
const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");
const upload = require("../confi/multerConfig");

const routerPublicacion = express.Router();

routerPublicacion.route("/explorar").get(verifyJwt, explorar);

routerPublicacion
  .route("/")
  .get(verifyJwt, getAll)
  .post(verifyJwt, upload.single("contentUrl"), create);

routerPublicacion.route("/videos").get(verifyJwt, getVideos);

routerPublicacion
  .route("/:id")
  .get(verifyJwt, getOne)
  .delete(verifyJwt, remove)
  .put(verifyJwt, update);

module.exports = routerPublicacion;
