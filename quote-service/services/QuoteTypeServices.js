const axios = require('axios');
const Quote = require('../models/Quote');
const QuoteTypeModal = require('../models/QuoteTypeModal');

const fetchData = async (url, token) => {
  const response = await axios.get(url, { headers: { Authorization: token } });
  return response.data;
};
exports.getAllCount = async (req, res) => {
 
    const token = req.headers.authorization;
    if (!token) {
      throw new Error('Authorization token is required');
    }

    const quotes = await Quote.find({ isDeleted: false });

    const user = await fetchData(`${process.env.USER_SERVICE}`, token);
    const subcategory = await fetchData(`${process.env.SUBCATEGORY_SERVICE}`, token);
console.log(user);
    const countData = {
     
      subCategoryCount: subcategory?.length,
      quoteCount: quotes?.length,
      userCount: user?.totalCount,
    };

    return countData;
 
};
exports.getAllQuotesWithDetails = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error('Authorization token is required');
    }

    const quotes = await QuoteTypeModal.find({ isDeleted: false });

    return quotes ;
 
};

exports.createQuoteType = async (req, res) => {
    const { quoteId, userId, type } = req.body;

    if (!quoteId || !userId || !type) {
      throw new Error('All fields (quoteId, userId, type) are required');
    }

    if (!['download', 'view', 'like'].includes(type)) {
      throw new Error('Invalid type. Valid types are download, view, like');
    }

    const entry = new QuoteTypeModal({ quoteId, userId, type });
    await entry.save();

   
};

exports.getRecordsByType = async (req, res) => {
    const { type } = req.params;
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    if (!['download', 'view', 'like'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Valid types are download, view, like' });
    }

    const subCategoryMap = {};

    // Fetch all records of the given type
    const records = await QuoteTypeModal.find({ type, isDeleted: false });

    // Process records in parallel
    await Promise.all(
      records.map(async (record) => {
        const quote = await Quote.findById(record.quoteId);
        const subcategory = await fetchData(
          `${process.env.SUBCATEGORY_SERVICE}/${quote.subCategoryId}`,
          token
        );

        const subCategoryKey = `${subcategory.subcategoryName}_${subcategory.categoryId.name}`;

        if (!subCategoryMap[subCategoryKey]) {
          subCategoryMap[subCategoryKey] = {
            subcategory: subcategory.subcategoryName,
            category: subcategory.categoryId.name,
            quotes: [],
          };
        }

        subCategoryMap[subCategoryKey].quotes.push({
          quoteId: record.quoteId,
          image: quote.image,
        });
      })
    );

    const response = Object.values(subCategoryMap).map((entry) => ({
      subcategory: entry.subcategory,
      category: entry.category,
      quoteCount: entry.quotes.length,
      quotes: entry.quotes,
    }));

    return response
  
};

exports.deleteQuoteType = async (req, res) => {
    const { id } = req.params;
    const record = await QuoteTypeModal.findById(id);

    if (!record) {
      throw new Error('Record not found');
    }

    record.isDeleted = true;
    await record.save();

};
