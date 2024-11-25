import path from 'node:path';
import { lstat, readFile, readdir, writeFile } from 'node:fs/promises';
import consola from 'consola';
import fs from 'fs-extra';
import { pascalCase } from 'scule';
import { XMLParser } from 'fast-xml-parser';

const REMIX_PREFIX = 'ri-';
const LUCIDE_PREFIX = 'lu-';
const TARGET = 'src/icons/';
const CHUNK_SIZE = 500;

function resolveRoot(...dir) {
  return path.resolve(import.meta.dirname, '..', ...dir);
}

function resolveRemixIconDir() {
  return resolveRoot('node_modules', 'remixicon', 'icons');
}

function resolveLucideIconDir() {
  return resolveRoot('node_modules', 'lucide', 'dist', 'esm', 'icons');
}

function resolveCustomIconDir() {
  return resolveRoot('src', 'custom-icons');
}

async function loop(data, cb) {
  async function recursiveLoop(index) {
    if (index < data.length) {
      await cb(data[index], index);
      await recursiveLoop(index + 1);
    }
  }

  await recursiveLoop(0);
}

function chunkArray(a, n) {
  return [...new Array(Math.ceil(a.length / n))].map((_, i) =>
    a.slice(n * i, n + n * i),
  );
}

function getPathFromSvgString(svg) {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });
  const obj = parser.parse(svg);

  function findFirstPath(node) {
    if (node.path)
      return node.path;
    if (node.g)
      return findFirstPath(node.g);
    return null;
  }

  const path = findFirstPath(obj.svg);
  return path['@_d'];
}

async function getAllSvgDataFromPath(pathDir) {
  const type = await lstat(pathDir);

  if (type.isDirectory()) {
    const res = [];
    const dirs = await readdir(pathDir);
    await loop(dirs, async (child) => {
      res.push(...(await getAllSvgDataFromPath(`${pathDir}/${child}`)));
    });
    return res;
  }

  try {
    const isLucide = path.basename(pathDir).startsWith('lu-');
    const name = (!isLucide ? REMIX_PREFIX : '') + path.basename(pathDir).replace('.svg', '');
    const generatedName = pascalCase(name);
    const svg = await readFile(pathDir, 'utf8');
    const svgPath = getPathFromSvgString(svg);

    return [
      {
        name,
        generatedName,
        components: [
          ['path', { d: svgPath }],
        ],
      },
    ];
  }
  catch (error) {
    consola.warn(`Error while processing ${pathDir}`, error);
    return [];
  }
}

function convertToSinglePath(elements) {
  // Convert each element to path commands
  const pathCommands = elements.map(([type, attrs], index) => {
    switch (type) {
      case 'rect':
        return rectToPath(attrs);
      case 'circle':
        return circleToPath(attrs);
      case 'line':
        return lineToPath(attrs);
      case 'path':
        return convertPath(attrs.d, index);
      default:
        return '';
    }
  });

  // Combine all path commands
  const combinedPath = pathCommands.join(' ');

  return [['path', { d: combinedPath }]];
}

function convertPath(path, index) {
  if (path.startsWith('M') || index === 0) {
    return path;
  }

  const commands = path.match(/[a-z][^a-z]*/gi);
  let currentX = 0;
  let currentY = 0;
  let controlX = 0; // Last control point for smooth curve commands
  let controlY = 0;
  let startX = 0;
  let startY = 0;
  let absolutePath = '';

  commands.forEach((segment) => {
    const command = segment[0];
    const params = segment.slice(1).trim().match(/-?[\d.]+(?:e[+-]?\d+)?/g);
    const numbers = params ? params.map(Number) : [];
    let i = 0;

    switch (command) {
      case 'm': // Relative move
        currentX += numbers[i++];
        currentY += numbers[i++];
        absolutePath += `M${currentX} ${currentY} `;
        startX = currentX;
        startY = currentY;
        while (i < numbers.length) {
          currentX += numbers[i++];
          currentY += numbers[i++];
          absolutePath += `L${currentX} ${currentY} `;
        }
        break;
      case 'l': // Relative line
        while (i < numbers.length) {
          currentX += numbers[i++];
          currentY += numbers[i++];
          absolutePath += `L${currentX} ${currentY} `;
        }
        break;
      case 'h': // Relative horizontal line
        while (i < numbers.length) {
          currentX += numbers[i++];
          absolutePath += `L${currentX} ${currentY} `;
        }
        break;
      case 'v': // Relative vertical line
        while (i < numbers.length) {
          currentY += numbers[i++];
          absolutePath += `L${currentX} ${currentY} `;
        }
        break;
      case 'c': // Relative cubic Bezier curve
        while (i < numbers.length) {
          const x1 = currentX + numbers[i++];
          const y1 = currentY + numbers[i++];
          controlX = currentX + numbers[i++];
          controlY = currentY + numbers[i++];
          currentX += numbers[i++];
          currentY += numbers[i++];
          absolutePath += `C${x1} ${y1}, ${controlX} ${controlY}, ${currentX} ${currentY} `;
        }
        break;
      case 's': // Relative smooth cubic Bezier curve
        while (i < numbers.length) {
          const x1 = 2 * currentX - controlX;
          const y1 = 2 * currentY - controlY;
          controlX = currentX + numbers[i++];
          controlY = currentY + numbers[i++];
          currentX += numbers[i++];
          currentY += numbers[i++];
          absolutePath += `C${x1} ${y1}, ${controlX} ${controlY}, ${currentX} ${currentY} `;
        }
        break;
      case 'a': // Relative arc
        while (i < numbers.length) {
          const rx = numbers[i++];
          const ry = numbers[i++];
          const xAxisRotation = numbers[i++];
          const largeArcFlag = numbers[i++];
          const sweepFlag = numbers[i++];
          currentX += numbers[i++];
          currentY += numbers[i++];
          absolutePath += `A${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${currentX} ${currentY} `;
        }
        break;
      case 'M': // Absolute move
      case 'L': // Absolute line
      case 'H': // Absolute horizontal line
      case 'V': // Absolute vertical line
      case 'C': // Absolute cubic Bezier curve
      case 'S': // Absolute smooth cubic Bezier curve
      case 'A': // Absolute arc
        // Directly use the segment without change
        absolutePath += `${segment} `;
        break;
      case 'Z':
      case 'z':
        currentX = startX;
        currentY = startY;
        absolutePath += 'Z';
        break;
      default:
        console.warn(`Command ${command} not specifically handled yet.`);
        break;
    }
  });

  return absolutePath.trim();
}

