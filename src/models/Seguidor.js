const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Seguidor = sequelize.define('seguidor', {});

module.exports = Seguidor;