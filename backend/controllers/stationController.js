const Station = require('../models/station');

// GET all stations
exports.getAllStations = async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
};

// POST create station
exports.createStation = async (req, res) => {
  try {
    const { name, location, status, powerOutput, connectorType } = req.body;

    // Validate nested location fields
    if (
      !location ||
      typeof location.latitude !== 'number' ||
      typeof location.longitude !== 'number'
    ) {
      return res.status(400).json({ msg: 'Invalid location data' });
    }

    const newStation = new Station({
      name,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      status,
      powerOutput,
      connectorType
    });

    await newStation.save();
    res.status(201).json(newStation);
  } catch (error) {
    res.status(400).json({ msg: 'Invalid data', error: error.message });
  }
};

// PUT update station
exports.updateStation = async (req, res) => {
  try {
    const updatedStation = await Station.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStation) return res.status(404).json({ msg: 'Station not found' });
    res.json(updatedStation);
  } catch (error) {
    res.status(500).json({ msg: 'Update failed', error: error.message });
  }
};

// DELETE station
exports.deleteStation = async (req, res) => {
  try {
    const station = await Station.findByIdAndDelete(req.params.id);
    if (!station) return res.status(404).json({ msg: 'Station not found' });
    res.json({ msg: 'Station deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Delete failed', error: error.message });
  }
};