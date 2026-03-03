import httpProxy from 'http-proxy';
import * as http from 'http';
import app from '#root/app_initial.js';

const proxy = httpProxy.createProxyServer({
  target: 'http://frontend:3000',
  ws: true,
});

proxy.on('error', function (e) {
  console.log(e);
});

const server = http.createServer(app);

app.get(/\/(.*)/, function (req, res) {
  proxy.web(req, res);
});

server.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});

server.listen(3001, () => {
  console.log('\nCODYMATCH READY ON PORT 3001');
});
