const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const MeGusta = sequelize.define("meGusta", {});

module.exports = MeGusta;
