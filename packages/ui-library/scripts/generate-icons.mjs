import { lstat, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import consola from 'consola';
import { XMLParser } from 'fast-xml-parser';
import fs from 'fs-extra';
import { pascalCase } from 'scule';

const LUCIDE_PREFIX = 'lu-';
const TARGET = 'src/icons/';
const CHUNK_SIZE = 500;

function resolveRoot(...dir) {
  return path.resolve(import.meta.dirname, '..', ...dir);
}

function resolveLucideIconDir() {
  return resolveRoot('node_modules', 'lucide', 'dist', 'esm', 'lucide', 'src', 'icons');
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

  function findCombinedPath(node) {
    if (node.path) {
      if (Array.isArray(node.path)) {
        return node.path.map(item => item['@_d']).join(' ');
      }
      return node.path['@_d'];
    }
    if (node.g)
      return findCombinedPath(node.g);
    return null;
  }

  return findCombinedPath(obj.svg);
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
    const name = path.basename(pathDir).replace('.svg', '');
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
      case 'ellipse':
        return ellipseToPath(attrs);
      case 'line':
        return lineToPath(attrs);
      case 'polyline':
        return polylineToPath(attrs);
      case 'polygon':
        return polygonToPath(attrs);
      case 'path':
        return convertPath(attrs.d, index);
      default:
        console.log(`tag ${type} is skipped`);
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
  let controlX = 0;
  let controlY = 0;
  let startX = 0;
  let startY = 0;
  let absolutePath = '';

  // Utility to round numbers for precision consistency
  function round(value, precision = 2) {
    return Number(value.toFixed(precision));
  }

  commands.forEach((segment) => {
    const command = segment[0];
    const params = segment.slice(1).trim().match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi); // Improved regex for numbers
    const numbers = params ? params.map(Number) : [];
    let i = 0;

    switch (command) {
      case 'm': // Relative move
        currentX += numbers[i++];
        currentY += numbers[i++];
        absolutePath += `M${round(currentX)} ${round(currentY)} `;
        startX = currentX;
        startY = currentY;
        while (i < numbers.length) {
          currentX += numbers[i++];
          currentY += numbers[i++];
          absolutePath += `L${round(currentX)} ${round(currentY)} `;
        }
        break;
      case 'l': // Relative line
        while (i < numbers.length) {
          currentX += numbers[i++];
          currentY += numbers[i++];
          absolutePath += `L${round(currentX)} ${round(currentY)} `;
        }
        break;
      case 'h': // Relative horizontal line
        while (i < numbers.length) {
          currentX += numbers[i++];
          absolutePath += `L${round(currentX)} ${round(currentY)} `;
        }
        break;
      case 'v': // Relative vertical line
        while (i < numbers.length) {
          currentY += numbers[i++];
          absolutePath += `L${round(currentX)} ${round(currentY)} `;
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
          absolutePath += `C${round(x1)} ${round(y1)}, ${round(controlX)} ${round(controlY)}, ${round(currentX)} ${round(currentY)} `;
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
          absolutePath += `C${round(x1)} ${round(y1)}, ${round(controlX)} ${round(controlY)}, ${round(currentX)} ${round(currentY)} `;
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
          absolutePath += `A${round(rx)} ${round(ry)} ${round(xAxisRotation)} ${largeArcFlag} ${sweepFlag} ${round(currentX)} ${round(currentY)} `;
        }
        break;
      case 'M': // Absolute move
        currentX = numbers[i++];
        currentY = numbers[i++];
        absolutePath += `M${round(currentX)} ${round(currentY)} `;
        startX = currentX;
        startY = currentY;
        while (i < numbers.length) {
          currentX = numbers[i++];
          currentY = numbers[i++];
          absolutePath += `L${round(currentX)} ${round(currentY)} `;
        }
        break;
      case 'L': // Absolute line
        while (i < numbers.length) {
          currentX = numbers[i++];
          currentY = numbers[i++];
          absolutePath += `L${round(currentX)} ${round(currentY)} `;
        }
        break;
      case 'H': // Absolute horizontal line
        while (i < numbers.length) {
          currentX = numbers[i++];
          absolutePath += `L${round(currentX)} ${round(currentY)} `;
        }
        break;
      case 'V': // Absolute vertical line
        while (i < numbers.length) {
          currentY = numbers[i++];
          absolutePath += `L${round(currentX)} ${round(currentY)} `;
        }
        break;
      case 'C': // Absolute cubic Bezier curve
        while (i < numbers.length) {
          const x1 = numbers[i++];
          const y1 = numbers[i++];
          const x2 = numbers[i++];
          const y2 = numbers[i++];
          currentX = numbers[i++];
          currentY = numbers[i++];
          absolutePath += `C${round(x1)} ${round(y1)}, ${round(x2)} ${round(y2)}, ${round(currentX)} ${round(currentY)} `;
        }
        break;
      case 'A': // Absolute arc
        while (i < numbers.length) {
          const rx = numbers[i++];
          const ry = numbers[i++];
          const xAxisRotation = numbers[i++];
          const largeArcFlag = numbers[i++];
          const sweepFlag = numbers[i++];
          currentX = numbers[i++];
          currentY = numbers[i++];
          absolutePath += `A${round(rx)} ${round(ry)} ${round(xAxisRotation)} ${largeArcFlag} ${sweepFlag} ${round(currentX)} ${round(currentY)} `;
        }
        break;
      case 'Z':
      case 'z':
        currentX = startX;
        currentY = startY;
        absolutePath += 'Z';
        break;
      default:
        console.warn(`Command ${command} is not handled.`);
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

function ellipseToPath({ cx = 0, cy = 0, rx = 0, ry = 0 }) {
  // Similar to a circle but using different radii for x and y coordinates
  return `
    M${cx - rx},${cy}
    a${rx},${ry} 0 1,0 ${rx * 2},0
    a${rx},${ry} 0 1,0 -${rx * 2},0
    Z
  `.trim().replace(/\s+/g, ' ');
}

function lineToPath({ x1 = 0, y1 = 0, x2 = 0, y2 = 0 }) {
  return `M${x1} ${y1} L${x2} ${y2}`;
}

function polylineToPath({ points }) {
  if (!points)
    return '';

  // Split points string into array of coordinates
  const coordinates = points.trim().split(/\s+|,/).map(Number);

  if (coordinates.length < 4)
    return ''; // Need at least 2 points

  // Start path at first point
  let path = `M${coordinates[0]} ${coordinates[1]}`;

  // Add line segments to remaining points
  for (let i = 2; i < coordinates.length; i += 2) {
    path += ` L${coordinates[i]} ${coordinates[i + 1]}`;
  }

  return path;
}

function polygonToPath({ points }) {
  if (!points)
    return '';

  // Use polylineToPath to create the base path
  const basePath = polylineToPath({ points });

  if (!basePath)
    return '';

  // Close the path by adding 'Z' command
  return `${basePath} Z`;
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
    const components = convertToSinglePath(iconModule.default);

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
  const res = [];

  const [customIcons, lucideIcons] = await Promise.all([
    getAllSvgDataFromPath(resolveCustomIconDir()),
    getLucideSvgDataFromPath(resolveLucideIconDir()),
  ]);
  res.push(...customIcons, ...lucideIcons);

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
    .map(x => `"${x}"`)
    .join(',')}] as const;\n`;

  indexFileContent += `export type RuiIcons = string;\n`;
  indexFileContent += `
export function isRuiIcon(x: any): x is RuiIcons {
  return RuiIcons.includes(x);
}\n`.trim();

  await writeFile(resolveRoot(`${TARGET}index.ts`), indexFileContent, 'utf8');
}

await generate();
