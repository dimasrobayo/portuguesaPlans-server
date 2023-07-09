const Product = require('../models/products');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');

module.exports = {
    findByCategory(request, response) {
        const id_category = request.params.id_category;
        
        Product.findByCategory(id_category, (error, data) => {
            if(error){
                return resquest.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar los productos',
                    error: error
                });
            }

            return response.status(201).json(data);
        });
    },

    create(request, response) {
        const product = JSON.parse(request.body.product); // SE CAPTURA LOS DATOS QUE ENVIA EL FRONTEND
        const files = request.files;
        let inserts = 0;

        if(files.length === 0) {
            return response.status(501).json({
                success: false,
                message: 'Error al registrar el producto no tiene imagenes',
            })
        }else{
            Product.create(product, (error, id_product) => {
                if(error){
                    return response.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del producto',
                        error: error
                    });
                }

                product.id = id_product;
                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const patch = `image_${Date.now()}`;
                        const url = await storage(file, patch);

                        if(url != undefined && url != null) {
                            if(inserts == 0) {
                                product.image1 = url;
                            }else if(inserts == 1) {
                                product.image2 = url;
                            }else if(inserts == 2) {
                                product.image3 = url;
                            }
                        }

                        await Product.update(product, (error, data) => {
                            if (error) {
                                return response.status(501).json({
                                    success: false,
                                    message: 'Hubo un error con el registro del producto',
                                    error: error
                                });
                            }

                            inserts = inserts + 1;

                            if(inserts == files.length) {
                                return response.status(201).json({
                                    success: true,
                                    message: 'El producto se almaceno correctamente',
                                    data: data 
                                });
                            }
                        })
                    })
                }
                start();
            })
        }
    },

    update(request, response) {
        const product = request.body;

        Product.update(product, (error, data) => {
            if (error) {
                return response.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del producto',
                    error: error
                });
            }

            return response.status(201).json({
                success: true,
                message: 'El producto se actualizo correctamente',
                data: data
            });
        })
    },

    updateWithImage(request, response) {
        const product = JSON.parse(request.body.product); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = request.files;
        
        let inserts = 0; 
        
        if (files.length === 0) {
            return response.status(501).json({
                success: false,
                message: 'Error al registrar el producto no tiene imagenes',
            });
        } else {
            Product.update(product, (error, id_product) => {

                if (error) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con la actualizacion del producto',
                        error: error
                    });
                }
                
                product.id = id_product;
                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const path = `image_${Date.now()}`;
                        const url = await storage(file, path);

                        if (url != undefined && url != null) { // CREO LA IMAGEN EN FIREBASE
                            if (inserts == 0) { //IMAGEN 1
                                product.image1 = url;
                            }
                            else if (inserts == 1) { //IMAGEN 2
                                product.image2 = url;
                            }
                            else if (inserts == 2) { //IMAGEN 3
                                product.image3 = url;
                            }
                        }

                        await Products.update(product, (error, data) => {
                            if (error) {
                                return response.status(501).json({
                                    success: false,
                                    message: 'Hubo un error con la actualizacion del producto',
                                    error: error
                                });
                            }

                            inserts = inserts + 1;

                            if (inserts == files.length) { // TERMINO DE ALAMACENAR LAS TRES IMAGENES
                                return response.status(201).json({
                                    success: true,
                                    message: 'El producto se actualizo correctamente',
                                    data: data
                                });
                            }

                        });
                    });
                }
                start();
            });
        }
    },

    delete(request, response) {
        const id = request.params.id;

        Product.delete(id, (error, id) => {
            if (error) {
                return response.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de eliminar el producto',
                    error: error
                });
            }

            return response.status(201).json({
                success: true,
                message: 'El producto se elimino correctamente',
                data: `${id}`
            });
        });
    },
}