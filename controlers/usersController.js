const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Rol = require('../models/rol');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');

module.exports = {
    login(request, response) {
        const email = request.body.email;
        const password = request.body.password;

        User.findByEmail(email, async(error, myUser) => {
            if(error) {
                return response.status(501).json({
                    success: false,
                    massage: 'Hubo un error con el registro del usuario',
                    error: error
                })
            }
            if(!myUser) {
                return response.status(401).json({ // EL CLIENT NO TIENE AUTORIZACION PARA REALIZAR ESTA PETICION
                    success: false,
                    message: 'El email no fue encontrado!'
                })
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password)
            
            if(isPasswordValid){
                const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey, {});

                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: JSON.parse(myUser.roles)
                }
                
                return response.status(201).json({
                    success: true,
                    message: 'El usuario fue autenticado',
                    data:data
                })
            }else{
                return response.status(401).json({
                    success: false, 
                    message: 'El password es incorrecto'
                })
            }
        })
    },

    register(request, response) {
        const user = JSON.parse(request.body.user) // SE CAPTURAN LOS DATOS QUE ME ENVIE EL CLIENTE
        User.create(user, (error, data) => {
            if(error){
                return response.status(501).json({
                    success: false,
                    message: 'Error con el registro del usuario',
                    error: error
                })
            }
            return response.status(201).json({
                success: true,
                message: 'Registro se realizo correctamente',
                data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
            })
        })
    },

    async registerWithImage(request, response) {
        const user = JSON.parse(request.body.user) // SE CAPTURAN LOS DATOS QUE ME ENVIE EL CLIENTE
        const files = request.files;

        if(files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if(url != undefined && url != null) {
                user.image = url;
            }
        }

        User.create(user, (error, data) => {
            if(error){
                return response.status(501).json({
                    success: false,
                    message: 'Error con el registro del usuario',
                    error: error
                })
            }

            user.id = `${data}`;
            const token = jwt.sign({id: user.id, email: user.email}, keys.secretOrKey, {});
            user.session_token = `JWT ${token}`;

            Rol.create(user.id, 3, (error, data) => {
                if(error){
                    return response.status(501).json({
                        success: false,
                        message: 'Error con el registro del rol de usuario',
                        error: error
                    })
                }
                
                return response.status(201).json({
                    success: true,
                    message: 'Registro se realizo correctamente',
                    data: user // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
                });
            });

        })
    },

    async updateWithImage(req, res) {
        const user = JSON.parse(req.body.user); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
        console.log('DATA DEL CLIENTE ', user);

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.updateWithImage(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Usuario actualizado correctamente',
                data: user
            });
        

        });

    },

    async updateWithoutImage(req, res) {

        const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        User.updateWithoutImage(user, (err, data) => {

        
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Usuario actualizado correctamente',
                data: user
            });
        

        });

    },

    findDeliveryMen(req, res) {
        User.findDeliveryMen((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con al listar los repartidores',
                    error: err
                });
            }

            
            return res.status(201).json(data);
        });
    }
}