const ProductRouting = require('./handle/productRouting')
const handler = {
    'home' : ProductRouting.showHome,
    'product/edit' : ProductRouting.showEdit,
    'product/create' : ProductRouting.showCreate,
    'product/upLoad' : ProductRouting.showFormUpLoad
}
module.exports = handler;