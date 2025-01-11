import express from 'express';
import multer from 'multer';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { auth } from '../middleware/auth.js';
import { validateProduct } from '../middleware/validators.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const mediaUpload = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'videos', maxCount: 2 }
]);

router.get('/', getProducts);
router.post('/', auth, mediaUpload, validateProduct, createProduct);
router.put('/:id', auth, mediaUpload, validateProduct, updateProduct);
router.delete('/:id', auth, deleteProduct);

export default router;