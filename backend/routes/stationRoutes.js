const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getAllStations,
  createStation,
  updateStation,
  deleteStation
} = require('../controllers/stationController');

router.get('/', getAllStations);
router.post('/', auth, createStation);
router.put('/:id', auth, updateStation);
router.delete('/:id', auth, deleteStation);

module.exports = router;