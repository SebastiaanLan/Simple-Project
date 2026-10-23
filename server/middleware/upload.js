import multer from 'multer';

export const uploadAvatar = multer ({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 2 * 1024 * 1024,
        files: 1
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/png',
            'image/jpeg',
            'image/webp'
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPEG, PNG and WebP images are allowed'))
        }

        cb(null, true);
    }
});