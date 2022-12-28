const http = require('http');
const url = require('url');
const Router = require('./controller/router')
const NotFound = require('./controller/handle/notFoundRouting')

const sever = http.createServer((req, res) => {
    let pathName = url.parse(req.url, true).pathname;
    const arrPath = pathName.split('/')
    const trimPath = arrPath[arrPath.length - 1]
    let chosenHandle;
    if (typeof Router[trimPath] === 'undefined') {
        chosenHandle = NotFound.notFound;
    } else {
        chosenHandle = Router[trimPath];
    }
    chosenHandle(req, res);
})
sever.listen(8080, () => {
    console.log(`sever running !!!`)
})