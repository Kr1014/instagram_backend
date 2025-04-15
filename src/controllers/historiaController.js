const catchError = require("../utils/catchError");
const Historia = require("../models/Historia");
const User = require("../models/User");
const Seguidor = require("../models/Seguidor");
const { Op } = require("sequelize");

const getAll = catchError(async (req, res) => {
  const historias = await Historia.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "userName", "photoProfile"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return res.json(historias);
});

const getHistoriasSeguidos = catchError(async (req, res) => {
  const userId = req.user.id;

  const usuario = await User.findByPk(userId, {
    include: {
      model: User,
      as: "seguidos",
      attributes: ["id"],
    },
  });

  if (!usuario || !usuario.seguidos.length) {
    return res.json([]); // Si no sigue a nadie, retorna un array vacío
  }

  const idsSeguidos = usuario.seguidos.map((s) => s.id);
  console.log("Usuarios seguidos:", idsSeguidos);

  // 🔹 Buscar historias solo de los usuarios seguidos
  const historias = await Historia.findAll({
    where: { userId: { [Op.in]: idsSeguidos } }, // ✅ Filtrar por los usuarios seguidos
    include: [
      {
        model: User,
        attributes: ["id", "userName", "photoProfile"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return res.json(historias);
});

const create = catchError(async (req, res) => {
  const userId = req.user.id;
  const { description } = req.body;

  let contentUrl = null;
  if (req.file) {
    contentUrl = req.file.path;
  } else {
    return res
      .status(400)
      .json({ error: "Debe incluir una imagen o un video" });
  }

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Expira en 24 horas

  const newHistoria = await Historia.create({
    userId,
    contentUrl,
    description,
    expiresAt,
  });

  return res.status(201).json(newHistoria);
});

const remove = catchError(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const result = await Historia.destroy({ where: { id, userId } });
  if (!result) return res.sendStatus(404);
  return res.sendStatus(204);
});

module.exports = {
  getAll,
  create,
  remove,
  getHistoriasSeguidos,
};
