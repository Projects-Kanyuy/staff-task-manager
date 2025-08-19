// middleware/cloudinaryUploadMiddleware.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'staff-task-uploads', // A folder name in your Cloudinary account
        allowed_formats: ['jpeg', 'jpg', 'png', 'webp'],
        // You can add transformations here if you want
        // transformation: [{ width: 800, height: 600, crop: 'limit' }]
    }
});

// Initialize multer with the Cloudinary storage engine
const uploadCloudinary = multer({ 
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB file size limit
});

module.exports = uploadCloudinary;