import express from 'express';
import {
  getSweets,
  createSweet,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from '../controllers/sweetController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Search (Placed before /:id to avoid conflict)
router.get('/search', protect, searchSweets);

// Protected & Admin routes
router.route('/')
  .get(protect, getSweets)
  .post(protect, admin, createSweet);

router.route('/:id')
  .put(protect, admin, updateSweet)
  .delete(protect, admin, deleteSweet);

router.post('/:id/purchase', protect, purchaseSweet);
router.post('/:id/restock', protect, admin, restockSweet);

export default router;