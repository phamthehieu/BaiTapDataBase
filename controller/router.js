const ProductRouting = require('./handle/productRouting')
const handler = {
    'home' : ProductRouting.showHome,
}
module.exports = handler;