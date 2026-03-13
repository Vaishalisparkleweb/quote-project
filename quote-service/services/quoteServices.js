const axios = require('axios');
const Quote = require('../models/Quote');
const multer = require('multer');
const csv = require('csv-parser');
const { parse } = require('json2csv');
const XLSX = require('xlsx');
const ExcelJS = require('exceljs');
const { log } = require('console');
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image');
exports.createQuote = async (req, res) => {
  upload(req, res, async (err) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error('Authorization token is required');
    }

    const { userId, subCategoryId, title, language, scheduledDate } = req.body;

    if (!userId || !subCategoryId || !title || !language) {
      throw new Error('All fields (userId, subCategoryId, title, language) are required');
    }
      const userResponse = await axios.get(`${process.env.USER_SERVICE}/${userId}`, {
        headers: { Authorization: token },
      });
      const subcategoryResponse = await axios.get(`${process.env.SUBCATEGORY_SERVICE}/${subCategoryId}`, {
        headers: { Authorization: token },
      });

      if (!userResponse.data || !subcategoryResponse.data) {
        throw new Error('User or Subcategory not found');
      }

      const imageBuffer = req.file ? req.file.buffer : null;

      const quote = new Quote({
        userId,
        subCategoryId,
        title,
        image: imageBuffer,
        language,
        scheduledDate,
      });
      await quote.save();
     return quote;

  });
};


exports.getQuotesBySubcategory = async (req, res) => {
  const { id } = req.params;
  const { language } = req.query;

  const query = { isDeleted: false };
  if (language && language !== 'all') {
    query.language = language;
  }
  if (!id) {
    throw new Error('Subcategory ID is required');
  }

  const quotes = await Quote.find({ ...query, subCategoryId: id });

  if (!quotes || quotes.length === 0) {
    throw new Error('No quotes found for this subcategory');
  }

  return quotes;
};

exports.getAllQuotes = async (req, res) => {
  const { language } = req.query;

  const query = { isDeleted: false };
  if (language && language !== 'all') {
    query.language = language;
  }
  return await Quote.find(query);
};

exports.getQuoteById = async (req) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) {
    throw new Error('Quote not found');
  }

  const token = req.headers.authorization;
  if (!token) {
    throw new Error('Authorization token is required');
  }

  const userResponse = await axios.get(`${process.env.USER_SERVICE}/${quote.userId}`, {
    headers: { Authorization: token },
  });


  const user = userResponse.data;
  if (!user) {
    throw new Error('User not found');
  }

  const subcategoryResponse = await axios.get(`${process.env.SUBCATEGORY_SERVICE}/${quote.subCategoryId}`, {
    headers: { Authorization: token },
  });
  console.log("subcategoryResponse", subcategoryResponse);
  const subcategory = subcategoryResponse.data;
  if (!subcategory) {
    throw new Error('Subcategory not found');
  }

  const quoteResponse = quote;
  quoteResponse.user = user;
  quoteResponse.subcategory = subcategory;
  console.log(quoteResponse);
  return quoteResponse;
};

exports.updateQuote = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'Error processing file upload' });
    }


    const { id } = req.params;
    const token = req.headers.authorization;

    if (!token) {
      throw new Error('Authorization token is required');
    }

    const { title, language, scheduledDate } = req.body;


    const quote = await Quote.findById(id);
    if (!quote) {
      throw new Error('Quote not found');
    }

    if (title) quote.title = title;
    if (language) quote.language = language;
    if (scheduledDate) quote.scheduledDate = scheduledDate;

    if (req.file) {
      quote.image = req.file.buffer;
    }

    await quote.save();


  });
};

exports.deleteQuote = async (req) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) {
    throw new Error('Quote not found');
  }

  quote.isDeleted = true;
  await quote.save();
  return quote;
};




exports.importQuotes = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      throw new Error('Error processing file upload');
    }

    const { userId, subCategoryId } = req.body;

    if (!userId || !subCategoryId) {
      throw new Error('userId and subCategoryId are required in the request body');
    }

    if (!req.file) {
      throw new Error('File is required');
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname.toLowerCase();

    const quotes = [];
    if (fileName.endsWith('.csv')) {
      const stream = require('stream');
      const bufferStream = new stream.PassThrough();
      bufferStream.end(fileBuffer);

      bufferStream
        .pipe(csv())
        .on('data', (row) => {
          quotes.push({
            userId,
            subCategoryId,
            title: row['Title'],
            language: row['Language'],
            isDeleted: false,
          });
        })
        .on('end', async () => {
          await Quote.insertMany(quotes);
          return quotes;
        });
    } else if (fileName.endsWith('.xlsx')) {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      rows.forEach((row) => {
        quotes.push({
          userId,
          subCategoryId,
          title: row['Title'],
          language: row['Language'],
          isDeleted: false,
        });
      });

      await Quote.insertMany(quotes);
      return quotes;
    } else {
      throw new Error('Invalid file format. Only CSV or XLSX are supported.');
    }
  });
};
exports.exportQuotes = async (req, res) => {
  const quotes = await Quote.find({ isDeleted: false });

  const userIds = [...new Set(quotes.map((quote) => quote.userId))];
  const subCategoryIds = [...new Set(quotes.map((quote) => quote.subCategoryId))];

  const userResponses = await axios.get(`${process.env.USER_SERVICE}/`, {
    params: { ids: userIds.join(',') },
    headers: { Authorization: req.headers.authorization },
  });
  const users = userResponses.data.users.reduce((acc, user) => {
    acc[user._id] = user.name;
    return acc;
  }, {});

  const subCategoryResponses = await axios.get(`${process.env.SUBCATEGORY_SERVICE}/`, {
    params: { ids: subCategoryIds.join(',') },
    headers: { Authorization: req.headers.authorization },
  });

  const subCategories = subCategoryResponses.data.reduce((acc, subCategory) => {
    acc[subCategory._id] = subCategory.subcategoryName;
    return acc;
  }, {});

  const formattedQuotes = quotes.map((quote) => ({
    Title: quote.title,
    Language: quote.language,
    User: users[quote.userId] || 'Unknown',
    Subcategory: subCategories[quote.subCategoryId] || 'Unknown',
  }));

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Quotes');

  worksheet.columns = [
    { header: 'Title', key: 'Title', width: 30 },
    { header: 'Language', key: 'Language', width: 20 },
    { header: 'User', key: 'User', width: 20 },
    { header: 'Subcategory', key: 'Subcategory', width: 20 },
  ];

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' },
    };
  });

  formattedQuotes.forEach((quote) => {
    worksheet.addRow(quote);
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=quotes.xlsx');

  await workbook.xlsx.write(res);
  res.end();
};
