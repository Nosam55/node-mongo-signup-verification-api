const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const augustaSchema = new Schema({
    name: {type: String, required: true},
    lat: {type: Number, required: true},
    long: {type: Number, required: true},
    source: {type: String, required: true},
    isNixon: {type: Boolean},
    type: {type: mongoose.ObjectId, required: true},
    account: {type: String, required: true},
    createdOn: {type: Date, required: true},
    updated: {type: Date},
    start: {type: Number},
    end: {type: Number},
    keywords: {type: [String]}
});

augustaSchema.virtual('location').get(function(){
   return {lat: this.lat, long: this.long};
});

augustaSchema.virtual('lifespan').get(function () {
    return {start: this.start, end: this.end};
});

module.exports = mongoose.model('Augusta', augustaSchema);

//TODO: require 'schema.org' to represent 'type'. Will need to make fluid GUI for this, not for mvp