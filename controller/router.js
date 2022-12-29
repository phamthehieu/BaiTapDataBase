const ProductRouting = require('./handle/productRouting')
const handler = {
    'product/home' : ProductRouting.showHome,
    'product/edit' : ProductRouting.showEdit,
    'product/create' : ProductRouting.showCreate,
    'product/upLoad' : ProductRouting.showFormUpLoad,
    'product/delete' : ProductRouting.showFormDelete,
    'product/upLoadEdit' : ProductRouting.showFormUpLoadEdit
}
module.exports = handler;