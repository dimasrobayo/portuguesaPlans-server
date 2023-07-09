const Order = require('../models/order');
const orderHasProducts = require('../models/orderHasProducts');

module.exports = {
    findByStatus(request, response) {
        const status = request.params.status;

        Order.findByStatus(status, (error, data) => {
            if(error) {
                return response.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: error
                })
            }

            for (const order of data) {
                order.address = JSON.parse(order.address);
                order.client = JSON.parse(order.client);
                order.delivery = JSON.parse(order.delivery);
                order.products = JSON.parse(order.products);
            };

            return response.status(201).json(data);
        })
    },

    findByDeliveryAndStatus(request, response) {
        const id_delivery = request.params.id_delivery;
        const status = request.params.status;

        Order.findByDeliveryAndStatus(id_delivery, status, (err, data) => {
            if (err) {
                return response.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }

            for (const order of data) {
                order.address = JSON.parse(order.address);
                order.client = JSON.parse(order.client);
                order.products = JSON.parse(order.products);
                order.delivery = JSON.parse(order.delivery);
            }
            
            return response.status(201).json(data);
        });
    },

    findByClientAndStatus(request, response) {
        const id_client = request.params.id_client;
        const status = request.params.status;

        Order.findByClientAndStatus(id_client, status, (err, data) => {
            if (err) {
                return response.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }

            for (const order of data) {
                order.address = JSON.parse(order.address);
                order.client = JSON.parse(order.client);
                order.products = JSON.parse(order.products);
                order.delivery = JSON.parse(order.delivery);
            }
            
            
            return response.status(201).json(data);
        });
    },

    async create(request, response) {
        const order = request.body; // SE CAPTURAN LOS DATOS QUE ME ENVIE EL CLIENTE
        
        Order.create(order, async (error, id) => {
            if(error){
                return response.status(501).json({
                    success: false,
                    message: 'Error con el registro de la orden',
                    error: error
                })
            }
            
            for (const product of order.products) {
                await orderHasProducts.create(id, product.id, product.quantity, (error, id_data) => {
                    if(error){
                        return response.status(501).json({
                            success: false,
                            message: 'Error con el registro de productos en la orden',
                            error: error
                        });
                    }
                });
            }

            return response.status(201).json({
                success: true,
                message: 'Registro de la orden se realizo correctamente',
                data: `${id}` // EL ID DEL NUEVA ORDEN QUE SE REGISTRO
            });
        });
    },

    async updateToDispatched(request, response) {
        const order = request.body;
        
        Order.updateToDispatched(order.id, order.id_delivery, async (error, id_order) => {
            if(error){
                return response.status(501).json({
                    success: false,
                    message: 'Error al actualiar la orden',
                    error: error
                })
            }

            return response.status(201).json({
                success: true,
                message: 'La orden se actualizo realizo correctamente',
                data: `${id_order}`
            })
        })
    },

    updateToOnTheWay(request, response) {
        const order = request.body;

        Order.updateToOnTheWay(order.id, order.id_delivery, (err, id_order) => {
            if (err) {
                return response.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return response.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },

    updateToDelivered(request, response) {
        const order = request.body;

        Order.updateToDelivered(order.id, order.id_delivery, (err, id_order) => {
            if (err) {
                return response.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return response.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
}