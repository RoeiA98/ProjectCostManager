const mongoose = require('mongoose');

/**
 * Cost schema definition.
 * @typedef {Object} Cost
 * @property {string} description - Description of the cost item.
 * @property {string} category - Category of the cost item.
 * @property {number} userid - User ID associated with the cost item.
 * @property {number} sum - Sum of the cost item.
 * @property {number} [year] - Year of the cost item.
 * @property {number} [month] - Month of the cost item.
 * @property {number} [day] - Day of the cost item.
 * @property {string} [time] - Time of the cost item.
 */
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

// test