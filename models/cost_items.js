const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
    description: { type: String, required: true },
    category: { type: String, required: true },
    userid: { type: Number, required: true },
    sum: { type: Number, required: true },
    year: { type: Number, required: false },
    month: { type: Number, required: false },
    day: {type: Number, required: false},
    time: {type: String, required: false}

});

const CostItems = mongoose.model('CostItems', costSchema);

module.exports = CostItems;