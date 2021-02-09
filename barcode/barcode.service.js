const config = require('config.json');
const jwt = require('jsonwebtoken');
const db = require('_helpers/db');
const Role = require('_helpers/role');

module.exports = {
    getById,
    getAll,
    create
};

async function getById(id){
    if(!db.isValidId(id))
        throw 'Barcode not found';

    const barcode = await db.Barcode.findById(id);

    if(!barcode)
        throw 'Barcode not found';

    return barcode;
}

async function getAll(){
    const barcodes = await db.Barcode.find();
    return barcodes;
}

async function create(params){
    if(await db.Barcode.findOne({id: params.id})){
        throw 'Id ' + params.id + ' is already taken';
    }

    const barcode = new db.Barcode(params);

    await barcode.save();

    return barcode;
}