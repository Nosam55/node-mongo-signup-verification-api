const db = require('_helpers/db');

module.exports = {
    getById,
    getAll,
    create,
    update,
    delete: _delete
};

async function getAugusta(id){
    if(!db.isValidId(id))
        throw 'Invalid ID: Augusta not found';

    const augusta = await db.Augusta.findById(id);

    if(!augusta)
        throw 'Augusta not found';

    return augusta;
}

async function getById(id){
    const augusta = await getAugusta(id);
    return augusta;
}

async function getAll(){
    const augusta = await db.Augusta.find();
    return augusta;
}

async function create(userId, params){
    const augusta = new db.Augusta(params);

    augusta.account = userId;
    augusta.createdOn = Date.now();

    await augusta.save();
    return augusta;
}

async function update(id, params){
    const augusta = await getAugusta(id);

}

async function _delete(id){
    const augusta = await getAugusta(id);
    await augusta.remove();
}