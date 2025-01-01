const catchError = require("../utils/catchError");
const Reel = require("../models/Reel");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2; // Asegúrate de importar la configuración de Cloudinary
const fs = require("fs/promises"); // Para eliminar el archivo local después de subirlo

// Obtener todos los Reels con información del usuario
const getAll = catchError(async (req, res) => {
  const results = await Reel.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  });
  return res.json(results);
});

// Crear un nuevo Reel y subir video a Cloudinary
const create = catchError(async (req, res) => {
  const userId = req.user.id;
  const { description } = req.body;

  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No se envió ningún archivo de video" });
  }

  // Cloudinary ya maneja la subida automáticamente
  const uploadedVideo = req.file;

  // Crear el Reel con la URL del video y el public_id
  const result = await Reel.create({
    userId,
    videoUrl: uploadedVideo.path, // URL pública de Cloudinary
    publicId: uploadedVideo.filename, // ID único en Cloudinary
    description,
  });

  return res.status(201).json(result);
});

// Obtener un Reel por ID
const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Reel.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

// Eliminar un Reel por ID
const remove = catchError(async (req, res) => {
  const { id } = req.params;

  // Buscar el Reel para obtener el public_id
  const reel = await Reel.findByPk(id);
  if (!reel) return res.sendStatus(404);

  // Eliminar el video de Cloudinary
  await cloudinary.uploader.destroy(reel.publicId, {
    resource_type: "video",
  });

  // Eliminar el Reel de la base de datos
  const result = await Reel.destroy({ where: { id } });
  if (!result) return res.sendStatus(404);

  return res.sendStatus(204);
});

// Actualizar un Reel por ID
const update = catchError(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  delete req.body.publicId;
  delete req.user.id;

  const result = await Reel.update(req.body, {
    where: { id, userId },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
};
