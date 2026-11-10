// GitHub Pages serves 404.html for unknown paths. Copying the SPA's index.html
// there lets deep links like /shop/dates load the app and route client-side.
// .nojekyll stops Pages from hiding Expo's underscore-prefixed folders.
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));
fs.writeFileSync(path.join(dist, '.nojekyll'), '');
console.log('spa-fallback: wrote dist/404.html and dist/.nojekyll');
