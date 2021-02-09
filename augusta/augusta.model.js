const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('accounts/augusta.model');

const augustaSchema = new Schema({
    name: {type: String, required: true},
    location: {
        lat: {type: Number, required: true},
        long: {type: Number, required: true}
    },
    source: {type: String, required: true},
    isNixon: {type: Boolean, required: true},
    type: {type: String, required: true},
    user: {type: User, required: true},
    created: {type: Date, required: true},
    dateRange: {type: /* I dont know what type to put */ String, required: false},
    keywords: {type: [String]}
});

module.exports = mongoose.model("Augusta", augustaSchema);