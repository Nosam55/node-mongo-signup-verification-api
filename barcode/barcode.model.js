const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const barcodeSchema = new Schema({
    id: {type: Number, unique: true, required: true},
    dest: {type: String, required: true}
});

module.exports = mongoose.model("Barcode", barcodeSchema);