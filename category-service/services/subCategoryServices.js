const Subcategory = require('../models/SubCategory');
const axios = require('axios');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image');

exports.createSubcategory = async (req, res) => {
  upload(req, res, async (err) => {
   
      const token = req.headers.authorization;
      if (!token) {
        throw new Error('Authorization token is required');
      }

      console.log(req.body);

      const { categoryId, subcategoryName, userId, status } = req.body;

      if (!categoryId || !subcategoryName || !userId ) {
        throw new Error('All fields (categoryId, subcategoryName, userId, status) are required');
      }

      const userResponse = await axios.get(`${process.env.USER_SERVICE}/${userId}`, {
        headers: { Authorization: token },
      });

      const user = userResponse.data;
      if (!user) {
        throw new Error('User not found');
      }

      const existingSubcategory = await Subcategory.findOne({ subcategoryName, isDeleted: false });
      if (existingSubcategory) {
        throw new Error('Subcategory already exists');
      }

      let imageBuffer = null;
      if (req.file) {
        imageBuffer = req.file.buffer;
      }

      const subcategory = new Subcategory({
        categoryId,
        subcategoryName,
        userId,
        status,
        isDeleted: false,
      });

      await subcategory.save();

  
  });
};

exports.getAllSubcategories = async () => {
  const subcategories = await Subcategory.find({ isDeleted: false });

  return subcategories
};

exports.getSubcategoriesByCategoryId = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 10,
      sortField = 'createdAt',
      sortOrder = 'descend',
      search = '',
    } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Category ID is required' });
    }

    const searchFilter = {
      categoryId: id,
      isDeleted: false,
      ...(search && {
        name: { $regex: search, $options: 'i' }, // Change "name" if your field is different
      }),
    };

    const sortOptions = {
      [sortField]: sortOrder === 'ascend' ? 1 : -1,
    };

    const subcategories = await Subcategory.find(searchFilter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalCount = await Subcategory.countDocuments(searchFilter);

    if (!subcategories || subcategories.length === 0) {
      return res.status(404).json({ message: 'No subcategories found for the given category ID' });
    }

    return res.status(200).json({
      subcategories,
      totalCount,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getSubcategoryById = async (req) => {
  const subcategory = await Subcategory.findOne({ _id: req.params.id, isDeleted: false }).populate('categoryId');
  if (!subcategory) {
    throw new Error('Subcategory not found');
  }

  const token = req.headers.authorization;
  if (!token) {
    throw new Error('Authorization token is required');
  }

  const userResponse = await axios.get(`${process.env.USER_SERVICE}/${subcategory.userId}`, {
    headers: {
      Authorization: token,
    },
  });

  const user = userResponse.data;
  if (!user) {
    throw new Error('User not found');
  }

  const subcategoryResponse = subcategory.toObject();
  subcategoryResponse.user = user;

  return subcategoryResponse;
};
exports.updateSubcategory = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'Error processing file upload' });
    }


      const { id } = req.params;
      const token = req.headers.authorization;

      if (!token) {
        throw new Error('Authorization token is required');
      }

      console.log(req.body);

      const { categoryId, subcategoryName, userId, status } = req.body;

      if (!categoryId || !subcategoryName || !userId || typeof status === 'undefined') {
        throw new Error('All fields (categoryId, subcategoryName, userId, status) are required');
      }

      console.log(id);
      const subcategory = await Subcategory.findOne({ _id: req.params.id, isDeleted: false });
      if (!subcategory) {
        throw new Error('Subcategory not found');
      }

      if (req.file) {
        subcategory.image = req.file.buffer; 
      }

      subcategory.categoryId = categoryId;
      subcategory.subcategoryName = subcategoryName;
      subcategory.userId = userId;
      subcategory.status = status;

      await subcategory.save();

      res.status(200).json({ message: 'Subcategory updated successfully', subcategory });
    
  });
};

exports.deleteSubcategory = async (req) => {
  const { id } = req.params;

  const subcategory = await Subcategory.findOne({ _id: id, isDeleted: false });
  if (!subcategory) {
    throw new Error('Subcategory not found');
  }

  subcategory.isDeleted = true;
  return await subcategory.save();
};
