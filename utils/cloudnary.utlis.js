const cloudnary = require('cloudinary').v2;

cloudnary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadToCloudinary = async (filePath, folder = "profilePicture") => {
    try {
        const result = await cloudnary.uploader.upload(filePath, {
            folder: folder,                                 // Creates folder in Cloudinary dashboard
            resource_type: 'image',                         // Tells Cloudinary it's an image
            transformation: [
                {width: 500, height: 500, crop: 'limit'},    // Max dimensions
                { quality: 'auto' }                           // Auto-optimize quality
            ]
        });
        return {
            url: result.secure_url,                             // HTTPS URL to display image
            public_id: result.public_id                         // Unique ID to delete later
        }
    } catch (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`)
    }
}

const deleteFromCloudinary = async (public_id) => {
    try {
        await cloudnary.uploader.destroy(public_id)              // Removes image from Cloudinary
        return true
    } catch (error) {
        throw new Error(`Cloudnary deleted failed: ${error.message}`)
    }
}


const uploadResumeToCloudnary = async (filePath, folder = "resume") => {
    try {
        const resume = await cloudnary.uploader.upload(filePath, {
            folder: folder,
            resource_type: 'auto',
            use_filename: true,
            unique_filename: true,
            format: 'pdf',
            flags: 'attachment',
            access_mode: 'public'
        })
        return {
            url: resume.secure_url,
            public_id: resume.public_id
        }
    } catch (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`)
    }
}

const deleteResumeFromCloudinary = async(public_id) => {
    try {
        await cloudnary.uploader.destroy(public_id)
        return true
    } catch (error) {
        throw new Error(`Cloudnary deleted failed: ${error.message}`)
    }
}

module.exports = {uploadToCloudinary, deleteFromCloudinary, uploadResumeToCloudnary, deleteResumeFromCloudinary}