const {
  getAll,
  create,
  remove,
  getHistoriasSeguidos,
} = require("../controllers/historiaController");
const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");
const upload = require("../confi/multerConfig");

const routerHistoria = express.Router();

routerHistoria.route("/seguidos").get(verifyJwt, getHistoriasSeguidos);

routerHistoria
  .route("/")
  .get(verifyJwt, getAll)
  .post(verifyJwt, upload.single("contentUrl"), create);

routerHistoria.route("/:id").delete(verifyJwt, remove);

module.exports = routerHistoria;
