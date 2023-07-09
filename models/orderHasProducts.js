const db = require('../config/config');
const orderHasProducts = {}


orderHasProducts.create = (id_order, id_product, quantity, result) => {
    const sql = `
    INSERT INTO
    order_has_products(
            id_order,
            id_product,
            quantity,
            created_at,
            updated_at
        )VALUES(
            ?,?,?,?,?
        )
    `;

    db.query(
        sql,
        [
            id_order,
            id_product,
            quantity,
            new Date(),
            new Date()
        ],
        (error, response) => {
            if(error){
                console.log('Error: ', error);
                result(error, null);
            }else{
                console.log('Id de la nueva orden: ', response.insertId);
                result(null, response.insertId);
            }
        }
    )
}

module.exports = orderHasProducts;