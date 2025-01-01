const {
  getAll,
  create,
  getOne,
  remove,
  update,
  explorar,
} = require("../controllers/publicacionController");
const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");

const routerPublicacion = express.Router();

routerPublicacion.route("/explorar").get(verifyJwt, explorar);

routerPublicacion.route("/").get(verifyJwt, getAll).post(verifyJwt, create);

routerPublicacion
  .route("/:id")
  .get(verifyJwt, getOne)
  .delete(verifyJwt, remove)
  .put(verifyJwt, update);

module.exports = routerPublicacion;
