const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "reels_videos",
    resource_type: "video",
    format: async (req, file) => "mp4",
  },
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pictures",
    resource_type: "image",
    format: async (req, file) => "jpg",
  },
});

const uploadVideo = multer({ storage: videoStorage });
const uploadImage = multer({ storage: imageStorage });

module.exports = { uploadVideo, uploadImage, cloudinary };
