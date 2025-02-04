const mongoose = require('mongoose');
const { getIntegerValidator } = require("../utils");
const categories = ['food', 'health', 'housing', 'sport', 'education'];

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
    description: {
        type: String,
        required: [true, 'Description is required.'],
        maxlength: [100, 'Description must be less than 500 characters.'],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(value);
            },
            message: 'Description must contain ONLY letters in English, with spaces if needed.',
        }
    },
    category: {
        type: String,
        required: [true, 'Category is required.'],
        validate: {
            validator: function (value) {
                return categories.includes(value);
            },
            message: 'Invalid category, must be one of: ' + categories.join(', '),
        }
    },
    userid: {
        type: Number,
        required: [true, 'User ID is required.'],
        validate: getIntegerValidator,
    },
    sum: {
        type: Number,
        required: true,
        min: 0,
        validate: getIntegerValidator,
        },
    year: {
        type: Number,
        required: false,
        min: [1900, 'Invalid year - must be between 1900 and the current year.'],
        max: [new Date().getFullYear(), 'Invalid year - must be between 1900 and the current year.'],
        validate: getIntegerValidator,
    },
    month: {
        type: Number,
        required: false,
        min: [1, 'Invalid month - must be between 1 and 12.'],
        max: [12, 'Invalid month - must be between 1 and 12.'],
        validate: getIntegerValidator,
    },
    day: {
        type: Number,
        required: false,
        validate: {
            validator: function (value) {
                const year = this.year || new Date().getFullYear();
                const month = this.month || new Date().getMonth() + 1;
                const daysInMonth = new Date(year, month, 0).getDate();
                return value >= 1 && value <= daysInMonth;
            },
        message: 'Day must be between 1 and the number of days in the month.',
        },
    },
    time: {
        type: String,
        required: false,
        validate: {
            validator: function (value) {
                const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
                return timeRegex.test(value);
            },
            message: 'Time must be in the format HH:MM:SS and represent a valid time.',
        },
    },
});

const CostItems = mongoose.model('CostItems', costSchema);

module.exports = CostItems;