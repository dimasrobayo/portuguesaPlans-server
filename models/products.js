const db = require('../config/config');
const Product = {}

Product.findByCategory = (id_category, result) => {
    const sql = `
    SELECT
        CONVERT(p.id, char) AS id,
        p.name,
        p.description,
        p.price,
        p.image1,
        p.image2,
        p.image3,
        CONVERT(p.id_category, char) AS id_category
    FROM
        products as p
    WHERE
        p.id_category = ?
    `;

    db.query(
        sql,
        [id_category],
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Productos:', data);
                result(null, data);
            }
        }
    )
},

Product.create = (product, result) => {
    const sql = `
    INSERT INTO
        products(
            name,
            description,
            price,
            image1,
            image2,
            image3,
            id_category,
            created_at,
            updated_at
        )VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            product.name,
            product.description,
            product.price,
            product.image1,
            product.image2,
            product.image3,
            product.id_category,
            new Date(),
            new Date(),
        ],
        (error, response) => {
            if(error) {
                console.log('Error: ', error);
                result(error, null);
            }else{
                console.log('Id del nuevo producto: ', response.insertId);
                result(null, response.insertId);
            }
        }
    )
}

Product.update = (product, result) => {
    const sql = `
    UPDATE
        products
    SET
        name = ?,
        description = ?,
        price = ?,
        image1 = ?,
        image2 = ?,
        image3 = ?,
        id_category = ?,
        updated_at = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [
            product.name,
            product.description,
            product.price,
            product.image1,
            product.image2,
            product.image3,
            product.id_category,
            new Date(),
            product.id
        ],
        (error, res) => {
            if (error) {
                console.log('Error:', error);
                result(error, null);
            }
            else {
                console.log('Id del producto actualizado:', product.id);
                result(null, product.id);
            }
        }
    )
}

Product.delete = (id, result) => {
    const sql = `
    DELETE FROM
        products
    WHERE
        id = ?
    `;

    db.query(
        sql,
        [id],
        (error, res) => {
            if (error) {
                console.log('Error:', error);
                result(error, null);
            }
            else {
                console.log('Id del producto eliminado:', id);
                result(null, id);
            }
        }
    )
}

module.exports = Product;