import { type ComponentMountingOptions, renderToString } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiLogo from '@/components/logos/RuiLogo.vue';

function createWrapper(options?: Omit<ComponentMountingOptions<typeof RuiLogo>, 'attachTo'>): Promise<string> {
  return renderToString(RuiLogo, { ...options });
}

describe('components/logos/RuiLogo.vue', () => {
  it('should render properly', async () => {
    const content = await createWrapper();
    expect(content.includes('img')).toBeTruthy();
    expect(content.includes('logo.svg')).toBeTruthy();
    expect(content.includes('alt="rotki"')).toBeTruthy();
    expect(content.includes('data-image="fallback"')).toBeTruthy();
    expect(content.includes('>rotki<')).toBeFalsy();
  });

  it('should render properly with text prop defined', async () => {
    const content = await createWrapper({
      props: {
        text: true,
      },
    });
    expect(content.includes('img')).toBeTruthy();
    expect(content.includes('>rotki<')).toBeTruthy();
  });

  it('should render only the fallback when logo prop defined', async () => {
    const content = await createWrapper({
      props: {
        logo: 'website',
      },
    });
    // The seasonal logo resolves on the client after mount, so the server HTML matches its first render
    expect(content.includes('data-image="fallback"')).toBeTruthy();
    expect(content.includes('data-image="custom"')).toBeFalsy();
    expect(content.includes('>rotki<')).toBeFalsy();
  });

  it('should render fallback hidden and custom image when src prop defined', async () => {
    const content = await createWrapper({
      props: {
        src: '/staging/logo.svg',
      },
    });
    expect(content.includes('img')).toBeTruthy();
    expect(content.includes('data-image="custom"')).toBeTruthy();
    // Fallback is always in DOM but hidden (opacity-0) when custom is shown
    expect(content.includes('data-image="fallback"')).toBeTruthy();
    expect(content.includes('opacity-0')).toBeTruthy();
  });
});
