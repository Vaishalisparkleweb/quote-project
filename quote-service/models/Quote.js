const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  userId: { type:String, ref: 'User', required: true },
  subCategoryId: { type:String, ref: 'Subcategory', required: true },
  title: { type: String, required: true },
  image: { type: String },
  language: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  scheduledDate: { type: Date },
}, { timestamps: true }); 

module.exports = mongoose.model('Quote', quoteSchema);
