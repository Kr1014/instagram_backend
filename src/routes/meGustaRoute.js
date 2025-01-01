const {
  darMegusta,
  verificarMeGusta,
} = require("../controllers/meGustaController");
const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");

const routerMeGusta = express.Router();

routerMeGusta.route("/:id").post(verifyJwt, darMegusta);

routerMeGusta.route("/:userId/:publicacionId").get(verifyJwt, verificarMeGusta);

module.exports = routerMeGusta;
