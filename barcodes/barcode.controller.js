const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');
const barcodeService = require('./barcode.service');

module.exports = router;

router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(Role.Admin), updateSchema, update);
router.delete('/:id', authorize(Role.Admin), _delete);

function getAll(req, res, next){
    barcodeService.getAll()
        .then(barcodes => res.json(barcodes))
        .catch(next);
}

function getById(req, res, next){
    barcodeService.getById(req.params.id)
        .then(barcode => barcode ? res.json(barcode) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next){
    const schema = Joi.object({
        page: Joi.number().required(),
        dest: Joi.string().required()
    });

    validateRequest(req, next, schema);
}

function create(req, res, next){
    barcodeService.create(req.body)
        .then(barcode => res.json(barcode))
        .catch(next);
}

function updateSchema(req, res, next){
    const schema = Joi.object({
        page: Joi.number(),
        dest: Joi.string()
    });

    validateRequest(req, next, schema);
}

function update(req, res, next){
    barcodeService.update(req.params.id, req.body)
        .then(barcode => barcode ? res.json(barcode) : res.sendStatus(404))
        .catch(next);
}

function _delete(req, res, next){
    barcodeService.delete(req.params.id)
        .then(() => res.json({ message: 'Barcode deleted successfully' }))
        .catch(next);
}