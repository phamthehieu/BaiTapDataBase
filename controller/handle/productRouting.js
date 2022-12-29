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
            <td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop${product.id}">Delete</button>
<div class="modal fade" id="staticBackdrop${product.id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Có Xóa Không
      </div>
      <div class="modal-footer">
        <a href="/product/home"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Không</button></a>
        <form action="/product/delete/${product.id}" method="post">
            <button type="submit" class="btn btn-primary">Có</button>
        </form>
      </div>
    </div>
  </div>
</div></td></tr>`
        })
        indexHtml = indexHtml.replace('{products}', tbody);
        return indexHtml;
    }

    static showHome(req, res) {
        if (req.method === 'GET') {
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
        } else {
            let data = '';
            req.on('data', chuck => {
                data += chuck;
            })
            req.on('end',async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    let search = qs.parse(data)
                    console.log(search.search)
                    fs.readFile('./views/home.html', 'utf-8', async (err, indexHtml) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let products = await ProductService.searchProduct(search.search)
                            indexHtml = ProductRouting.getHtmlProduct(products, indexHtml)
                            res.writeHead(200, 'text/html');
                            res.write(indexHtml);
                            res.end();
                        }
                    })
                }
            })
        }
    }

    static async showEdit(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/product/edit.html', 'utf-8', async (err, edit) => {
                if (err) {
                    console.log(err)
                } else {
                    let product = await ProductService.finById(id)
                    edit = edit.replace('{name}', product[0].name);
                    edit = edit.replace('{price}', product[0].price);
                    edit = edit.replace('{describe}', product[0].describe);
                    edit = edit.replace('{id}', id)
                    res.writeHead(200, 'text/html');
                    res.write(edit);
                    res.end();
                }
            })
        } else {
            let editData = '';
            req.on('data', chuck => {
                editData += chuck;
            })
            req.on('end', async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    let product = qs.parse(editData);
                    let data = await ProductService.editProduct(product, id);
                    res.writeHead(301, {'location': `/product/upLoadEdit/${id}`});
                    res.end();
                }
            })
        }
    }

    static showFormUpLoadEdit(req, res ,id) {
       if (req.method === 'GET') {
           fs.readFile('./views/product/upLoadFileEdit.html', 'utf-8', (err, upLoadHtml) => {
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
               let tmpPath1 = files.img.filepath;
               let newPath1 = path.join(__dirname, '..', '..', "public", files.img.originalFilename);
               await fs.readFile(newPath1, (err) => {
                   if (err) {
                       fs.copyFile(tmpPath1, newPath1, (err) => {
                           if (err) throw err;
                       });
                   }
               })
               console.log(id)
               await ProductService.editImage(files.img.originalFilename, id);
               res.writeHead(301, {'location': '/product/home'})
               res.end();
           });
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
                res.writeHead(301, {'location': '/product/home'})
                res.end();
            });
        }
    }

    static showFormDelete(req, res, id) {
        if (req.method === 'POST') {
            console.log(id)
            let mess =  ProductService.deleteProduct(id);
            res.writeHead(301, {'location': '/product/home'});
            res.end();
        }
    }

}

module.exports = ProductRouting;