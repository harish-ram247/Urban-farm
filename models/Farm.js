const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a farm name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    type: String,
    required: [true, 'Please provide an address']
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  size: {
    type: Number,
    required: [true, 'Please provide farm size']
  },
  cropTypes: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index
FarmSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Farm', FarmSchema);
