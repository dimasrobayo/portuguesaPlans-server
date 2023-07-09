const db = require('../config/config');

const Rol = {};

Rol.create = (id_user, id_rol, result) => {
    const sql = `
        INSERT INTO
        user_has_roles(
            id_user,
            id_rol,
            created_at,
            updated_at
        )VALUES(
            ?, ?, ?, ?
        )
    `;

    db.query(
        sql,
        [
            id_user,
            id_rol,
            new Date(),
            new Date()
        ],
        (error, response) => {
            if(error){
                console.log('Error: ', error);
                result(error, null);
            }else{
                console.log('Id del nuevo usuario: ', response.insertId);
                result(null, response.insertId);
            }
        }
    )
}

module.exports = Rol;