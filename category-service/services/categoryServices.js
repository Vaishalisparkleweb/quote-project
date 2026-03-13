const Category = require('../models/Category');
const axios = require('axios');

exports.createCategory = async (req) => {
    const { name, UserId, status } = req.body;
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    if (!name || !UserId || !status) {
        throw new Error('All fields (name, UserId, status) are required');
    }
    const userResponse = await axios.get(`${process.env.USER_SERVICE}/${UserId}`, {
        headers: {
            Authorization: token,
        },
    });
    const user = userResponse.data;

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const existingCategory = await Category.findOne({ isDeleted: false,name :name  });
    if (existingCategory) {
        throw new Error('Category name already exists');
    }

    const category = new Category({ ...req.body, isDeleted: false });
    return await category.save();
};

exports.getAllCategories = async (query) => {
    const {
      page = 1,
      limit = 10,
      sortField = 'createdAt',
      sortOrder = 'descend',
      search = '',
    } = query;
  
    const searchFilter = {
      isDeleted: false,
      ...(search && {
        name: { $regex: search, $options: 'i' }, // Adjust if your field name is different
      }),
    };
  
    const sortOptions = {
      [sortField]: sortOrder === 'ascend' ? 1 : -1,
    };
  
    const categories = await Category.find(searchFilter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));
  
    const totalCount = await Category.countDocuments(searchFilter);
  
    return {
      categories,
      totalCount,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / limit),
    };
  };

exports.getCategoryById = async (req) => {


    try {
        const category = await Category.findOne({ _id: req.params.id, isDeleted: false });
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Authorization token is required' });
        }
        if (!category) {
            return { error: 'Category not found' };
        }

        const userResponse = await axios.get(`${process.env.USER_SERVICE}/${category.UserId}`, {
            headers: {
                Authorization: token,
            },
        });

        const user = await userResponse.data;

        if (!user) {
            return { error: 'User not found' };
        }

        const categoryResponse = category.toObject();
        categoryResponse.user = user;

        return categoryResponse;

    } catch (error) {
        if (error.response) {
            if (error.response.status === 500) {
                return { error: 'User service is unavailable' };
            } else if (error.response.status >= 300 && error.response.status < 400) {
                return { error: 'Token issue or other user service error' };
            } else {
                return { error: error.response.data.message || 'An error occurred while fetching user data' };
            }
        } else {
            return { error: 'Internal server error' };
        }
    }
};

exports.updateCategory = async (req) => {
    const { id } = req.params;
    const { name, UserId, status } = req.body;
    const token = req.headers.authorization;
  
    if (!token) {
      throw new Error('Authorization token is required');
    }
  
    const userResponse = await axios.get(`${process.env.USER_SERVICE}/${UserId}`, {
      headers: {
        Authorization: token,
      },
    });
    const user = userResponse.data;
  
    if (!user) {
      throw new Error('User not found');
    }
  
    const existingCategory = await Category.findOne({ _id: id, isDeleted: false });
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    existingCategory.name = name;
    existingCategory.UserId = UserId;
    existingCategory.status = status;
  
    return await existingCategory.save();
  };
  
  exports.deleteCategory = async (req) => {
    const { id } = req.params;
    const token = req.headers.authorization;
  
    if (!token) {
      throw new Error('Authorization token is required');
    }
  
    const category = await Category.findOne({ _id: id, isDeleted: false });
    if (!category) {
      throw new Error('Category not found');
    }
  
    category.isDeleted = true;
    return await category.save();
  };