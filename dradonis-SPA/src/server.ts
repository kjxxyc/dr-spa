import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import compression from 'compression';
import express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import bootstrap from './main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/Spike/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Brotli/gzip compression for all responses (HTML, CSS, JS, JSON, fonts).
  // Azure SWA compresses automatically; this defends self-hosted SSR scenarios.
  server.use(compression({ threshold: 1024 }));

  // Example Express Rest API endpoints
  // server.get('/api/{*splat}', (req, res) => { });
  // Serve static files from /browser with aggressive immutable cache.
  // All asset filenames carry a content hash (outputHashing: all), so it's safe.
  server.use(express.static(distFolder, {
    maxAge: '1y',
    immutable: true,
    index: false,
    setHeaders: (res, path) => {
      // index.html and translation JSON must revalidate every time.
      if (path.endsWith('.html') || path.endsWith('en.json') || path.endsWith('es.json') || path.endsWith('fr.json') || path.endsWith('de.json')) {
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      }
    },
  }));

  // All regular routes use the Angular engine
  server.use((req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export default bootstrap;
