
// Define a named function to check if the value contains only letters in English
exports.isValidEnglishName = (value) => {
    return /^[a-zA-Z]+$/.test(value);
};

// Define a named function to check if the value contains only letters in English and spaces
exports.getIntegerValidator = (message) => {
    return {
        validator: Number.isInteger,
        message: message || "{PATH} must be an integer.",
    };
};