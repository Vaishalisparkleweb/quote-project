const express = require('express');
const router = express.Router();
const quoteTypeController = require('../controllers/QuoteTypeController');
const verifyToken = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Quote Types
 *   description: APIs for managing quote types
 */

/**
 * @swagger
 * /quote-interaction:
 *   post:
 *     summary: Track a quote interaction (like, view, download)
 *     tags: [Quote Interactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quoteId
 *               - userId
 *               - type
 *             properties:
 *               quoteId:
 *                 type: string
 *               userId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [download, view, like]
 *     responses:
 *       201:
 *         description: Interaction recorded successfully
 *       400:
 *         description: Invalid input or duplicate entry
 */
router.post('/', verifyToken, quoteTypeController.createQuoteType);

/**
 * @swagger
 * /quote-type:
 *   get:
 *     summary: Get all quote types with details
 *     tags: [Quote Types]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all quote types with details
 */
router.get('/', verifyToken, quoteTypeController.getAllQuotesWithDetails);

/**
 * @swagger
 * /quote-type/{type}:
 *   get:
 *     summary: Get records by quote type
 *     tags: [Quote Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: type
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Quote type
 *     responses:
 *       200:
 *         description: Records for the specified quote type
 */
router.get('/:type', verifyToken, quoteTypeController.getRecordsByType);

/**
 * @swagger
 * /quote-type/dashboardData/getCount:
 *   get:
 *     summary: Get total counts for dashboard
 *     tags: [Quote Types]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Count of all quote types for dashboard
 */
router.get('/dashboardData/getCount', verifyToken, quoteTypeController.getAllCount);

/**
 * @swagger
 * /quote-type/{id}:
 *   delete:
 *     summary: Delete a quote type by ID
 *     tags: [Quote Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Quote type ID
 *     responses:
 *       200:
 *         description: Quote type deleted successfully
 */
router.delete('/:id', verifyToken, quoteTypeController.deleteQuoteType);

module.exports = router;
