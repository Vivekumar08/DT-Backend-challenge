const { v4: uuidv4 } = require('uuid')

// Generate ids
exports.generateId = () => {
    const id = uuidv4();
    const sid = id.replace(/-/g, '').substring(0, 12);
    return sid;
}

exports.validateTimestamp = (timestamp) => {
    // Regular expression to match the ISO 8601 format
    const regex = /^\d{2}-\d{2}-\d{4}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    return regex.test(timestamp);
}