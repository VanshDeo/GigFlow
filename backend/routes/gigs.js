
import express from 'express';
import { getGigs, createGig, getMyGigs, getGigById } from '../controllers/gigController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getGigs)
    .post(protect, createGig);

router.get('/my', protect, getMyGigs);
router.get('/:id', getGigById);

export default router;
