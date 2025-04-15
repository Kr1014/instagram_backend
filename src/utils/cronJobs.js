const cron = require("node-cron");
const Historia = require("../models/Historia");
const { Op } = require("sequelize");

cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const result = await Historia.destroy({
      where: { expiresAt: { [Op.lte]: now } },
    });
    console.log(`Historias eliminadas: ${result}`);
  } catch (error) {
    console.error("Error eliminando historias vencidas:", error);
  }
});
