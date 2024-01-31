import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { pascalCase } from 'scule';

const logger = console;

function createStory(directory: string, component: string) {
  if (directory === null || component === null) {
    logger.error('Usage: pnpm run new directory/path <ComponentName>');
    process.exit(1);
  }

  if (!/^(?:[A-Z][a-z]+)+$/.test(component)) {
    logger.error('Usage: pnpm run new directory/path <ComponentName>');
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
`import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import ${componentName} from './${componentName}.vue';

function createWrapper(options: ComponentMountingOptions<typeof ${componentName}>) {
  return mount(${componentName}, { ...options });
}

describe('${directory}/${componentName}', () => {
  it('renders properly', () => {
    const wrapper = createWrapper({});

    expect(wrapper.exists()).toBeTruthy();
  });
});
`,
  );

  fs.writeFileSync(
    storyFile,
    `import ${componentName}, { type ${componentName}Props } from './${componentName}.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';

const render: StoryFn<${componentName}Props> = args => ({
  components: { ${componentName} },
  setup() {
    return { args };
  },
  template: \`<${componentName} v-bind="args" />\`,
});

const meta: Meta<${componentName}Props> = {
  argTypes: {},
  component: ${componentName},
  render,
  tags: ['autodocs'],
  title: '${directory.split(path.sep).map(x => pascalCase(x)).join('/')}/${componentName}',
};

type Story = StoryObj<${componentName}Props>;

export const Default: Story = {
  args: {},
};

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

  execSync(`pnpm exec eslint ${componentTargetDir}`);

  const editor = process.env.LAUNCH_EDITOR;
  if (editor) {
    execSync(`${editor} "${testFile}"`);
    execSync(`${editor} "${storyFile}"`);
    execSync(`${editor} "${componentFile}"`);
  }
}

const directory = process.argv[2];
const component = process.argv[3];

createStory(directory, component);