function rectToPath({ x = 0, y = 0, width, height, rx = 0, ry = rx }) {
  if (rx === 0) {
    // Simple rectangle without rounded corners
    return `M${x},${y} h${width} v${height} h-${width} Z`;
  }

  // Rectangle with rounded corners
  return `
    M${Number(x) + Number(rx)},${y}
    h${width - 2 * rx}
    a${rx},${ry} 0 0 1 ${rx},${ry}
    v${height - 2 * ry}
    a${rx},${ry} 0 0 1 -${rx},${ry}
    h-${width - 2 * rx}
    a${rx},${ry} 0 0 1 -${rx},-${ry}
    v-${height - 2 * ry}
    a${rx},${ry} 0 0 1 ${rx},-${ry}
    Z
  `.trim().replace(/\s+/g, ' ');
}

function circleToPath({ cx = 0, cy = 0, r }) {
  // Approximate circle using cubic bezier curves
  return `
    M${cx - r},${cy}
    a${r},${r} 0 1,0 ${r * 2},0
    a${r},${r} 0 1,0 -${r * 2},0
    Z
  `.trim().replace(/\s+/g, ' ');
}

function lineToPath({ x1 = 0, y1 = 0, x2 = 0, y2 = 0 }) {
  return `M${x1} ${y1} L${x2} ${y2}`;
}

async function getLucideSvgDataFromPath(pathDir) {
  const type = await lstat(pathDir);
  if (type.isDirectory()) {
    const res = [];
    const dirs = await readdir(pathDir);
    await loop(dirs, async (child) => {
      if (child.endsWith('.js')) {
        res.push(...(await getLucideSvgDataFromPath(`${pathDir}/${child}`)));
      }
    });
    return res;
  }

  try {
    const filePath = path.basename(pathDir).replace('.js', '');
    const name = LUCIDE_PREFIX + filePath;
    const generatedName = pascalCase(name);
    const iconModule = await import(`${pathDir}`);
    const components = convertToSinglePath(iconModule.default[2]);

    return [{
      name,
      generatedName,
      components,
    }];
  }
  catch (error) {
    consola.warn(`Error while processing ${pathDir}`, error);
    return [];
  }
}

async function collectAllIconMetas() {
  const dirs = [resolveRemixIconDir(), resolveCustomIconDir()];
  const res = [];

  await loop(dirs, async (dir) => {
    res.push(...(await getAllSvgDataFromPath(dir)));
  });

  res.push(...(await getLucideSvgDataFromPath(resolveLucideIconDir())));

  return res;
}

async function generate() {
  fs.ensureDirSync(TARGET);
  const metadata = await collectAllIconMetas();
  await writeMetadata(metadata);
}

async function writeMetadata(metadata) {
  const chunks = chunkArray(metadata, CHUNK_SIZE);
  const names = [];

  let indexFileContent = '';

  await loop(chunks, async (chunk, index) => {
    const fileName = `icons_${index + 1}`;

    indexFileContent += `export * from './${fileName}';\n`;
    let chunkFileContent = `// Generated by scripts/generate-icons.js
/* eslint-disable */
/* prettier-ignore */
import { type GeneratedIcon } from '@/types/icons';\n
`;
    await loop(chunk, (icon) => {
      chunkFileContent += `export const ${icon.generatedName}: GeneratedIcon = {
  name: '${icon.name}',
  components: ${JSON.stringify(icon.components)},
};\n`;

      names.push(icon.name);
    });

    await writeFile(
      resolveRoot(`${TARGET}${fileName}.ts`),
      chunkFileContent,
      'utf8',
    );
  });

  indexFileContent += `export const RuiIcons = [${names
    .map(x => `"${x.replace('ri-', '')}"`)
    .join(',')}] as const;\n`;

  indexFileContent += `export type RuiIcons = string;\n`;
  indexFileContent += `
export function isRuiIcon(x: any): x is RuiIcons {
  return RuiIcons.includes(x);
}\n`.trim();

  await writeFile(resolveRoot(`${TARGET}index.ts`), indexFileContent, 'utf8');
}

await generate();
