import { expect, test } from '@playwright/test';
import environment from '../../../../environment';

const klantURL = new URL('klant', environment.baseUrl).href;

test('It is possible for a user with a valid customer account to login', async ({ page }) => {
  await page.goto(`${klantURL}/login`);
  await page.getByPlaceholder('Email').fill(environment.userEmail);
  await page.getByRole('textbox', { name: 'password' }).fill(environment.userPassword);
  await page.getByRole('button', { name: 'Inloggen' }).click();
  await expect(page).toHaveURL(`${klantURL}/dashboard`);
});

test('It is not possible for a user with an invalid customer email to login', async ({ page }) => {
  await page.goto(`${klantURL}/login`);
  await page.getByPlaceholder('Email').fill('notavalid@distributormailadres.nl');
  await page.getByRole('textbox', { name: 'password' }).fill(environment.userPassword);
  await page.getByRole('button', { name: 'Inloggen' }).click();
  await expect(page.getByRole('alert')).toHaveText('Verkeerd e-mailadres of wachtwoord.');
});

test('It is not possible for a user with an invalid customer password to login', async ({ page }) => {
  await page.goto(`${klantURL}/login`);
  await page.getByPlaceholder('Email').fill(environment.userPassword);
  await page.getByRole('textbox', { name: 'password' }).fill('invalidpassword');
  await page.getByRole('button', { name: 'Inloggen' }).click();
  await expect(page.getByRole('alert')).toHaveText('Verkeerd e-mailadres of wachtwoord.');
});

test('A token expired message is shown when the session token is expired', async ({ page }) => {
  await page.goto(`${klantURL}/login?reason=TOKEN_EXPIRED`);
  await expect(page.getByRole('alert')).toHaveText('U bent doorgestuurd naar de inlogpagina, reden: TOKEN_EXPIRED');
});

test('It is possible for a user to use the forgot password process', async ({ page }) => {
  await page.goto(`${klantURL}/login`);
  await page.getByRole('button', { name: 'Wachtwoord vergeten?' }).click();
  await expect(page).toHaveURL(`https://dev.fietskoeriers.nl/wachtwoordvergeten/klant`);
  await page.getByPlaceholder('Emailadres').fill('info@othala.nl');
  await page.getByRole('button', { name: 'Verstuur mail' }).click();
  await page.waitForTimeout(300); // wait for text to appear
  await expect(page.getByRole('alert').nth(1)).toHaveText('Mits het opgegeven e-mailadres bestaat ontvangt u een e-mail met instructies om uw wachtwoord te resetten.');
});