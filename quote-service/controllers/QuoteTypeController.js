const quoteService = require('../services/QuoteTypeServices');

exports.createQuoteType = async (req, res) => {
  try {
    const quote = await quoteService.createQuoteType(req,res);
    res.status(201).json({ message: 'Quote created successfully', quote });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllQuotesWithDetails = async (req, res) => {
  try {
    const quotes = await quoteService.getAllQuotesWithDetails(req,res);
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCount = async (req, res) => {
    try {
      const quotes = await quoteService.getAllCount(req,res);
      res.status(200).json(quotes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
exports.getRecordsByType = async (req, res) => {
  try {
    const quote = await quoteService.getRecordsByType(req,res);
    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteQuoteType = async (req, res) => {
  try {
    const updatedQuote = await quoteService.deleteQuoteType(req,res);
    res.status(200).json({ message: 'Quote updated successfully', quote: updatedQuote });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

