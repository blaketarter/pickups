var mongoose = require('mongoose');

var pickupSchema = mongoose.Schema({
    text: String,
    category: String,
    rating: Number
});

module.exports = Pickup = mongoose.model('Pickup', pickupSchema);
