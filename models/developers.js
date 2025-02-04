const mongoose = require('mongoose');
const { isValidEnglishName } = require("../utils");

/**
 * Developer schema definition.
 * @typedef {Object} Developer
 * @property {string} first_name - First name of the developer.
 * @property {string} last_name - Last name of the developer.
 */
const developerSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'Developer must have a first name.'],
        validate: {
            validator: isValidEnglishName,
            message: (props) => `${props.value} is not a valid first name.`,
        },
    },

    last_name: {
        type: String,
        required: [true, 'Developer must have a last name.'],
        validate: {
            validator: isValidEnglishName,
            message: (props) => `${props.value} is not a valid last name.`,
        },
    }
});

const Developer = mongoose.model('Developer', developerSchema);
module.exports = Developer;