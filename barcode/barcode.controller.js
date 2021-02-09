const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const barcodeService = require('./barcode.service');

module.exports = router;

router.get('/:id', authorize(), getById);
router.get('/', authorize(Role.Admin), getAll);
router.post('/', authorize(Role.Admin), createSchema, create);

function getById(req, res, next){
    barcodeService.getById(req.params.id)
        .then(barcode => barcode ? res.json(barcode) : res.sendStatus(404))
        .catch(next);
}

function getAll(req, res, next){
    barcodeService.getAll()
        .then(barcodes => res.json(barcodes))
        .catch(next);
}

function createSchema(req, res, next){
    const schema = Joi.object({
        id: Joi.number().required(),
        dest: Joi.string().required()
    });

    validateRequest(req, next, schema);
}

function create(req, res, next){
    barcodeService.create(req.body)
        .then(barcode => res.json(barcode))
        .catch(next);
}