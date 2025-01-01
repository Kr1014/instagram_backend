"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Reels", "publicId", {
      type: Sequelize.STRING,
      allowNull: true, // Cambia esto si no quieres permitir valores nulos
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Reels", "publicId");
  },
};
