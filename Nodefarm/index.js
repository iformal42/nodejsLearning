const { log } = require('console');
const fs = require('fs');
const http = require("http");
const url = require("url");
const replaceTemplate = require('./modules/replaceTemplate');
// const textIn = fs.readFileSync("./txt/input.txt","utf-8");
// console.log(textIn);
// const textOut = `THis is title\n${textIn}`;
// fs.writeFileSync("./txt/output.txt",textOut);

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const prodData = JSON.parse(data);


const server = http.createServer((req, res) => {
    const myUrl = new URL(req.url, `http://${req.headers.host}`);

    const pathname = myUrl.pathname;
    const query = Object.fromEntries(myUrl.searchParams);

    // Overview page
    if (pathname === "/" || pathname === '/overview') {
        // res
        res.writeHead(200, {
            "content-type": "text/html",
            "my-header": "Musaif"
        })
        const cardsHtml = prodData.map(el =>
            replaceTemplate(tempCard, el)

        ).join("");

        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

        res.end(output);
    } else if (pathname == "/product") {
        const { id } = query;
        const product = prodData[id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }
    else if (pathname === "/api") {

        // console.log(prodData);
        res.writeHead(200,
            {
                "content-type": "application/josn"
            }
        )
        res.end(data);


    }
    else {
        res.writeHead(404, {
            "content-type": "text/html",
            "my-header": "Musaif"
        })
        res.end("<h1>not found</h1>");
    }
})

server.listen(8000, () => {
    console.log('listention at 8000');


})
