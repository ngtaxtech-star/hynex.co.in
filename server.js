var http = require('http');
var fs = require('fs');
var path = require('path');
var os = require('os');
var url = require('url');

var port = process.env.PORT ? Number(process.env.PORT) : 8000;
var root = process.cwd();

var mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

var server = http.createServer(function (req, res) {
  var urlPath;
  try {
    var parsed = url.parse(req.url || '/');
    urlPath = decodeURIComponent(parsed.pathname || '/');
  } catch (e) {
    res.writeHead(400);
    return res.end('Bad request');
  }

  // Make URL paths safe + relative (so "/" maps to "./")
  urlPath = urlPath.replace(/^\/+/, '');
  var fsPath = path.resolve(root, urlPath || 'index.html');

  // Prevent path traversal
  if (fsPath !== root && !fsPath.startsWith(root + path.sep)) {
    res.writeHead(400);
    return res.end('Bad request');
  }

  if (fs.existsSync(fsPath) && fs.statSync(fsPath).isDirectory()) {
    fsPath = path.join(fsPath, 'index.html');
  }

  if (!fs.existsSync(fsPath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Not found');
  }

  var ext = path.extname(fsPath).toLowerCase();
  res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
  fs.createReadStream(fsPath).pipe(res);
});

server.listen(port, '0.0.0.0', function () {
  console.log('Server running:');
  console.log('- http://localhost:' + port);
  console.log('- http://127.0.0.1:' + port);

  var nets = os.networkInterfaces();
  var ips = [];
  Object.keys(nets).forEach(function (name) {
    (nets[name] || []).forEach(function (net) {
      if (net && net.family === 'IPv4' && !net.internal) ips.push(net.address);
    });
  });

  ips.forEach(function (ip) {
    console.log('- http://' + ip + ':' + port);
  });
});
