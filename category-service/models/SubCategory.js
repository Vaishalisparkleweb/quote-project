const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  categoryId: { type:String , ref: 'Cateogry', required: true },
  subcategoryName: { type: String, required: true },
  image: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: Boolean, required: true, default: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Subcategory', subcategorySchema);