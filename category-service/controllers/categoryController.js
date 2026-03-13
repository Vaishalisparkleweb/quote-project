  const categoryService = require('../services/categoryServices');

  exports.createCategory = async (req, res) => {
    try {
    await categoryService.createCategory(req,res);
      res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.getAllCategories = async (req, res) => {
    try {
      const categories = await categoryService.getAllCategories(req, res);
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.getCategoryById = async (req, res) => {
    try {
      const category = await categoryService.getCategoryById(req, res);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.updateCategory = async (req, res) => {
    try {
      const updatedCategory = await categoryService.updateCategory(req, res);
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.deleteCategory = async (req, res) => {
    try {
      const deletedCategory = await categoryService.deleteCategory(req, res);
      if (!deletedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
