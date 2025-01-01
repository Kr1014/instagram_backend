const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "reels_videos", // Carpeta donde se guardarán los videos
    resource_type: "video", // Especificamos que es un recurso de tipo video
    format: async (req, file) => "mp4", // Formato de video (opcional)
  },
});

// Middleware de Multer para la subida
const upload = multer({ storage });

module.exports = { upload, cloudinary };
