const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    rating: {
        type: Number, 
    },
    rank: {
        type: String,
    }
});

module.exports = mongoose.model('Users', userSchema);