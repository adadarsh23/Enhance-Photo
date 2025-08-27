import express from 'express';
import multer from 'multer';
import { uploadImage, enhanceImage, downloadImage } from '../controllers/imageController.js';

const router = express.Router();

// Use multer memory storage for in-memory uploads
const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.post('/upload', upload.single('image'), uploadImage);
router.post('/enhance', enhanceImage);
router.get('/download/:id', downloadImage);

export default router;
