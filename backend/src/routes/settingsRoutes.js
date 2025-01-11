import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { auth } from '../middleware/auth.js';
import { validateSettings } from '../middleware/validators.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', auth, validateSettings, updateSettings);

export default router;