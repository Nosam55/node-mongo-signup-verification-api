const express = require('express');
const router = new express.Router;
const Joi = require('joi');
const multer = require('multer');
const { resolve } = require('path');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');
const augustaService = require('./augusta.service');

const { photoHost } = require('./config');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + hashFileName(file.originalname));
    }
});

const upload = multer({storage: storage});

module.exports = router;

router.get('/get', authorize(), getAll);
router.get('/mine', authorize(), getMine);
router.get('/get/:id', authorize(), getById);
router.get('/test', authorize(), upload.single("test"), test);
router.post('/', authorize(), upload.single('photo'), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

function test(req, res, next){
    res.json({ message: req.file.destination })
}

function getAll(req, res, next){
    augustaService.getAll()
        .then(augusta => res.json(augusta))
        .catch(next);
}

function getMine(req, res, next){
    augustaService.getMine(req.user.id)
        .then(augusta => res.json(augusta))
        .catch(next);
}

function getById(req, res, next) {
    augustaService.getById(req.params.id)
        .then(augusta => res.json(augusta))
        .catch(next);
}

function createSchema(req, res, next){
    let schemaOpts = {
        name: Joi.string().required(),
        lat: Joi.number().required(),
        long: Joi.number().required(),
        type: Joi.string().required(),
        start: Joi.number().integer().multiple(10),
        end: Joi.number().integer().multiple(10),
        keywords: Joi.string()
    };

    //Only admins get to decide which uploads are Nixon originals
    if(req.user.role === Role.Admin){
        schemaOpts.isNixon = Joi.boolean();
    }

    const schema = Joi.object(schemaOpts);

    for(const name in req.body){
        console.log(`${name}: ${req.body[name]}`);
    }

    console.log(req.body);

    validateRequest(req, next, schema);
}

function create(req, res, next){
    const filename = req.file.filename;
    const fileType = getFileType(filename);
    const hostPrefix = photoHost;

    //Only allow images
    if(fileType !== 'png' && fileType !== 'jpg' && fileType !== 'jpeg' && filename !== 'gif'){
        res.sendStatus(415); //Unsupported File Type
        return;
    }

    //Set the source to wherever multer stored the image
    req.body.source = hostPrefix + req.file.path;

    //Split the tags by commas and trim whitespace around each keyword
    req.body.keywords = req.body.keywords.split(",").map(tag => tag.trim());

    augustaService.create(req.user.id, req.body)
        .then(augusta => res.json(augusta))
        .catch(next);
}

function updateSchema(req, res, next){
    let schemaOpts = {
        name: Joi.string(),
        type: Joi.string(),
        start: Joi.number().integer().multiple(10),
        end: Joi.number().integer().multiple(10)
    };

    //Again, only the admins decide which Augustas are Nixon's
    if(req.user.role === Role.Admin){
        schemaOpts.isNixon = Joi.boolean();
    }

    const schema = Joi.object(schemaOpts);
    validateRequest(req, next, schema);
}

function update(req, res, next){
    augustaService.update(req.params.id, req.body)
        .then(augusta => res.json(augusta))
        .catch(next);
}

function _delete(req, res, next){
    augustaService.delete(req.params.id)
        .then()
}

//helper functions

function getFileType(filename){
    const segments = filename.split(".");
    return segments[segments.length - 1].toLowerCase();
}

function hashFileName(filename){
    const fileExt = "." + getFileType(filename);

    let filehash = 1;
    for(const char of filename){
        filehash *= char.charCodeAt(0);
    }
    filehash %= Number.MAX_SAFE_INTEGER;
    return String(filehash) + fileExt;
}
