import { type ComponentMountingOptions, renderToString } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiLogo from '@/components/logos/RuiLogo.vue';

function createWrapper(options?: Omit<ComponentMountingOptions<typeof RuiLogo>, 'attachTo'>) {
  return renderToString(RuiLogo, { ...options });
}

describe('forms/Logo.ssr', () => {
  it('renders properly', async () => {
    const content = await createWrapper();
    expect(content.includes('img')).toBeTruthy();
    expect(content.includes('logo.svg')).toBeTruthy();
    expect(content.includes('alt="rotki"')).toBeTruthy();
    expect(content.includes('data-image="fallback"')).toBeTruthy();
    expect(content.includes('>rotki<')).toBeFalsy();
  });

  it('renders properly with text prop defined', async () => {
    const content = await createWrapper({
      props: {
        text: true,
      },
    });
    expect(content.includes('img')).toBeTruthy();
    expect(content.includes('>rotki<')).toBeTruthy();
  });

  it('renders properly with logo prop defined', async () => {
    const content = await createWrapper({
      props: {
        logo: 'website',
      },
    });
    expect(content.includes('img')).toBeTruthy();
    expect(content.includes('data-image="custom"')).toBeTruthy();
    expect(content.includes('>rotki<')).toBeFalsy();
  });
});
