// Render the whole App to a string in Node to surface render-path crashes.
// Effects (browser-only) don't run under SSR; this validates data + rendering.
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const html = renderToString(React.createElement(App));

  const checks = [
    ['hero headline', html.includes('Ideas today.')],
    ['learning', html.includes('Invytra Learning')],
    ['projects', html.includes('Invytra Projects')],
    ['events', html.includes('Invytra Events')],
    ['reviews', html.includes('Trusted by')],
    ['contact', html.includes('make your idea real')],
    ['footer', html.includes('All rights reserved')],
  ];

  let ok = true;
  for (const [name, pass] of checks) {
    console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`);
    if (!pass) ok = false;
  }
  console.log(`\nRendered ${html.length} bytes. ${ok ? 'ALL PASS' : 'SOME FAILED'}`);
  process.exitCode = ok ? 0 : 1;
} catch (err) {
  console.error('SSR smoke failed:', err);
  process.exitCode = 1;
} finally {
  await server.close();
}
