const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Historia = sequelize.define("historia", {
  contentUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Historia.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = Historia;
