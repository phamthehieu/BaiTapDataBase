const fs = require('fs');
const ProductService = require('../../service/productService')
const qs = require('qs');
const formidable = require('formidable');
const path = require("path");

class ProductRouting {
    static getHtmlProduct(products, indexHtml) {
        let tbody = '';
        products.map((product, index) => {
            tbody += `<tr style="text-align: center">
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td><img src="/public/${product.image}" alt="Khong Co" style="width: auto; height: 50px"></td>
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

    static async showEdit(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/product/edit.html', 'utf-8', async (err, edit) => {
                if (err) {
                    console.log(err)
                } else {
                    let product = await ProductService.finById(id)
                    edit = edit.replace('{name}', product[0].name);
                    edit = edit.replace('{name}', product[0].image);
                    edit = edit.replace('{price}', product[0].price);
                    edit = edit.replace('{describe}', product[0].describe);
                    res.writeHead(200, 'text/html');
                    res.write(edit);
                    res.end();
                }
            })
        } else {
            let form = new formidable.IncomingForm();
            let editData = '';
            req.on('data', chuck => {
                editData += chuck;
            })
            req.on('end', async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    let product = qs.parse(editData);
                    console.log(product)
                    await ProductService.editProduct(product, id);
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }

    static showCreate(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/product/create.html', 'utf-8', (err, createHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(createHtml);
                    res.end();
                }
            })
        } else {
            let create = '';
            req.on('data', chuck => {
                create += chuck;
            })
            req.on('end', async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    let product = qs.parse(create);
                    let data = await ProductService.createProduct(product);
                    res.writeHead(301, {'location': `/product/upLoad/${data.insertId}`});
                    res.end();
                }
            })
        }
    }

    static showFormUpLoad(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/product/upLoadFile.html', 'utf-8', (err, upLoadHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(upLoadHtml);
                    res.end();
                }
            })
        } else {
            let form = new formidable.IncomingForm();
            form.parse(req, async function (err, fields, files) {
                if (err) {
                    console.log(err)
                }
                console.log(files)
                let tmpPath = files.img.filepath;
                let newPath = path.join(__dirname, '..', '..', "public", files.img.originalFilename);
                await fs.readFile(newPath, (err) => {
                    if (err) {
                        fs.copyFile(tmpPath, newPath, (err) => {
                            if (err) throw err;
                        });
                    }
                })
                await ProductService.editImage(files.img.originalFilename, id);
                res.writeHead(301, {'location': '/home'})
                res.end();
            });
        }
    }

}

module.exports = ProductRouting;