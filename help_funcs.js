// Define a named function to check if the value contains only letters in English
exports.isValidEnglishName = (value) => {
    return /^[a-zA-Z]+$/.test(value);
};