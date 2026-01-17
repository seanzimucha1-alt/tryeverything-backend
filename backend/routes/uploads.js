const express = require('express');
const multer = require('multer');
const supabase = require('../supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed'));
        }
    }
});

// Upload file
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.file;
        const fileName = `${Date.now()}_${file.originalname}`;
        const filePath = `products/${fileName}`; // Organize by folder

        const { data, error } = await supabase.storage
            .from('uploads') // Bucket name
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('uploads')
            .getPublicUrl(filePath);

        res.json({
            message: 'File uploaded successfully',
            fileName,
            url: publicUrl
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;