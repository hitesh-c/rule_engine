// build.js
const esbuild = require('esbuild');
// import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['./src/index.js'], // Adjust the entry point as needed
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: './engine/index.js', // Adjust the output file as needed
  platform: 'node', // Adjust the platform as needed (e.g., 'browser' for browser code)
  target: ['es2015'] // Adjust the target as needed
}).catch(() => process.exit(1));