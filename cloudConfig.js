const cloudinary = require('cloudinary').v2;  // ✅ always use .v2, even with v2 SDK
const { CloudinaryStorage } = require('multer-storage-cloudinary-v2');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,          
  params: {
    folder: 'mini_AirBNB_DEV',
    allowedFormats : ["png","jpg","jpeg"],
  },
});

module.exports={
    cloudinary,
    storage,
};