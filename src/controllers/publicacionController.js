const catchError = require("../utils/catchError");
const Publicacion = require("../models/Publicacion");
const User = require("../models/User");
const Comentarios = require("../models/Comentarios");
const MeGusta = require("../models/MeGusta");
const { Sequelize } = require("sequelize");

const getAll = catchError(async (req, res) => {
  const results = await Publicacion.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: User,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: User,
        as: "likers",
        attributes: ["id", "userName"],
        through: { attributes: [] },
      },
      {
        model: Comentarios,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: User,
            attributes: ["id", "userName", "photoProfile"],
          },
        ],
      },
    ],
  });

  return res.json(results);
});

const create = catchError(async (req, res) => {
  console.log(req.user);
  const userId = req.user.id;
  const { image, description } = req.body;
  const result = await Publicacion.create({ userId, image, description });
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await Publicacion.findByPk(id, {
    where: { userId },
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: User,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: User,
        as: "likers",
        attributes: ["id", "userName"],
      },
      {
        model: Comentarios,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: User,
            attributes: ["id", "userName", "photoProfile"],
          },
        ],
      },
    ],
  });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const userId = req.user.id;

  const { id } = req.params;
  const result = await Publicacion.destroy({ where: { id, userId } });
  if (!result) return res.sendStatus(404);
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  delete req.body.userId;

  const result = await Publicacion.update(req.body, {
    where: { id, userId },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

const explorar = catchError(async (req, res) => {
  try {
    const publicacion = await Publicacion.findAll({
      order: Sequelize.literal("RANDOM()"),
      include: [
        {
          model: User,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Comentarios,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    return res.json(publicacion);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener publicaciones" });
    console.error(e);
  }
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
  explorar,
};
