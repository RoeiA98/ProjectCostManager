const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CostItem = require("../models/cost_items");
const Developer = require("../models/developers");
const Users = require("../models/user");

/* POST add a new cost item. */
router.post('/add', async (req, res) => {
    try {
        const { description, category, userid, sum, year, month, time, day } = req.body;

        if (!description || !category || !userid || !sum) {
            return res.status(400).json({error: 'Description, category, userid, and sum are required.'});
        }

        const costItem = new CostItem({
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
        res.status(500).json({ error: error.message });
    }
});

/* GET user details by ID. */
router.get('/users/:id', async (req, res) => {
    try {
        const userid = String(req.params.id);  // Ensure id is a string
        const user = await Users.findOne({ id: userid }).select("-_id");
        const user_costs = await CostItem.find({userid: userid}).select("-_id");

        if (!user || !user_costs) {
            return res.status(404).json({error: 'User not found'});
        }

        const total = user_costs.reduce((acc, cost) => acc + cost.sum, 0);

        res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total: total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* GET the Development Team Members */
router.get('/about', async (req, res) =>{
    try {
        const developers = await Developer.find().select("-_id -__v");
        res.status(200).json(developers);
    } catch (error) {
        res.status(500).send({
            message: "Developers not found.",
            error: error.message,
        });
    }
});

/* GET Monthly Report for a specific user */
router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;

        if (!id || !year || !month) {
            return res.status(400).json({
                error: 'id, year, and month are required.',
            });
        }

        const user = await Users.findOne({ id: id });

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        const costs = await CostItem.find({
            userid: parseInt(id),
            year: parseInt(year),
            month: parseInt(month)
        }).select("-_id");

        if (!costs.length) {
            return res.status(404).json({
                error: 'No cost items found for the specified user, year, and month.',
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
                    day: cost.day // Assuming `day` field is available
                });
            }
        });

        res.status(200).json(result);

    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
            error: "An unexpected error occurred",
        });
    }
});

module.exports = router;