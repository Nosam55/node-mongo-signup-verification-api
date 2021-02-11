const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const barcodeSchema = new Schema({
    page: {type: Number, required: true},
    dest: {type: String, required: true}
});

module.exports = mongoose.model('Barcode', barcodeSchema);