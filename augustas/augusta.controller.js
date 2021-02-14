const express = require('express');
const router = new express.Router;
const Joi = require('joi');
const multer = require('multer');

const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');
const augustaService = require('./augusta.service');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now().toISOString() + '-' + file.originalname);
    }
});

const upload = multer({storage: storage});

module.exports = router;

router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(), upload.single('augusta'), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

function getAll(req, res, next){
    augustaService.getAll()
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

    validateRequest(req, next, schema);
}

function create(req, res, next){
    const filename = req.file.filename;
    let fileType = filename.split('.')[filename.split('.').length - 1];

    if(fileType !== '.png' && fileType !== '.jpg' && fileType !== '.jpeg' && filename !== '.gif'){
        res.send(415).json({ message: 'Only PNG, JPG, and GIF files are allowed'});
    }



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