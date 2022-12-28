const Connection = require('../model/connection')
Connection.connecting1();

class ProductService {
    static getProducts() {
        let connection = Connection.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM products`,(err, product) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(product)
                }
            })
        })
    }
}
module.exports = ProductService;