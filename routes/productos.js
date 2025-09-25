const express = require('express');
const Joi = require('@hapi/joi');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');
const ruta = express.Router();

// Esquema de validación para productos
const esquemaProducto = Joi.object({
    nombre: Joi.string().min(2).max(100).required(),
    descripcion: Joi.string().max(500).optional(),
    precio: Joi.number().min(0).precision(2).required(),
    categoria: Joi.string().valid('facial', 'corporal', 'capilar', 'maquillaje', 'otros').required(),
    stock: Joi.number().integer().min(0).default(0),
    activo: Joi.boolean().default(true)
});

// GET todos los productos
ruta.get('/', async (req, res) => {
    try {
        const db = getDB();
        const productos = await db.collection('productos').find().toArray();
        res.json({
            status: 'success',
            count: productos.length,
            data: productos
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: 'Error al obtener productos: ' + error.message 
        });
    }
});

// GET producto por ID
ruta.get('/:id', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID inválido'
            });
        }

        const db = getDB();
        const producto = await db.collection('productos').findOne({ 
            _id: new ObjectId(req.params.id) 
        });

        if (!producto) {
            return res.status(404).json({
                status: 'error', 
                message: 'Producto no encontrado' 
            });
        }

        res.json({
            status: 'success',
            data: producto
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al buscar producto: ' + error.message
        });
    }
});

// POST crear nuevo producto
ruta.post('/', async (req, res) => {
    try {
        const { error, value } = esquemaProducto.validate(req.body);
        
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.details[0].message
            });
        }

        const db = getDB();
        const nuevoProducto = {
            ...value,
            fechaCreacion: new Date(),
            codigo: generarCodigoProducto()
        };

        const resultado = await db.collection('productos').insertOne(nuevoProducto);
        
        res.status(201).json({
            status: 'success',
            message: 'Producto creado exitosamente',
            data: {
                id: resultado.insertedId,
                ...nuevoProducto
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al crear producto: ' + error.message
        });
    }
});

// PUT actualizar producto
ruta.put('/:id', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID inválido'
            });
        }

        const { error, value } = esquemaProducto.validate(req.body);
        
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.details[0].message
            });
        }

        const db = getDB();
        const resultado = await db.collection('productos').updateOne(
            { _id: new ObjectId(req.params.id) },
            { 
                $set: { 
                    ...value,
                    fechaActualizacion: new Date()
                } 
            }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.json({
            status: 'success',
            message: 'Producto actualizado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar producto: ' + error.message
        });
    }
});

// DELETE producto (borrado lógico)
ruta.delete('/:id', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID inválido'
            });
        }

        const db = getDB();
        const resultado = await db.collection('productos').updateOne(
            { _id: new ObjectId(req.params.id) },
            { 
                $set: { 
                    activo: false,
                    fechaEliminacion: new Date()
                } 
            }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.json({
            status: 'success',
            message: 'Producto marcado como inactivo'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar producto: ' + error.message
        });
    }
});

// GET productos por categoría
ruta.get('/categoria/:categoria', async (req, res) => {
    try {
        const db = getDB();
        const productos = await db.collection('productos').find({
            categoria: req.params.categoria,
            activo: true
        }).toArray();
        
        res.json({
            status: 'success',
            categoria: req.params.categoria,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al buscar productos: ' + error.message
        });
    }
});

// Función para generar código único de producto
function generarCodigoProducto() {
    return 'PROD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

module.exports = ruta;