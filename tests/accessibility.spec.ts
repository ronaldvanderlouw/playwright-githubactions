import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const knownPlaywrightDevViolationNodeLimits = new Map([
  ['heading-order', 4],
  ['label-content-name-mismatch', 1],
]);

test.describe('homepage', () => {
  test('should not exceed known accessibility findings', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    const unexpectedViolations = accessibilityScanResults.violations.filter(
      ({ id, nodes }) => nodes.length > (knownPlaywrightDevViolationNodeLimits.get(id) ?? 0),
    );

    expect(unexpectedViolations).toEqual([]);
  });
});

test('example with attachment', async ({ page }, testInfo) => {
  await page.goto('https://playwright.dev/');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  await testInfo.attach('accessibility-scan-results', {
    body: JSON.stringify(accessibilityScanResults, null, 2),
    contentType: 'application/json',
  });

  const unexpectedViolations = accessibilityScanResults.violations.filter(
    ({ id, nodes }) => nodes.length > (knownPlaywrightDevViolationNodeLimits.get(id) ?? 0),
  );

  expect(unexpectedViolations).toEqual([]);
});

test('should not have any automatically detectable WCAG A or AA violations', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
  const unexpectedViolations = accessibilityScanResults.violations.filter(
    ({ id, nodes }) => nodes.length > (knownPlaywrightDevViolationNodeLimits.get(id) ?? 0),
  );

  expect(unexpectedViolations).toEqual([]);
});