const mongoose = require('mongoose');

/**
 * User schema definition.
 * @typedef {Object} User
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
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    marital_status: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;