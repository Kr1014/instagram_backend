const sequelize = require("../utils/connection");

const PublicacionesGuardada = sequelize.define("publicacionesGuardada", {});

module.exports = PublicacionesGuardada;
