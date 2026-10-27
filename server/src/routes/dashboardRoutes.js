import express from 'express';
import { getSummary, getCashflow, getCategories } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/summary', getSummary);
router.get('/cashflow', getCashflow);
router.get('/categories', getCategories);

export default router;
