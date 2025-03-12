const {
  getAll,
  create,
  getOne,
  remove,
  update,
  login,
  obtenerUsuario,
  obtenerLosUsuariosSeguidos,
} = require("../controllers/usuarioController");
const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");
// const multer = require("multer");
const { uploadImage } = require("../confi/cloudinaryConfig");

const routerUser = express.Router();

routerUser
  .route("/")
  .get(verifyJwt, getAll)
  .post(uploadImage.single("photoProfile"), create);

routerUser.route("/login").post(login);

routerUser.route("/me").get(verifyJwt, obtenerUsuario);

routerUser
  .route("/:id")
  .get(verifyJwt, getOne)
  .delete(verifyJwt, remove)
  .put(verifyJwt, update);

module.exports = routerUser;
