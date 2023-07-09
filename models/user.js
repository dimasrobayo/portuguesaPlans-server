const db = require('../config/config');
const bcrypt = require('bcryptjs');

const User = {};

User.findById = async (id, result) => {
    const sql = `
    SELECT 
        u.id,
        u.name,
        u.lastname,
        u.email,
        u.phone,
        u.image,
        u.password,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', CONVERT(r.id, char),
                'name', r.name,
                'image', r.image,
                'route', r.route
            )
        ) AS roles
    FROM users AS u
    INNER JOIN user_has_roles AS uhr ON uhr.id_user = u.id
    INNER JOIN roles AS r ON r.id = uhr.id_rol
    WHERE u.id = ?
    GROUP BY u.id
    `;

    db.query(
        sql,
        [id],
        (error, user) => {
            if(error){
                result(error, null)
            }else{
                result(null, user[0])
            }
        }
    )
}

User.findDeliveryMen = (result) => {
    const sql = `
    SELECT
        CONVERT(U.id, char) AS id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id 
    INNER JOIN
        roles AS R
    ON
        R.id = UHR.id_rol
    WHERE
        R.id = 2;
    `;

    db.query(
        sql,
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, data);
            }
        }
    );
}

User.findByEmail = async (email, result) => {
    const sql = `
    SELECT 
        u.id,
        u.name,
        u.lastname,
        u.email,
        u.phone,
        u.image,
        u.password,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', CONVERT(r.id, char),
                'name', r.name,
                'image', r.image,
                'route', r.route
            )
        ) AS roles
    FROM users AS u
    INNER JOIN user_has_roles AS uhr ON uhr.id_user = u.id
    INNER JOIN roles AS r ON r.id = uhr.id_rol
    WHERE u.email = ?
    GROUP BY u.id
    `;
    
    db.query(
        sql,
        [email],
        (error, user) => {
            if(error){
                result(error, null);
            }else{
                result(null, user[0])
            }
        }
    )
}

User.create = async (user, result) => {
    const hash = await bcrypt.hash(user.password, 10);

    const sql = `
        INSERT INTO 
            users(
                email,
                name,
                lastname,
                phone,
                image,
                password,
                create_at,
                update_at
            )
            VALUE(?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            hash,
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

User.updateWithImage = (user, result) => {
    const sql = `
    UPDATE
        users
    SET
        name = ?,
        lastname = ?,
        phone = ?,
        image = ?,
        update_at = ?
    WHERE
        id = ?
    `;

    db.query
    (
        sql,
        [
            user.name,
            user.lastname,
            user.phone,
            user.image,
            new Date(),
            user.id
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Usuario actualizado:', user.id);
                result(null, user.id);
            }
        }
    )
}

User.updateWithoutImage = (user, result) => {

    const sql = `
    UPDATE
        users
    SET
        name = ?,
        lastname = ?,
        phone = ?,
        update_at = ?
    WHERE
        id = ?
    `;

    db.query
    (
        sql,
        [
            user.name,
            user.lastname,
            user.phone,
            new Date(),
            user.id
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Usuario actualizado:', user.id);
                result(null, user.id);
            }
        }
    )
}

module.exports = User;