const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  const { jobs } = req.body;
  const results = [];

  for (const job of jobs) {
    try {
      if (job.method === 'POST') {
        await User.create(job.data);
      } else if (job.method === 'PUT') {
        await User.findByIdAndUpdate(job.data._id, job.data);
      } else if (job.method === 'DELETE') {
        await User.findByIdAndDelete(job.id);
      }

      results.push({ status: 'success', job });
    } catch (error) {
      results.push({ status: 'error', error: error.message, job });
    }
  }

  res.status(200).json({ results });
});

module.exports = router;