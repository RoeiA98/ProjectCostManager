const mongoose = require('mongoose');
const {getIntegerValidator, isValidEnglishName} = require("../utils");

/**
 * User schema definition.
 * @typedef {Object} users
 * @property {number} id - Unique user ID.
 * @property {string} first_name - First name of the user.
 * @property {string} last_name - Last name of the user.
 * @property {Date} birthday - Birthday of the user.
 * @property {string} marital_status - Marital status of the user.
 */
const userSchema = new mongoose.Schema({
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

const users = mongoose.model('User', userSchema);

module.exports = users;