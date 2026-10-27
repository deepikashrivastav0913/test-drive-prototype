const { test, expect } = require('@playwright/test');

async function fillValidForm(page) {
  await page.selectOption('#model', { label: 'Pulse E' });
  await page.fill('#firstName', 'Aanya');
  await page.fill('#lastName', 'Sharma');
  await page.fill('#email', 'aanya@example.com');
  await page.fill('#phone', '9876543210');
  await page.fill('#city', 'Mumbai');
  await page.selectOption('#dealer', 'central');
  await page.fill('#date', '2027-01-20');
  await page.selectOption('#time', { label: '10:30 AM' });
  await page.check('#consent');
}

test.beforeEach(async ({ page }) => page.goto('/'));

test('renders the booking form and required fields', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Book your test drive' })).toBeVisible();
  await expect(page.locator('#model')).toBeVisible();
  await expect(page.locator('#consent')).toBeVisible();
});

test('blocks empty submission with useful errors', async ({ page }) => {
  await page.getByRole('button', { name: /Request my test drive/ }).click();
  await expect(page.locator('#formStatus')).toContainText('highlighted fields');
  await expect(page.locator('#modelError')).toContainText('required');
  await expect(page.locator('#emailError')).toContainText('required');
});

test('rejects malformed email and phone', async ({ page }) => {
  await fillValidForm(page);
  await page.fill('#email', 'not-an-email');
  await page.fill('#phone', '123');
  await page.getByRole('button', { name: /Request my test drive/ }).click();
  await expect(page.locator('#emailError')).toContainText('valid email');
  await expect(page.locator('#phoneError')).toContainText('10-digit');
});

test('submits valid synthetic data to mock confirmation', async ({ page }) => {
  await fillValidForm(page);
  await page.getByRole('button', { name: /Request my test drive/ }).click();
  await expect(page.locator('#formStatus')).toContainText('simulated confirmation', { timeout: 5000 });
  await expect(page.locator('#formStatus')).toContainText('DF-');
});

test('adapts phone and consent for another market', async ({ page }) => {
  await page.getByRole('button', { name: /Market: India/ }).click();
  await expect(page.locator('#marketName')).toHaveText('UK');
  await expect(page.locator('#dialCode')).toHaveText('+44');
  await expect(page.locator('#phoneHint')).toContainText('10 digits');
  await expect(page.locator('#consentText')).toContainText('UK market');
});

test('keeps form usable on a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('#testDriveForm')).toBeVisible();
  await expect(page.getByRole('button', { name: /Request my test drive/ })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});
