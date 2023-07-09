const db = require('../config/config');
const Address = {}

Address.findByUser = (id_user, result) => {
    const sql = `
        SELECT
            CONVERT(id, char) as id,
            address,
            neighborhood,
            lat,
            lng,
            CONVERT(id_user, char) as id_user
        FROM
            addresses
        WHERE
            id_user = ?
        ORDER BY
            id
    `;

    db.query(
        sql,
        id_user,
        (error, data) => {
            if(error){
                result(error, null);
            }else{
                result(null, data)
            }
        }
    )
}

Address.create = (address, result) => {
    console.log('address' + JSON.stringify(address));
    const sql = `
        INSERT INTO addresses (
            address,
            neighborhood,
            id_user,
            lat,
            lng,
            created_at,
            updated_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?
        )
    `;

    db.query(
        sql,
        [
            address.address,
            address.neighborhood,
            address.id_user,
            address.lat,
            address.lng,
            new Date(),
            new Date()
        ],
        (error, response) => {
            if(error){
                console.log('Error: ', error);
                result(error, null);
            }else{
                console.log('Id de la nueva dirección: ', response.insertId);
                result(null, response.insertId);
            }
        }
    )
}

module.exports = Address;