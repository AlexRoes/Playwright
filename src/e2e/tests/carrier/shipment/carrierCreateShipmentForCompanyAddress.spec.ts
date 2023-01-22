import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import environment from '../../../../../environment';

const vervoerderURL = new URL('vervoerder', environment.baseUrl).href;

let accessToken: string;

// Make one login flow before all test and get token. I will speed up test passing
test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto(`${vervoerderURL}/login`);

  // Fill creds
  await page.getByPlaceholder('Email').fill(environment.userEmail);
  await page.getByRole('textbox', { name: 'password' }).fill(environment.userPassword);

  // Click on login button
  await page.getByRole('button', { name: 'Inloggen' }).click();

  // Wait until login process finished
  await page.waitForURL(`${vervoerderURL}/dashboard`);

  // Save customer token in variable for usage in every test in this file
  accessToken = await page.evaluate(() => sessionStorage.accessToken);

  await page.close();
});

test('It is possible to create a shipment for a company address', async ({ page, context }) => {
  const uniqRef = uuidv4();

  // set saved token into session storage
  await context.addInitScript((token) => {
    window.sessionStorage.setItem('accessToken', token);
  }, accessToken);

  // navigate to customer dashboard
  await page.goto(`${vervoerderURL}/zendingen`);

  // open modal for creating shipment
  await page.getByRole('button', { name: 'Nieuwe Zending' }).click();

  // fill order's fields
  await page.locator('#customer').fill('Testcustomer1');
  await page.waitForTimeout(300); // wait until autofill completed
  await page.locator('#name').fill('Carrier-company');
  await page.waitForTimeout(300); // wait until autofill completed
  await page.locator('#postalCode').fill('8011 XP');
  await page.locator('#nr').fill('3 B');
  await page.locator('#street').fill('Botervatstraat');
  await page.locator('#city').fill('Zwolle');
  await page.waitForTimeout(300); // wait until autofill completed
  await page.locator('#reference').fill(uniqRef);
  await page.locator('#companyAddress').check();

  // confirm order creating
  await page.getByRole('button', { name: 'Opslaan' }).click();

  // go to the last page to find last order
  await page.getByRole('button', { name: 'Last' }).click();

  // select order
  const lineWithOrder = await page.getByText(uniqRef).locator('xpath=../..');
  await lineWithOrder.click();

  // best practice to add button with checkbox some name, and use this name in test
  // await page.getByRole('button', { name: '' }).click();
  await page.getByRole('button').locator('.icon-glyphicons-basic-739-check').click();

  // Confirm operation in modal
  await page.getByRole('button', { name: 'Ja' }).click();

  // find last order and click on Eye
  await lineWithOrder.locator('.icon-glyphicons-basic-52-eye').click();

  const modalBody = await page.locator('.modal-body');

  // Check uniqueRef to confirm we are looking at the newly created order
  await expect(modalBody.locator("h6:text('Referentie') + div")).toHaveText(uniqRef);

  // Check if deliveryAddress is what we filled in
  const addressBlock = await modalBody.locator(":text('Afleveradres') + div");

  // Check if deliveryAddress is what we filled in
  await expect(addressBlock.locator(':nth-child(1)').first()).toHaveText('Carrier-company');
  await expect(addressBlock.locator(':nth-child(2)').first()).toHaveText('Botervatstraat 3 B');
  await expect(addressBlock.locator(':nth-child(3)')).toHaveText('8011 XP Zwolle');
  await expect(addressBlock.locator(':nth-child(4)')).toHaveText('NL');
  await expect(addressBlock.locator(':nth-child(1)').nth(2)).toBeChecked();
  // Check if status is "Bevestigd"
  await expect(modalBody.locator(":text('Status') + div")).toHaveText('Opgehaald');

  // Close orderinfo (order is still selected)
  await page.getByRole('button', { name: 'close' }).click();

  // Print label
  await page.locator('.icon-glyphicons-basic-16-print').click();
  await expect(page.getByText('Labels printen')).toHaveCount(1);

  // Close print label modal
  await page.getByRole('button', { name: 'close' }).click();

  // Check if label printed is set
  await expect(lineWithOrder.locator('.icon-glyphicons-basic-739-check')).toHaveCount(1);
});
