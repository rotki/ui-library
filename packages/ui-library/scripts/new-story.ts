import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { cac } from 'cac';
import consola from 'consola';
import { kebabCase, pascalCase } from 'scule';

const logger = consola;

function createStory(directory: string, component: string) {
  if (component === null) {
    logger.error('Usage: pnpm run new [directory] <ComponentName>');
    process.exit(1);
  }

  if (!/^(?:[A-Z][a-z]+)+$/.test(component)) {
    logger.error('Usage: pnpm run new [directory] <ComponentName>');
    process.exit(1);
  }

  const workDir = process.cwd();
  const componentTargetDir = path.join('src', 'components', directory);
  const targetPath = path.resolve(path.join(workDir, componentTargetDir));

  if (fs.existsSync(targetPath)) {
    logger.error(`${directory} already exists`);
    process.exit(1);
  }

  fs.mkdirSync(targetPath, { recursive: true });

  const componentName = component.startsWith('Rui') ? component : `Rui${component}`;

  const testFile = path.resolve(path.join(targetPath, `${componentName}.spec.ts`));
  const storyFile = path.resolve(path.join(targetPath, `${componentName}.stories.ts`));
  const componentFile = path.resolve(path.join(targetPath, `${componentName}.vue`));

  fs.writeFileSync(
    testFile,
    `import { afterEach, describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import ${componentName} from './${componentName}.vue';

function createWrapper(options: ComponentMountingOptions<typeof ${componentName}>): VueWrapper<InstanceType<typeof ${componentName}>> {
  return mount(${componentName}, { ...options });
}

describe('${directory}/${componentName}', () => {
  let wrapper: VueWrapper<InstanceType<typeof ${componentName}>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('renders properly', () => {
    wrapper = createWrapper({});

    expect(wrapper.exists()).toBeTruthy();
  });
});
`,
  );

  fs.writeFileSync(
    storyFile,
    `import type { ComponentPropsAndSlots } from '@storybook/vue3-vite';
import ${componentName} from './${componentName}.vue';
import preview from '~/.storybook/preview';

function render(args: ComponentPropsAndSlots<typeof ${componentName}>) {
  return {
    components: { ${componentName} },
    setup() {
      return { args };
    },
    template: \`<${componentName} v-bind="args" />\`,
  };
}

const meta = preview.meta({
  argTypes: {},
  component: ${componentName},
  render,
  tags: ['autodocs'],
  title: 'Components/${directory.split(path.sep).map(x => pascalCase(x)).join('/')}/${componentName}',
});

export const Default = meta.story({
  args: {},
});

export default meta;
`,
  );

  fs.writeFileSync(
    componentFile,
    `<script setup lang="ts">
export interface ${componentName}Props { }

defineOptions({
  name: '${componentName}',
});

withDefaults(defineProps<${componentName}Props>(), {
});
</script>

<template>
  <div />
</template>
`,
  );

  execSync(`pnpm exec eslint ${componentTargetDir} --fix`, { encoding: 'utf-8' });

  const editor = process.env.LAUNCH_EDITOR;
  if (editor) {
    execSync(`${editor} "${testFile}"`, { encoding: 'utf-8' });
    execSync(`${editor} "${storyFile}"`, { encoding: 'utf-8' });
    execSync(`${editor} "${componentFile}"`, { encoding: 'utf-8' });
  }
}

const cli = cac('new-story');

cli.command('<component>', 'Create a new component story')
  .option('-d, --directory <directory>', 'Directory to create the story in')
  .action((component: string, options: { directory?: string }) => {
    const componentDirectory = options?.directory || kebabCase(component)
      .replace(/rui-?/, '');

    createStory(componentDirectory, component);
  });

cli.help();
cli.parse();
