const catchError = require("../utils/catchError");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Publicacion = require("../models/Publicacion");

const getAll = catchError(async (req, res) => {
  const results = await User.findAll({
    include: [
      {
        model: Publicacion,
        attributes: ["id", "contentUrl", "description"],
      },
      {
        model: User,
        as: "seguidores",
        attributes: ["id", "userName", "photoProfile"],
        through: { attributes: [] },
      },
      {
        model: User,
        as: "seguidos",
        attributes: ["id", "userName", "photoProfile"],
        through: { attributes: [] },
      },
    ],
  });
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  const photoProfileUrl = req.file ? req.file.path : null;

  const newUser = await User.create({
    firstName,
    lastName,
    userName,
    email,
    password,
    photoProfile: photoProfileUrl,
  });

  return res.status(201).json(newUser);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.findByPk(id, {
    include: [
      {
        model: Publicacion,
        attributes: ["id", "contentUrl", "description"],
      },
      {
        model: User,
        as: "seguidores",
        attributes: ["id", "userName"],
      },
      {
        model: User,
        as: "seguidos",
        attributes: ["id", "userName"],
        through: { attributes: [] },
      },
    ],
  });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.destroy({ where: { id } });
  if (!result) return res.sendStatus(404);
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.update(req.body, {
    where: { id },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

const login = catchError(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: User,
        as: "seguidos",
        attributes: ["id", "firstName", "lastName", "userName", "photoProfile"],
        through: { attributes: [] },
      },
    ],
  });
  if (!user) {
    return res.status(401).json("Este correo no existe");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json("Contrasena incorrecta");
  }

  const token = jwt.sign({ user }, process.env.TOKEN_SECRET);

  return res.json({ user, token });
});

const obtenerUsuario = catchError(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findByPk(userId, {
    attributes: [
      "id",
      "userName",
      "email",
      "photoProfile",
      "firstName",
      "lastName",
    ],
    include: [
      {
        model: User,
        as: "seguidores",
        attributes: ["id", "userName"],
        through: { attributes: [] },
      },
      {
        model: User,
        as: "seguidos",
        attributes: ["id", "userName", "photoProfile", "firstName", "lastName"],
        through: { attributes: [] },
      },
    ],
  });
  if (!user) {
    return res.status(404).json({ mensaje: "Usuario no encontrado" });
  }
  return res.json(user);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
  login,
  obtenerUsuario,
};
