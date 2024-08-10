// routes/restaurants.js
const express = require('express');
const Restaurant = require('../models/Restaurant');
const authenticateJWT = require('../middleware/auth'); // Import the authentication middleware
const router = express.Router();

// Create a new restaurant (Protected Route)
router.post('/', authenticateJWT, async (req, res) => {
    try {
        const { name, description, location, ratings } = req.body;

        const restaurant = new Restaurant({ name, description, location, ratings, });
        await restaurant.save();

        res.status(201).json({ message: 'Restaurant created successfully!', restaurant });
    } catch (error) {
        res.status(500).json({ message: 'Error creating restaurant', error });
    }
});

// Get all restaurants or search by location (Protected Route)
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const { longitude, latitude, distance } = req.query;
        let restaurants;

        if (longitude && latitude && distance) {
            restaurants = await Restaurant.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [parseFloat(longitude), parseFloat(latitude)],
                            parseFloat(distance) / 3963.2, // Radius in miles
                        ],
                    },
                },
            });
        } else {
            restaurants = await Restaurant.find();
        }

        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving restaurants', error });
    }
});

// Get a specific restaurant by ID (Protected Route)
router.get('/:id', authenticateJWT, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving restaurant', error });
    }
});

// Update a restaurant by ID (Protected Route)
router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const { name, description, location, ratings } = req.body;

        if (location && !location.type === 'Point') {
            return res.status(400).json({ message: 'Location must be of type Point' });
        }

        if (location && !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
            return res.status(400).json({ message: 'Location coordinates must be an array with two elements' });
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { name, description, location, ratings },
            { new: true, runValidators: true }
        );

        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json({ message: 'Restaurant updated successfully!', restaurant: updatedRestaurant });
    } catch (error) {
        res.status(500).json({ message: 'Error updating restaurant', error });
    }
});

// Delete a restaurant by ID (Protected Route)
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json({ message: 'Restaurant deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting restaurant', error });
    }
});

// Get restaurants within a radius from a specified point
router.get('/:id', async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;

        if (!latitude || !longitude || !radius) {
            return res.status(400).json({ message: 'Latitude, longitude, and radius are required' });
        }

        // Convert radius from meters to radians
        const radiusInRadians = radius / 6378137; // Earth's radius in meters

        const restaurants = await Restaurant.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    distanceField: 'distance',
                    maxDistance: radiusInRadians,
                    spherical: true
                }
            },
            {
                $addFields: {
                    averageRating: { $avg: '$ratings' },
                    numberOfRatings: { $size: '$ratings' }
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    location: 1,
                    averageRating: 1,
                    numberOfRatings: 1,
                    distance: { $multiply: ['$distance', 6378137] } // Convert distance back to meters
                }
            },
            {
                $sort: { distance: 1 } // Sort by distance, nearest to farthest
            }
        ]);

        res.status(200).json(restaurants);
    } catch (error) {
        console.error(error); // Log the error to the server console
        res.status(500).json({ message: 'Error retrieving restaurants', error });
    }
});


// Get restaurants within a specified radius range from a given point
router.get('/:id', authenticateJWT, async (req, res) => {
    try {
        const { latitude, longitude, minimumDistance, maximumDistance } = req.query;

        if (!latitude || !longitude || !minimumDistance || !maximumDistance) {
            return res.status(400).json({ message: 'Latitude, longitude, minimumDistance, and maximumDistance are required' });
        }

        // Convert distances from meters to radians
        const minDistanceInRadians = parseFloat(minimumDistance) / 6378137; // Earth's radius in meters
        const maxDistanceInRadians = parseFloat(maximumDistance) / 6378137;

        const restaurants = await Restaurant.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    distanceField: 'distance',
                    minDistance: minDistanceInRadians,
                    maxDistance: maxDistanceInRadians,
                    spherical: true
                }
            },
            {
                $addFields: {
                    averageRating: { $avg: '$ratings' },
                    numberOfRatings: { $size: '$ratings' }
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    location: {
                        latitude: { $arrayElemAt: ['$location.coordinates', 1] },
                        longitude: { $arrayElemAt: ['$location.coordinates', 0] }
                    },
                    averageRating: 1,
                    numberOfRatings: 1,
                    distance: { $multiply: ['$distance', 6378137] } // Convert distance back to meters
                }
            },
            {
                $sort: { distance: 1 } // Sort by distance, nearest to farthest
            }
        ]);

        res.status(200).json(restaurants);
    } catch (error) {
        console.error(error); // Log the error to the server console
        res.status(500).json({ message: 'Error retrieving restaurants', error });
    }
});

module.exports = router;
