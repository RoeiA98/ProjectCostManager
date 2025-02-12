const mongoose = require('mongoose');
const { getIntegerValidator } = require("../utils");
const categories = ['food', 'health', 'housing', 'sport', 'education'];

/**
 * Cost schema definition.
 * @typedef {Object} costs
 * @property {string} description - Description of the cost item.
 * @property {string} category - Category of the cost item.
 * @property {number} userid - User ID associated with the cost item.
 * @property {number} sum - Sum of the cost item.
 * @property {number} [year] - Year of the cost item.
 * @property {number} [month] - Month of the cost item.
 * @property {number} [day] - Day of the cost item.
 * @property {string} [time] - Time of the cost item.
 */

/**
 * Cost schema for storing cost items.
 * @type {mongoose.Schema}
 */
const costSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Description is required.'],
        maxlength: [100, 'Description must be less than 500 characters.'],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*$/.test(value);
            },
            message: 'Description must contain ONLY letters in English, with spaces if needed.'
        }
    },
    category: {
        type: String,
        required: [true, 'Category is required.'],
        validate: {
            validator: function (value) {
                return categories.includes(value);
            },
            message: 'Invalid category, must be one of: ' + categories.join(', ')
        }
    },
    userid: {
        type: Number,
        required: [true, 'User ID is required.'],
        validate: getIntegerValidator
    },
    sum: {
        type: Number,
        required: true,
        min: 0,
        validate: getIntegerValidator
    },
    year: {
        type: Number,
        required: false,
        min: [1900, 'Invalid year - must be between 1900 and the current year.'],
        max: [new Date().getFullYear(), 'Invalid year - must be between 1900 and the current year.'],
        validate: getIntegerValidator
    },
    month: {
        type: Number,
        required: false,
        min: [1, 'Invalid month - must be between 1 and 12.'],
        max: [12, 'Invalid month - must be between 1 and 12.'],
        validate: getIntegerValidator
    },
    day: {
        type: Number,
        required: false,
        validate: {
            validator: function (value) {
                const year = this.year || new Date().getFullYear();
                const month = (this.month || (new Date().getMonth() + 1));
                const daysInMonth = new Date(year, month, 0).getDate();
                return value >= 1 && value <= daysInMonth;
            },
            message: 'Invalid day - Day must be between 1 and the number of days in the month.'
        },
    },
    time: {
        type: String,
        required: false,
        validate: {
            validator: function (value) {
                if (!value) return true; // Allow empty values
                const timeRegex = /^([01]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$/; // HH:MM:SS
                if (!timeRegex.test(value)) return false;
                const [hours, minutes, seconds] = value.split(':');
                this.time = `${hours}:${minutes}:${seconds.padStart(2, '0')}`; // Normalize time
                return true;
            },
            message: 'Invalid time - Time must be in the format HH:MM:SS and represent a valid time.'
        },
    },
});

/**
 * CostItems model for interacting with the costs collection.
 * @type {mongoose.Model}
 */
const CostItems = mongoose.model('Costs', costSchema);

module.exports = CostItems;