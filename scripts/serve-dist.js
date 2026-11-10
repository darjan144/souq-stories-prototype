// Serves dist/ the way GitHub Pages will: under a subpath, with 404.html as the
// fallback for unknown routes. Usage: node scripts/serve-dist.js [/base] [port]
const http = require('http');
const fs = require('fs');
const path = require('path');

const base = process.argv[2] || '/souq-stories';
const port = Number(process.argv[3] || 8090);
const dist = path.join(__dirname, '..', 'dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.svg': 'image/svg+xml' };

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    if (url === '/' || !url.startsWith(base)) {
      res.writeHead(302, { Location: `${base}/` });
      return res.end();
    }
    const rel = url.slice(base.length) || '/';
    let file = path.join(dist, rel);
    if (!file.startsWith(dist)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (fs.existsSync(file)) {
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      return fs.createReadStream(file).pipe(res);
    }
    res.writeHead(404, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.join(dist, '404.html')).pipe(res);
  })
  .listen(port, () => console.log(`Serving dist at http://localhost:${port}${base}/`));
