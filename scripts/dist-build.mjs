import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const dist = path.resolve(__dirname, '..', 'dist');
if (fs.existsSync(dist))
  fs.rmSync(dist, { recursive: true });

function buildTypes() {
  const types = spawn('pnpm', ['build:types'], {
    stdio: [process.stdout, process.stderr],
  });

  types.on('close', (code) => {
    if (code !== 0) {
      console.error('[rotki-ui] build:types failed');
      process.exit(code);
    }

    const resolveAlias = spawn('pnpm', ['resolve:alias'], {
      stdio: [process.stdout, process.stderr],
    });

    resolveAlias.on('close', (code) => {
      if (code !== 0) {
        console.error('[rotki-ui] resolve:alias failed');
        process.exit(code);
      }
    });
  });
}

const build = spawn('pnpm', ['build'], {
  stdio: [process.stdout, process.stderr],
});

build.on('close', (code) => {
  if (code !== 0) {
    console.error('[rotki-ui] build failed');
    process.exit(code);
  }
  buildTypes();
});
