const quoteService = require('../services/quoteServices');

exports.createQuote = async (req, res) => {
  try {
   await quoteService.createQuote(req, res);
    res.status(201).json({ message: 'Quote created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllQuotes = async (req, res) => {
  try {
    const quotes = await quoteService.getAllQuotes(req, res);
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuoteById = async (req, res) => {
  try {
    const quote = await quoteService.getQuoteById(req, res);
    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuotesBySubcategory = async (req, res) => {
  try {
    const quote = await quoteService.getQuotesBySubcategory(req, res);
    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateQuote = async (req, res) => {
  try {
    const updatedQuote = await quoteService.updateQuote(req, res);
    res.status(200).json({ message: 'Quote updated successfully', quote: updatedQuote });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteQuote = async (req, res) => {
  try {
    await quoteService.deleteQuote(req, res);
    res.status(200).json({ message: 'Quote deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.importQuotes = async (req, res) => {
  try {
    const updatedQuote = await quoteService.importQuotes(req, res);
    res.status(200).json({ message: 'Quote imported successfully', quote: updatedQuote });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.exportQuotes = async (req, res) => {

  try {

    const buffer = await quoteService.exportQuotes(req, res);

    res.status(200).send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

