const Category = require('../models/category');
const storage = require('../utils/cloud_storage');

module.exports = {
    async getAll(req, res) {
        Category.getAll((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las categorias',
                    error: err
                });
            }

            return res.status(201).json(data);
        });
    },
    async create(request, response) {
        const category = JSON.parse(request.body.category) // SE CAPTURAN LOS DATOS QUE ME ENVIE EL CLIENTE
        const files = request.files;
        
        if(files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if(url != undefined && url != null) {
                category.image = url;
            }
        }

        Category.create(category, (error, id) => {
            if(error){
                return response.status(501).json({
                    success: false,
                    message: 'Error con el registro de la categoria',
                    error: error
                })
            }

            return response.status(201).json({
                success: true,
                message: 'Registro se realizo correctamente',
                data: `${id}` // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
            });
        });
    },
    async updateWithImage(req, res) {
        const category = JSON.parse(req.body.category); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                category.image = url;
            }
        }

        Category.update(category, (err, id) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualizacion de la categoria',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La categoria se actualizo correctamente',
                data: `${id}`
            });
        });

    },
    async update(req, res) {
        const category = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
        console.log('CATEGORIA: ', category);
    
        Category.update(category, (err, id) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualizacion de la categoria',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La categoria se actualizo correctamente',
                data: `${id}`
            });
        });

    },
    async delete(request, response) {
        const id = request.params.id;
        console.log('id')

        Category.delete(id, (error, data) => {
            if(error){
                return response.status(501).json({
                    success: false,
                    message: 'Error al eliminar la categoria',
                    error: error
                })
            }

            return response.status(201).json({
                success: true,
                message: 'La categoria se elimino correctamente',
                data: `${id}`
            })
        })
    }
}