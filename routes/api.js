const express = require('express');
const CostItem = require("../models/cost_items");
const router = express.Router();
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
        const user = await Users.find().select("-_id -__v");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send({
            message: "User not found.",
            error: error.message
        });
    }
});

router.get('/about', async (req, res) =>{
    try {
        const developers = await Developer.find().select("-_id -__v");
        res.status(200).json(developers);
    } catch (error) {
        res.status(500).send({
            message: "Developers not found.",
            error: error.message
        });
    }
});

module.exports = router;