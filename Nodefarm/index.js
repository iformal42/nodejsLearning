const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8',
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8',
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8',
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const prodData = JSON.parse(data);
const slugs = prodData.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const myUrl = new URL(req.url, `http://${req.headers.host}`);
  // slugify("fres")
  const pathname = myUrl.pathname;
  const query = Object.fromEntries(myUrl.searchParams);

  // Overview pag
  if (pathname === '/' || pathname === '/overview') {
    // res
    res.writeHead(200, {
      'content-type': 'text/html',
      'my-header': 'Musaif',
    });
    const cardsHtml = prodData
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
  } else if (pathname == '/product') {
    const { id } = query;
    const product = prodData[id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === '/api') {
    // console.log(prodData);
    res.writeHead(200, {
      'content-type': 'application/josn',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-header': 'Musaif',
    });
    res.end('<h1>not found</h1>');
  }
});

server.listen(8000, () => {
  console.log('listention at 8000');
});
