const Address = require('../models/address');

module.exports = {
    async findByUser(request, response) {
        const id_user = request.params.id_user;

        Address.findByUser(id_user, (error, data) => {
            if (error) {
                return response.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de cargar las direcciones',
                    error: error
                })
            }

            return response.status(201).json(data);
        })
    },
    async create(request, response) {
        //console.log(JSON.stringify(request.body))
        const address = request.body;

        Address.create(address, (error, id) => {
            if(error){
                return response.status(501).json({
                    success: false,
                    message: 'Error con el registro de la dirección',
                    error: error
                })
            }

            return response.status(201).json({
                success: true,
                message: 'Registro se realizo correctamente',
                data: `${id}` // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
            });
        })
    }
}