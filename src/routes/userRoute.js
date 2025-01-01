const {
  getAll,
  create,
  getOne,
  remove,
  update,
  login,
  obtenerUsuario,
} = require("../controllers/usuarioController");
const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");

const routerUser = express.Router();

routerUser.route("/").get(verifyJwt, getAll).post(create);

routerUser.route("/login").post(login);

routerUser.route("/me").get(verifyJwt, obtenerUsuario);

routerUser
  .route("/:id")
  .get(verifyJwt, getOne)
  .delete(verifyJwt, remove)
  .put(verifyJwt, update);

module.exports = routerUser;
