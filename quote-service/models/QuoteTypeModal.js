const mongoose = require('mongoose');

const downloadLikeSaveQuoteSchema = new mongoose.Schema({
  quoteId: { type: String, ref: 'Quote', required: true }, 
  userId: { type: String, ref: 'User', required: true }, 
  type: { 
    type: String, 
    enum: ['download', 'view', 'like'], 
    required: true 
  },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }, 
},{timestamps:true});

module.exports = mongoose.model('DownloadLikeSaveQuote', downloadLikeSaveQuoteSchema);
