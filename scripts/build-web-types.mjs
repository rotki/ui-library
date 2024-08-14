import fs from 'node:fs';
import path from 'node:path';
import consola from 'consola';
import fg from 'fast-glob';
import { kebabCase, pascalCase } from 'scule';
import { createChecker } from 'vue-component-meta';

const __dirname = import.meta.dirname;

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), { encoding: 'utf8' }));

/**
 * Replaces the double quotes in a string with single quotes and returns it.
 *
 * @param {string|undefined} text
 * @returns {string|undefined}
 */
function replaceDoubleQuote(text) {
  return text?.replaceAll('"', '\'');
}

/**
 * @typedef {import('vue-component-meta').MetaCheckerOptions} MetaCheckerOptions
 */

/** @type MetaCheckerOptions **/
const checkerOptions = {
  forceUseTs: true,
  noDeclarations: false,
  schema: { ignore: [] },
  printer: { newLine: 1 },
};

const checker = createChecker(
  // Write your tsconfig path
  path.join(__dirname, '..', 'tsconfig.build.json'),
  checkerOptions,
);

/**
 * The list of components
 */
const components = [];

/**
 * The list of tag names to ignore generating web types for.
 */
const excludeComponents = [];

const componentFiles = fg.sync('src/components/**/*.vue', {
  cwd: path.resolve(__dirname, '..'),
  absolute: true,
});

const componentMeta = componentFiles.filter(file => !excludeComponents.some(tag => file.includes(tag)))
  .map(file => ({
    path: file,
    tag: path.parse(file).name,
    meta: checker.getComponentMeta(file),
  }));

/**
 * The filtered set of components to generate web types for.
 */
const filteredComponents = componentMeta.filter(
  c => !excludeComponents.includes(c.tag),
);

const contextColors = [
  'primary',
  'secondary',
  'error',
  'warning',
  'info',
  'success',
];

const colors = contextColors.map(x => `'${x}'`).join(' | ');

for (const component of filteredComponents) {
  consola.debug(`processing component ${component.tag}`);
  const attributes = [];
  const slots = [];
  const events = [];
  const componentName = pascalCase(component.tag);

  const vueModel = {};

  for (const prop of component.meta.props || []) {
    if (prop.global)
      continue;

    let propType = replaceDoubleQuote(prop.type);
    if (propType.includes(colors))
      propType = propType.replace(colors, 'ContextColorsType');

    if (propType.includes('arrow-down-circle-fill'))
      propType = `RuiIcon | ${propType.split('|').at(-1)}`;

    attributes.push({
      name: kebabCase(prop.name),
      description: prop.description,
      required: prop.required,
      default: replaceDoubleQuote(prop.default),
      value: {
        kind: 'expression',
        type: propType,
      },
    });

    if (prop.name === 'modelValue')
      vueModel.prop = prop.name;
  }

  for (const event of component.meta.events || []) {
    const eventName = event.name;
    events.push({
      name: eventName,
      description: event.docs,
      arguments: [
        {
          name: 'argument',
          type: replaceDoubleQuote(event.type),
        },
      ],
    });

    if (eventName === 'update:modelValue')
      vueModel.event = eventName;
  }

  for (const slot of component.meta.slots || []) {
    const properties = [];

    if (slot.schema && slot.schema.schema && typeof slot.schema.schema === 'object') {
      for (const entry of Object.values(slot.schema.schema)) {
        if (entry.global)
          continue;

        if (!entry.name || !entry.type)
          continue;

        properties.push({
          name: entry.name,
          type: replaceDoubleQuote(entry.type),
        });
      }
    }

    slots.push({
      name: slot.name === '' ? 'default' : slot.name,
      description: slot.docs,
      ...(properties.length > 0 ? { 'vue-properties': properties } : {}),
    });
  }

  components.push({
    name: componentName,
    description: component.docs,
    source: {
      module: `@rotki/ui-library${component.path.split('src')[1]}`,
      symbol: componentName,
    },
    attributes,
    slots,
    js: {
      events,
    },
    ...(Object.keys(vueModel).length === 2 ? { 'vue-model': vueModel } : {}),
  });
}

const webTypes = {
  '$schema': 'http://json.schemastore.org/web-types',
  'framework': 'vue',
  'name': '@rotki/ui-library',
  'version': pkg.version,
  'js-types-syntax': 'typescript',
  'description-markup': 'markdown',
  'contributions': {
    html: {
      elements: components,
    },
  },
};

fs.writeFileSync('dist/web-types.json', JSON.stringify(webTypes, null, 2));
