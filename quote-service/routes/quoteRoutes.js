const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const verifyToken = require('../middlewares/authMiddleware');
const multer = require('multer');   
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Quotes
 *   description: APIs for managing quotes
 */
/**
 * @swagger
 * /quote:
 *   post:
 *     summary: Create a new quote
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - subCategoryId
 *               - title
 *               - language
 *             properties:
 *               userId:
 *                 type: string
 *               subCategoryId:
 *                 type: string
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *               language:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Quote created successfully
 */
router.post('/', verifyToken, quoteController.createQuote);

/**
 * @swagger
 * /quote:
 *   get:
 *     summary: Get all quotes
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all quotes
 */
router.get('/', verifyToken, quoteController.getAllQuotes);

/**
 * @swagger
 * /quote/{id}:
 *   get:
 *     summary: Get a quote by ID
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The quote ID
 *     responses:
 *       200:
 *         description: Quote retrieved successfully
 */
router.get('/:id', verifyToken, quoteController.getQuoteById);

/**
 * @swagger
 * /quote/sub-category/{id}:
 *   get:
 *     summary: Get quotes by sub-category ID
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Sub-category ID
 *     responses:
 *       200:
 *         description: List of quotes under the sub-category
 */
router.get('/sub-category/:id', verifyToken, quoteController.getQuotesBySubcategory);
/**
 * @swagger
 * /quote/{id}:
 *   put:
 *     summary: Update a quote by ID
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Quote ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               subCategoryId:
 *                 type: string
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *               language:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Quote updated successfully
 *       404:
 *         description: Quote not found
 */
router.put('/:id', verifyToken, quoteController.updateQuote);

/**
 * @swagger
 * /quote/{id}:
 *   delete:
 *     summary: Delete a quote by ID
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Quote ID
 *     responses:
 *       200:
 *         description: Quote deleted successfully
 */
router.delete('/:id', verifyToken, quoteController.deleteQuote);

/**
 * @swagger
 * /quote/import:
 *   post:
 *     summary: Import quotes (e.g., from a file)
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quotes imported successfully
 */
router.post('/import', verifyToken, quoteController.importQuotes);

/**
 * @swagger
 * /quote/export/data:
 *   get:
 *     summary: Export all quotes data
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quotes exported successfully
 */
router.get('/export/data', verifyToken, quoteController.exportQuotes);

module.exports = router;
