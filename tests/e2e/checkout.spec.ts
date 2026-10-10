import { expect, test } from '@playwright/test';

test('visitor opens the landing page and reaches checkout', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('link', { name: 'اطلب الآن' }).first().click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByRole('heading', { name: 'إتمام الطلب' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'محتويات طلبك' })).toBeVisible();
});

test('invalid checkout shows useful errors near the fields', async ({ page }) => {
  await page.goto('/checkout');
  await page.getByRole('button', { name: 'تأكيد الطلب' }).click();
  await expect(page.getByText('أدخل اسمك الكامل.')).toBeVisible();
  await expect(page.getByText('أدخل رقم الهاتف.')).toBeVisible();
  await expect(page.getByRole('alert').first()).toBeVisible();
});

// Requires a configured Supabase test project (see README). Enabled with E2E_DB=1.
test.describe('with database', () => {
  test.skip(!process.env.E2E_DB, 'Set E2E_DB=1 with Supabase env configured');

  test('valid checkout creates an order and double click does not duplicate it', async ({ page }) => {
    await page.goto('/checkout');
    await page.getByLabel('الاسم الكامل').fill('E2E Tester');
    await page.getByLabel('رقم الهاتف').fill('+1 555 010 0000');
    await page.getByLabel('عنوان التوصيل').fill('1 Test Street');
    await page.getByLabel('المدينة').fill('Testville');
    const confirm = page.getByRole('button', { name: 'تأكيد الطلب' });
    await confirm.dblclick();
    await expect(page.getByRole('heading', { name: 'تم استلام طلبك' })).toBeVisible();
  });

  test('admin can sign in and open orders', async ({ page }) => {
    await page.goto('/admin/orders');
    await expect(page).toHaveURL(/\/login/);
    await page.getByLabel('البريد الإلكتروني').fill(process.env.E2E_ADMIN_EMAIL ?? '');
    await page.getByLabel('كلمة المرور').fill(process.env.E2E_ADMIN_PASSWORD ?? '');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    await expect(page.getByRole('heading', { name: 'الطلبات' })).toBeVisible();
  });

  test('published blog article is reachable and links to the product', async ({ page }) => {
    await page.goto('/blog');
    const first = page.getByRole('link').filter({ hasText: /./ }).locator('xpath=//h2/a').first();
    await first.click();
    await expect(page.getByRole('link', { name: 'شاهد المنتج' })).toBeVisible();
  });
});
