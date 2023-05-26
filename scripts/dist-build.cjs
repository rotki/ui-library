const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const dist = path.resolve(__dirname, '..', 'dist');
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true });
}

const buildTypes = () => {
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
};

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
