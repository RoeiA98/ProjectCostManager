const mongoose = require('mongoose');
const { isValidEnglishName, getIntegerValidator} = require("../utils");

/**
 * Developer schema definition.
 * @typedef {Object} developers
 * @property {string} first_name - First name of the developer.
 * @property {string} last_name - Last name of the developer.
 */
const developerSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        validate: getIntegerValidator,
    },
    first_name: {
        type: String,
        required: [true, 'First name is required.'],
        maxlength: [50, 'First name must be less than 50 characters.'],
        validate: {
            validator: isValidEnglishName,
            message: 'First name must contain ONLY letters in English.',
        }
    },
    last_name: {
        type: String,
        required: true,
        maxlength: [50, 'Last name must be less than 50 characters.'],
        validate: {
            validator: isValidEnglishName,
            message: 'Last name must contain ONLY letters in English.',
        }
    },
    birthday: {
        type: Date,
        required: [true, 'Birthday is required.'],
    },
    marital_status: {
        type: String,
        required: [true, 'Marital status is required.'],
    }
});

const developers = mongoose.model('Developer', developerSchema);

module.exports = developers;