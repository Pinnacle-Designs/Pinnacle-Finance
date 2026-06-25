import { copyFileSync, readFileSync, writeFileSync, existsSync } from 'fs';

const SPA_REDIRECT = `
    <script type="text/javascript">
      (function(l) {
        if (l.search[1] === '/') {
          var decoded = l.search.slice(1).split('&').map(function(s) {
            return s.replace(/~and~/g, '&');
          }).join('?');
          window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
        }
      }(window.location));
    </script>`;

if (!existsSync('dist/index.html')) {
  console.error('dist/index.html not found — run vite build first');
  process.exit(1);
}

const indexHtml = readFileSync('dist/index.html', 'utf8');
const withRedirect = indexHtml.includes('window.history.replaceState')
  ? indexHtml
  : indexHtml.replace('</head>', `${SPA_REDIRECT}\n  </head>`);

writeFileSync('dist/index.html', withRedirect);
copyFileSync('dist/index.html', 'dist/404.html');
console.log('Created dist/404.html for GitHub Pages SPA routing');
