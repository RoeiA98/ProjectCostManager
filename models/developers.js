const mongoose = require('mongoose');
const { isValidEnglishName } = require("../functions");


const developerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Developer property must include first name!"],
        validate: {
            validator: isValidEnglishName,
            message: (props) => `${props.value} is not a valid first name!`,
        },
    },

    lastname: {
        type: String,
        required: [true, "Developer property must include last name!"],
        validate: {
            validator: isValidEnglishName,
            message: (props) => `${props.value} is not a valid last name!`,
        },
    }
});

const Developer = mongoose.model("Developer", developerSchema);
module.exports = Developer;