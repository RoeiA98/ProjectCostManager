const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CostItem = require("../models/cost_items");
const Developer = require("../models/developers");
const Users = require("../models/user");

/* POST add a new cost item. */
router.post('/add', async (req, res) => {
    try {
        const { description, category, userid, sum, date } = req.body;

        if (!description || !category || !userid || !sum) {
            return res.status(400).json({ error: 'Description, category, userid, and sum are required' });
        }

        const costItem = new CostItem({
            description,
            category,
            userid,
            sum,
            date: date || Date.now()
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
        const userId = String(req.params.id);  // Ensure id is a string
        const user = await Users.findOne({ id: userId }).select("-_id");
        const user_costs = await CostItem.find({userId: userId}).select("-_id");

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
            userId: id,
            year: parseInt(year),
            month: parseInt(month)
        }).select("-_id");

        if (!costs.length) {
            return res.status(404).json({
                error: 'No cost items found for the specified user, year, and month.',
            });
        }

        const groupedCosts = costs.reduce((acc, cost) => {
            if (!acc[cost.category]) {
                acc[cost.category] = [];
            }
            acc[cost.category].push({
                description: cost.description,
                sum: cost.sum,
                year: cost.year,
                month: cost.month,
            });
            return acc;
        }, {});

        res.status(200).json(groupedCosts);

    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
            error: "An unexpected error occurred",
        });
    }
});

module.exports = router;