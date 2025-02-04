const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cost = require('../models/cost_items');
const developer = require('../models/developers');
const users = require('../models/user');

/**
 * Add a new cost item.
 * @route POST /api/add
 * @param {string} description - Description of the cost item.
 * @param {string} category - Category of the cost item.
 * @param {number} userid - User ID associated with the cost item.
 * @param {number} sum - Sum of the cost item.
 * @param {number} [year] - Year of the cost item.
 * @param {number} [month] - Month of the cost item.
 * @param {string} [time] - Time of the cost item.
 * @param {number} [day] - Day of the cost item.
 * @returns {Object} The saved cost item.
 */
router.post('/add', async (req, res) => {
    try {
        const { description, category, userid, sum, year, month, time, day } = req.body;

        const user = await users.findOne({ id: userid });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const costItem = new cost({
            description,
            category,
            userid,
            sum,
            year: year || new Date().getFullYear(),
            month: month || new Date().getMonth() + 1,
            day: day || new Date().getDay(),
            time: time || `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
        });

        const savedCostItem = await costItem.save();
        res.status(201).json(savedCostItem);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                error: error.message,
            });
        }
        res.status(500).json({
            message: "Internal server error",
            error: "An unexpected error occurred",
        });
    }
});


router.get('/users', async (req, res) => {
    try {
        res.status(400).json({error: 'User ID is required.'});
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: "An unexpected error occurred",
        });
    }
});

/**
 * Get user details by ID.
 * @route GET /api/users/:id
 * @param {string} id - User ID.
 * @returns {Object} User details and total cost.
 */
router.get('/users/:id', async (req, res) => {
    try {
        const userid = req.params.id;
        if (userid < 1) { return res.status(400).json({error: 'User ID must be a positive number.'}); }
        if (isNaN(userid)) { return res.status(400).json({error: 'User ID must be a number.'}); }

        const user = await users.findOne({ id: userid }).select('-_id');
        const user_costs = await cost.find({userid: userid}).select('-_id');

        if (!user || !user_costs) {
            return res.status(404).json({error: 'User not found.'});
        }

        const total = user_costs.reduce((acc, cost) => acc + cost.sum, 0);

        res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total: total
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: "An unexpected error occurred", });
    }
});

/**
 * Get the development team members.
 * @route GET /api/about
 * @returns {Object[]} 200 - An array of developer objects.
 * @returns {string} 500 - Error message if developers are not found.
 */
router.get('/about', async (req, res) => {
    try {
        const developers = await developer.find().select('first_name last_name -_id');
        res.status(200).json(developers);
    } catch (error) {
        res.status(500).json({
            message: 'Developers not found.',
            error: error.message,
        });
    }
});

/**
 * Get monthly report for a specific user.
 * @route GET /api/report
 * @param {string} id - User ID.
 * @param {number} year - Year of the report.
 * @param {number} month - Month of the report.
 * @returns {Object} Monthly report for the user.
 */
router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;
        // Validate that id, year, and month exist and are not null
        if (!id) {return res.status(400).json({error: 'id is required.'});}
        if (isNaN(id)) { return res.status(400).json({error: 'User ID must be a number.'}); }
        if (id < 1) {
            return res.status(400).json({
                error: 'User ID must be a positive number.',
            });
        }
        if (!year) {return res.status(400).json({error: 'year is required.'});}
        if (!month) {return res.status(400).json({error: 'month is required.'});}
        if (!id && !year && !month) {return res.status(400).json({error: 'id, year, and month are required.'});}

        // Validate that year and month are numbers
        if (isNaN(year)) {return res.status(400).json({error: 'year must be a valid number.',});}
        if (isNaN(month)) {return res.status(400).json({error: 'month must be a valid number.',});}
        if (isNaN(year) && isNaN(month)) {
            return res.status(400).json({
                error: 'year and month must be valid numbers.',
            });
        }

        // Validate that year and month are within valid ranges
        const yearInt = parseInt(year);
        const monthInt = parseInt(month);
        if (yearInt < 1900 || yearInt > new Date().getFullYear()) {
            return res.status(400).json({
                error: 'year must be between 1900 and the current year.',
            });
        }
        if (monthInt < 1 || monthInt > 12) {
            return res.status(400).json({
                error: 'month must be between 1 and 12.',
            });
        }

        const user = await users.findOne({ id: id });

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        const costs = await cost.find({
            userid: parseInt(id),
            year: parseInt(year),
            month: parseInt(month)
        }).select("-_id");

        if (!costs.length) {
            return res.status(404).json({
                error: `No cost items found for user ${id} for month: ${month}, year: ${year}.`,
            });
        }

        // Initialize the result structure
        const result = {
            userid: parseInt(id),
            year: parseInt(year),
            month: parseInt(month),
            costs: []
        };

        // Categories to include in the response
        const categories = ['food', 'health', 'housing', 'sport', 'education'];

        // Initialize each category as an empty array
        categories.forEach(category => {
            result.costs.push({
                [category]: []
            });
        });

        // Group costs by category
        costs.forEach(cost => {
            const categoryIndex = categories.indexOf(cost.category);
            if (categoryIndex !== -1) {
                result.costs[categoryIndex][cost.category].push({
                    sum: cost.sum,
                    description: cost.description,
                    day: cost.day
                });
            }
        });

        res.status(200).json(result);

    } catch (error) {
        return res.status(500).send({
            message: 'Internal server error',
            error: 'An unexpected error occurred',
        });
    }
});

module.exports = router;