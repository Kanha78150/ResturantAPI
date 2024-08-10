// models/Restaurant.js
// models/Restaurant.js
const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    ratings: { type: [Number], default: [] },
    radius: { type: Number, default: 500 }, // Optional field for radius in meters
    minimumDistance: { type: Number, default: 500 }, // Minimum distance in meters
    maximumDistance: { type: Number, default: 2000 } // Maximum distance in meters
});

// Create a 2dsphere index for location to enable geospatial queries
RestaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', RestaurantSchema);

