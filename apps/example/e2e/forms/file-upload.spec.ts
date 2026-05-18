import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';

test.describe('forms/FileUpload', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/file-uploads');
  });

  test('uploads a single csv file via the picker', async ({ page }) => {
    await expect(page.locator('h2[data-id=file-uploads]')).toContainText('File Upload');

    const section = page.getByTestId('single-csv');
    const input = section.locator('input[type=file]');

    await input.setInputFiles({
      name: 'data.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('a,b\n1,2\n'),
    });

    await expect(section.getByTestId('file-list')).toBeVisible();
    await expect(section.getByTestId('file-list')).toContainText('data.csv');
    await expect(section.getByTestId('single-csv-result')).toContainText('data.csv');
  });

  test('rejects files that do not match the accept filter', async ({ page }) => {
    const section = page.getByTestId('single-csv');
    const input = section.locator('input[type=file]');

    await input.setInputFiles({
      name: 'data.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });

    await expect(section.locator('[data-error]')).toBeVisible();
    await expect(section.getByTestId('file-list')).toHaveCount(0);
  });

  test('accepts multiple files when multiple is set', async ({ page }) => {
    const section = page.getByTestId('multiple');
    const input = section.locator('input[type=file]');

    await input.setInputFiles([
      { name: 'a.txt', mimeType: 'text/plain', buffer: Buffer.from('a') },
      { name: 'b.txt', mimeType: 'text/plain', buffer: Buffer.from('b') },
    ]);

    await expect(section.getByTestId('multiple-result')).toContainText('2 file(s)');
    await expect(section.getByTestId('file-item')).toHaveCount(2);
  });

  test('removes a file via the remove button', async ({ page }) => {
    const section = page.getByTestId('multiple');
    const input = section.locator('input[type=file]');

    await input.setInputFiles([
      { name: 'a.txt', mimeType: 'text/plain', buffer: Buffer.from('a') },
      { name: 'b.txt', mimeType: 'text/plain', buffer: Buffer.from('b') },
    ]);

    await section.getByTestId('remove-file').first().click();
    await expect(section.getByTestId('file-item')).toHaveCount(1);
    await expect(section.getByTestId('multiple-result')).toContainText('1 file(s)');
  });

  test('renders the custom preview slot for images', async ({ page }) => {
    const section = page.getByTestId('image-preview');
    const input = section.locator('input[type=file]');

    const pngBytes = Buffer.from(
      '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000005000100'
      + '0d0a2db40000000049454e44ae426082',
      'hex',
    );

    await input.setInputFiles({
      name: 'pic.png',
      mimeType: 'image/png',
      buffer: pngBytes,
    });

    await expect(section.getByTestId('image-preview-img')).toBeVisible();
    await section.getByTestId('image-preview-remove').click();
    await expect(section.getByTestId('image-preview-img')).toHaveCount(0);
  });

  test('shows external error messages', async ({ page }) => {
    const section = page.getByTestId('external-error');
    await expect(section.locator('[data-error]')).toBeVisible();
    await expect(section).toContainText('Something went wrong upstream');
  });

  test('disables the input in disabled mode', async ({ page }) => {
    const section = page.getByTestId('disabled');
    await expect(section.locator('input[type=file]')).toBeDisabled();
    await expect(section.locator('[data-disabled]')).toBeVisible();
  });
});
