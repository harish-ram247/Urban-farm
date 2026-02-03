const express = require('express');
const {
  getFarms,
  createFarm,
  updateFarm,
  deleteFarm,
} = require('../controllers/farmController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getFarms).post(protect, createFarm);
router.route('/:id').put(protect, updateFarm).delete(protect, deleteFarm);

module.exports = router;
