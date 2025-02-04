/**
 * Validates if a given value contains only English letters.
 * @param {string} value - The value to be validated.
 * @returns {boolean} True if the value contains only English letters, false otherwise.
 */
exports.isValidEnglishName = (value) => {
    return /^[a-zA-Z]+$/.test(value);
};

/**
 * Returns a validator object to check if a value is an integer.
 * @param {string} [message] - Custom error message.
 * @returns {Object} Validator object with a validator function and a message.
 */
exports.getIntegerValidator = (message) => {
    return {
        validator: Number.isInteger,
        message: message || "{PATH} must be an integer.",
    };
};