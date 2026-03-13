const mongoose = require('mongoose');

const cateogrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  UserId: { type: String, required: true,ref:'User',required:true},
  status: { type: Boolean, required: true},
  isDeleted: { type: Boolean },
},{timestamps:true});

module.exports = mongoose.model('Cateogry', cateogrySchema);