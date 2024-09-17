'use strict'

const { createServer } = require('http');
const { URL } = require('url');
const headers = { "Content-Type": "application/json" };
const data = require('./' + process.argv[2]);
const s = createServer(
    (req, res) => {
        let id;
        try {
            id = new URL(req.url, `http://${req.headers.host}`).searchParams.get('id');
        }
        catch (e) { id = undefined; };
        const value = data[id];
        res.writeHead(200, headers);
        const result = { id, value };
        res.end(`${JSON.stringify(result)}\n`);
    });
s.listen(8080); // test with curl -iX GET localhost:8080/<path> or the Node.js client
