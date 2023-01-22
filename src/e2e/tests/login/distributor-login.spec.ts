import { expect, test } from '@playwright/test';
import environment from '../../../../environment';

const distributiemonitorURL = new URL('distributiemonitor', environment.baseUrl).href;

test('It is possible for a user with a valid distributor account to login', async ({ page }) => {
  await page.goto(`${distributiemonitorURL}/login`);
  await page.getByPlaceholder('Email').fill(environment.userEmail);
  await page.getByRole('textbox', { name: 'password' }).fill(environment.userPassword);
  await page.getByRole('button', { name: 'Inloggen' }).click();
  await expect(page.getByPlaceholder('Code')).toBeVisible();
  await page.getByRole('button', { name: 'Inloggen' }).click();
  await expect(page).toHaveURL(`${distributiemonitorURL}/dashboard`);
});

test('It is not possible for a user with an invalid distributor email to login', async ({ page }) => {
  await page.goto(`${distributiemonitorURL}/login`);
  await page.getByPlaceholder('Email').fill('notavalid@distributormailadres.nl');
  await page.getByRole('textbox', { name: 'password' }).fill(environment.userPassword);
  await page.getByRole('button', { name: 'Inloggen' }).click();
  await expect(page.getByRole('alert')).toHaveText('Verkeerd e-mailadres of wachtwoord.');
});

test('It is not possible for a user with an invalid distributor password to login', async ({ page }) => {
  await page.goto(`${distributiemonitorURL}/login`);
  await page.getByPlaceholder('Email').fill(environment.userPassword);
  await page.getByRole('textbox', { name: 'password' }).fill('invalidpassword');
  await page.getByRole('button', { name: 'Inloggen' }).click();
  await expect(page.getByRole('alert')).toHaveText('Verkeerd e-mailadres of wachtwoord.');
});

test('A token expired message is shown when the session token is expired', async ({ page }) => {
  await page.goto(`${distributiemonitorURL}/login?reason=TOKEN_EXPIRED`);
  await expect(page.getByRole('alert')).toHaveText('U bent doorgestuurd naar de inlogpagina, reden: TOKEN_EXPIRED');
});

test('It is possible for a user to use the forgot password process', async ({ page }) => {
  await page.goto(`${distributiemonitorURL}/login`);
  await page.getByRole('button', { name: 'Wachtwoord vergeten?' }).click();
  await expect(page).toHaveURL(`https://dev.fietskoeriers.nl/wachtwoordvergeten/distributiemonitor`);
  await page.getByPlaceholder('Emailadres').fill('mail@test.nl');
  await page.getByRole('button', { name: 'Verstuur mail' }).click();
  await expect(page.getByRole('alert')).toHaveText('Mits het opgegeven e-mailadres bestaat ontvangt u een e-mail met instructies om uw wachtwoord te resetten.');
});