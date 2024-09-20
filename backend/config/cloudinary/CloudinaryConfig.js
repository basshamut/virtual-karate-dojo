const CloudinaryConfig = {}

const {v2: cloudinary} = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});


CloudinaryConfig.getSettings = function(){
    return cloudinary;
}

module.exports = CloudinaryConfig