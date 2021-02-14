const db = require('_helpers/db');

module.exports = {
    getById,
    getAll,
    create,
    update,
    delete: _delete
};

async function getBarcode(id){
    if(!db.isValidId(id)){
        throw 'Invalid ID: Barcode not found';
    }

    const barcode = await db.Barcode.findById(id);

    if(!barcode) {
        throw 'Barcode not found';
    }

    return barcode;
}

async function getById(id){
    const barcode = await getBarcode(id);
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
    const barcode = await getBarcode(id);

    if(params.page)
        barcode.page = params.page;

    if(params.dest)
        barcode.dest = params.dest;

    await barcode.save();

    return barcode;
}

async function _delete(id){
    const barcode = await getBarcode(id);
    await barcode.remove();
}