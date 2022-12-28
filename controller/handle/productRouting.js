const fs = require('fs');
const ProductService = require ('../../service/productService')

class ProductRouting {
    static getHtmlProduct(products, indexHtml) {
        let tbody = '';
        products.map((product, index) => {
            tbody += `<tr>
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.image}</td>
            <td>${product.price}</td>
            <td>${product.describe}</td>
            <td><a href="/product/edit/${product.id}" type="button" class="btn btn-primary">Edit</a></td> 
            <td><a href="/product/delete/${product.id}" type="button" class="btn btn-danger">Delete</a></td></tr>`
        })
        indexHtml = indexHtml.replace('{products}', tbody);
        return indexHtml;
    }
    static showHome(req, res) {
        fs.readFile('./views/home.html', 'utf-8', async (err, homeHtml) => {
            if (err) {
                console.log(err)
            } else {
                let arr = await ProductService.getProducts();
                homeHtml = ProductRouting.getHtmlProduct(arr, homeHtml);
                res.writeHead(200, 'text/html');
                res.write(homeHtml);
                res.end();
            }
        })
    }
}

module.exports = ProductRouting;