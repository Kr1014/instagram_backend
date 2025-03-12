const catchError = require("../utils/catchError");
const Publicacion = require("../models/Publicacion");
const User = require("../models/User");
const Comentarios = require("../models/Comentarios");
const MeGusta = require("../models/MeGusta");
const { Sequelize, Op } = require("sequelize");

const getAll = catchError(async (req, res) => {
  const results = await Publicacion.findAll({
    include: [
      {
        model: User,
        attributes: { exclude: [""] },
        include: [
          {
            model: User,
            as: "seguidores",
            attributes: { exclude: [""] },
          },
          {
            model: User,
            as: "seguidos",
            attributes: { exclude: [""] },
          },
          {
            model: Publicacion,
            attributes: { exclude: [""] },
          },
        ],
      },

      {
        model: User,
        as: "likers",
        attributes: ["id", "userName", "photoProfile", "firstName", "lastName"],
        through: { attributes: [] },
        include: [
          {
            model: Publicacion,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: User,
            as: "seguidores",
            attributes: ["id", "userName"],
            through: { attributes: [] },
          },
          {
            model: User,
            as: "seguidos",
            attributes: [
              "id",
              "userName",
              "photoProfile",
              "firstName",
              "lastName",
            ],
            through: { attributes: [] },
          },
        ],
      },
      {
        model: Comentarios,
        include: [
          {
            model: User,
            attributes: ["id", "userName", "photoProfile"],
          },
          {
            model: User,
            as: "likers",
            through: { attributes: [] },
          },
          {
            model: Comentarios,
            as: "respuestas",
            include: [
              {
                model: User,
                attributes: ["id", "userName", "photoProfile"],
              },
              {
                model: User,
                as: "likers",
                through: { attributes: [] },
              },
            ],
          },
        ],
      },
    ],
  });

  return res.json(results);
});

const getVideos = catchError(async (req, res) => {
  try {
    const videosUrl = await Publicacion.findAll({
      where: {
        contentUrl: {
          [Op.or]: [{ [Op.endsWith]: ".mp4" }, { [Op.endsWith]: ".webm" }],
        },
      },
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
    return res.json(videosUrl).sendStatus(200);
  } catch (error) {
    console.error("Error al obtener los videos", error.message);
    res.status(500).json({ message: "Error al obtener los videos" });
  }
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

  const newPublicacion = await Publicacion.create({
    userId,
    contentUrl,
    description,
  });

  return res.status(201).json(newPublicacion);
});

const getOne = catchError(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await Publicacion.findByPk(id, {
    where: { userId },
    attributes: { exclude: [""] },
    include: [
      {
        model: User,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: Publicacion,
            attributes: { exclude: ["updatedAt"] },
          },
          {
            model: User,
            as: "seguidos",
            attributes: { exclude: [""] },
          },
          {
            model: User,
            as: "seguidores",
            attributes: { exclude: [""] },
          },
        ],
      },
      {
        model: User,
        as: "likers",
        attributes: { exclude: [""] },
        include: [
          {
            model: Publicacion,
            attributes: { exclude: [""] },
          },
          {
            model: User,
            as: "seguidores",
            attributes: { exclude: [""] },
          },
          {
            model: User,
            as: "seguidos",
            attributes: { exclude: [""] },
          },
        ],
      },
      {
        model: Comentarios,
        attributes: { exclude: [""] },
        include: [
          {
            model: User,
            attributes: { exclude: [""] },
            include: [
              {
                model: Publicacion,
              },
              {
                model: User,
                as: "seguidores",
                attributes: { exclude: [""] },
              },
              {
                model: User,
                as: "seguidos",
                attributes: { exclude: [""] },
              },
            ],
          },
          {
            model: Comentarios,
            as: "respuestas",
            attributes: { exclude: [""] },
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
          include: [
            {
              model: User,
              as: "seguidores",
              attributes: { exclude: [""] },
            },
            {
              model: User,
              as: "seguidos",
              attributes: { exclude: [""] },
            },
            {
              model: Publicacion,
              attributes: { exclude: [""] },
            },
          ],
        },
        {
          model: Comentarios,
          attributes: { exclude: [""] },
          include: [
            {
              model: Comentarios,
              as: "respuestas",
              include: [
                {
                  model: User,
                  attributes: ["id", "userName", "photoProfile"],
                },
                {
                  model: User,
                  as: "likers",
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: "likers",
          attributes: { exclude: [""] },
          include: [
            {
              model: User,
              as: "seguidores",
              attributes: { exclude: [""] },
            },
            {
              model: User,
              as: "seguidos",
              attributes: { exclude: [""] },
            },
            {
              model: Publicacion,
              attributes: { exclude: [""] },
            },
          ],
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
  getVideos,
  create,
  getOne,
  remove,
  update,
  explorar,
};
