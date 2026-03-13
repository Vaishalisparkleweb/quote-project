const express = require('express');
const router = express.Router();
const multer = require('multer');
const subcategoryController = require('../controllers/SubCategoryController');
const verifyToken = require('../middlewares/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Subcategories
 *   description: Subcategory management APIs
 */

/**
 * @swagger
 * /sub-category:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [Subcategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subcategoryName
 *               - categoryId
 *               - image
 *               - status
 *             properties:
 *               subcategoryName:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               image:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', verifyToken, subcategoryController.createSubcategory);

/**
 * @swagger
 * /sub-category:
 *   get:
 *     summary: Get all subcategories
 *     tags: [Subcategories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all subcategories
 */
router.get('/', verifyToken, subcategoryController.getAllSubcategories);

/**
 * @swagger
 * /sub-category/{id}:
 *   get:
 *     summary: Get a subcategory by ID
 *     tags: [Subcategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory data
 *       404:
 *         description: Subcategory not found
 */
router.get('/:id', verifyToken, subcategoryController.getSubcategoryById);

/**
 * @swagger
 * /sub-category/category/{id}:
 *   get:
 *     summary: Get subcategories by category ID
 *     tags: [Subcategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of subcategories per page
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *           enum: [name, createdAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ascend, descend]
 *           default: descend
 *         description: Sort order (ascending or descending)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword (applied to subcategory name)
 *     responses:
 *       200:
 *         description: Subcategories under specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subcategories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subcategory'
 *                 totalCount:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       404:
 *         description: Category or subcategories not found
 */
router.get('/category/:id', verifyToken, subcategoryController.getSubcategoriesByCategoryId);

/**
 * @swagger
 * /sub-category/{id}:
 *   put:
 *     summary: Update a subcategory by ID
 *     tags: [Subcategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcategory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subcategoryName:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               image:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *       404:
 *         description: Subcategory not found
 */

router.put('/:id', verifyToken, subcategoryController.updateSubcategory);

/**
 * @swagger
 * /sub-category/{id}:
 *   delete:
 *     summary: Delete a subcategory by ID
 *     tags: [Subcategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 *       404:
 *         description: Subcategory not found
 */
router.delete('/:id', verifyToken, subcategoryController.deleteSubcategory);

module.exports = router;
