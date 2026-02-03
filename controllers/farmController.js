const Farm = require('../models/Farm');

// @desc    Get all farms
// @route   GET /api/farms
// @access  Public
const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ isActive: true }).populate('owner', 'name email');
    
    const farmsWithCoordinates = farms.map(farm => ({
      _id: farm._id,
      name: farm.name,
      description: farm.description,
      address: farm.address,
      latitude: farm.location.coordinates[1],
      longitude: farm.location.coordinates[0],
      size: farm.size,
      cropTypes: farm.cropTypes,
      owner: farm.owner,
      createdAt: farm.createdAt
    }));

    res.json(farmsWithCoordinates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create farm
// @route   POST /api/farms
// @access  Private
const createFarm = async (req, res) => {
  try {
    const { name, description, address, latitude, longitude, size, cropTypes } = req.body;

    const farm = await Farm.create({
      name,
      description,
      address,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      size,
      cropTypes,
      owner: req.user._id,
    });

    res.status(201).json(farm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update farm
// @route   PUT /api/farms/:id
// @access  Private
const updateFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Check ownership or admin
    if (farm.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, description, address, latitude, longitude, size, cropTypes } = req.body;

    const updatedFarm = await Farm.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        address,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        size,
        cropTypes,
      },
      { new: true }
    );

    res.json(updatedFarm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
// @access  Private
const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Check ownership or admin
    if (farm.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Farm.findByIdAndDelete(req.params.id);
    res.json({ message: 'Farm removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFarms,
  createFarm,
  updateFarm,
  deleteFarm,
};
