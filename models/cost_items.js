const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
    description: { type: String, required: true },
    category: { type: String, required: true },
    userId: { type: String, required: true },
    sum: { type: Number, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true }
});

const CostItems = mongoose.model('CostItems', costSchema);

module.exports = CostItems;