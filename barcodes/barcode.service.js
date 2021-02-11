const db = require('_helpers/db');

module.exports = {
    getById,
    getAll,
    create,
    update,
    delete: _delete
};

async function getById(id){
    if(!db.isValidId(id)){
        throw 'Barcode not found';
    }

    const barcode = await db.Barcode.findById(id);

    if(!barcode){
        throw 'Barcode not found';
    }

    return barcode;
}

async function getAll(){
    const barcodes = await db.Barcode.find();
    return barcodes;
}

async function create(params){
    const barcode = new db.Barcode(params);

    await barcode.save();

    return barcode;
}

async function update(id, params){
    if(!db.isValidId(id)){
        throw 'Barcode not found';
    }
    const barcode = await db.Barcode.findById(id);

    if(params.page)
        barcode.page = params.page;

    if(params.dest)
        barcode.dest = params.dest;

    await barcode.save();

    return barcode;
}

async function _delete(id){
    if(!db.isValidId(id)){
        throw 'Barcode not found';
    }

    const barcode = await db.Barcode.findById(id);

    if(!barcode) {
        throw 'Barcode not found';
    }

    await barcode.remove();
}