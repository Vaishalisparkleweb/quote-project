const subcategoryService = require('../services/subCategoryServices');

exports.createSubcategory = async (req, res) => {
  try {
    await subcategoryService.createSubcategory(req, res);
    res.status(201).json({ message: 'Subcategory created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSubcategories = async (req, res) => {
  try {
    
    const subcategories = await subcategoryService.getAllSubcategories(req, res);
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await subcategoryService.getSubcategoryById(req, res);
    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubcategoriesByCategoryId = async (req, res) => {
  console.log(req);
  try {
    const subcategory = await subcategoryService.getSubcategoriesByCategoryId(req, res);
    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const updatedSubcategory = await subcategoryService.updateSubcategory(req, res);
    res.status(200).json({ message: 'Subcategory updated successfully', subcategory: updatedSubcategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const deletedSubcategory = await subcategoryService.deleteSubcategory(req, res);
    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
