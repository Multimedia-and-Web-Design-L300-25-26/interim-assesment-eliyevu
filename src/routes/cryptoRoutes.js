import { Router } from 'express';
import { getAllCryptos, getTopGainers, getNewListings, createCrypto } from '../controllers/CryptoController.js';

const router = Router();

// Routes
router.get('/', getAllCryptos);
router.get('/gainers', getTopGainers);
router.get('/new', getNewListings);
router.post('/', createCrypto);

export default router;