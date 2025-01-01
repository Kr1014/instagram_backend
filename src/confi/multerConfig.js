const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de Multer con Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "reels_videos", // Carpeta en Cloudinary
    resource_type: "video", // Especifica que es un recurso de video
    format: async (req, file) => "mp4", // Formato de video opcional
  },
});

// Middleware de Multer
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["video/mp4", "video/webm", "video/ogg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de archivo no permitido. Solo se permiten videos."));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // Límite de 50 MB
});

module.exports = upload;
