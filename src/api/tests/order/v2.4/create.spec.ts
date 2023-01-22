// import { faker } from '@faker-js/faker/locale/nl';
// import { expect, test } from '@playwright/test';
// import { CreateTestOrder, requestLabelSortInfo } from '../../../data/Order';

// const baseOrder = CreateTestOrder();
// let orderId = '';
// let trackTrace = '';

// test.describe('Create order flow (v2.4)', () => {
//   test.describe('Create', () => {
//     //buitenland
//     //buitengebied
//     test('should create a order as customer fietskoerier', async ({ request }) => {
//       const response = await request.post(`/api/v2.4/order`, {
//         data: {
//           order: baseOrder,
//         },
//       });
//       expect(response.ok()).toBeTruthy();

//       const data = await response.json();
//       orderId = data.id;
//       trackTrace = data.trackTrace;
//     });
//   });

//   test.describe('Verify', () => {
//     test('should verify a order as customer by id', async ({ request }) => {
//       const response = await request.get(`/api/v2.4/order/${orderId}`);
//       expect(response.ok()).toBeTruthy();

//       const data = await response.json();

//       const date = new Date();
//       //const today = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

//       expect(data.order._id).toEqual(orderId);
//       expect(data.order.deliveryType).toEqual(baseOrder.deliveryType);
//       expect(data.order.product).toEqual(baseOrder.product);
//       expect(data.order.quantity).toEqual(baseOrder.quantity);
//       //expect(data.order.date).toEqual(today);
//       expect(data.order.date).toBeDefined();
//       expect(data.order.date).toContain(`${date.getFullYear()}`);
//       expect(data.order.type).toEqual(1); //Bezorgopdracht
//       expect(data.order.trackTrace).toEqual(trackTrace);
//       expect(data.order.status).toEqual(1300);
//       //expect(data.order.pickupDate).toEqual(today);
//       expect(data.order.pickupDate).toContain(`${date.getFullYear()}`);
//       expect(data.order.deliveryDate).toContain(`${date.getFullYear()}`);
//       expect(data.order.address.name).toEqual(baseOrder.address.name);
//       expect(data.order.address.street).toEqual(baseOrder.address.street);
//       expect(data.order.address.nr).toEqual(baseOrder.address.nr);
//       expect(data.order.address.postalCode).toEqual(baseOrder.address.postalCode);
//       expect(data.order.address.city).toEqual(baseOrder.address.city);
//       expect(data.order.address.country).toEqual(baseOrder.address.country);
//       expect(data.order.address.phone).toEqual(baseOrder.address.phone);
//       expect(data.order.address.email).toEqual(baseOrder.address.email);
//       expect(data.order.eta).toContain(`${date.getFullYear()}`);
//     });

//     test('should verify a order as customer by tracktrace', async ({ request }) => {
//       const response = await request.get(`/api/v2.4/order/tracktrace/${trackTrace}`);
//       expect(response.ok()).toBeTruthy();

//       const data = await response.json();

//       expect(data.order._id).toEqual(orderId);
//       expect(data.order.quantity).toEqual(baseOrder.quantity);
//       expect(data.order.trackTrace).toEqual(trackTrace);
//     });
//   });

//   test.describe('Label', () => {
//     test('should retrieve a requestLabelSortInfo as customer', async ({ request }) => {
//       const response = await request.post(`/api/v2.4/label/requestLabelSortInfo`, {
//         data: requestLabelSortInfo,
//       });
//       expect(response.ok()).toBeTruthy();
//       const requestLabelSortInfoData = await response.json();
//       expect(requestLabelSortInfoData.sortSymbols).toBeDefined();
//       expect(requestLabelSortInfoData.sortSymbols.length).toEqual(3);
//       expect(requestLabelSortInfoData.sortSymbols[0]).toEqual('#');
//       expect(requestLabelSortInfoData.sortSymbols[1]).toEqual('Z');
//       expect(requestLabelSortInfoData.sortSymbols[2]).toEqual(9);
//     });
//     test('should retrieve a pdf label as customer', async ({ request }) => {
//       test.setTimeout(120000);
//       const response = await request.post(`/api/v2.4/label/requestLabel`, {
//         data: {
//           orderId: `${orderId}`,
//           labeltype: 'pdf',
//         },
//       });
//       expect(response.ok()).toBeTruthy();
//       const labelData = await response.json();
//       expect(labelData.label).toBeDefined();
//     });

//     test('should retrieve a zpl label as customer', async ({ request }) => {
//       test.setTimeout(120000);
//       const response = await request.post(`/api/v2.4/label/requestLabel`, {
//         data: {
//           orderId: `${orderId}`,
//           labeltype: 'zpl',
//         },
//         timeout: 60000,
//       });
//       expect(response.ok()).toBeTruthy();
//       const labelData = await response.json();
//       expect(labelData.label).toBeDefined();
//       expect(labelData.label).toContain('^XA');
//       expect(labelData.label).toContain('^XZ');
//     });
//   });

//   test.describe('Track & Trace', () => {
//     test('Activate extra notifications', async ({ request }) => {
//       const response = await request.post(`/api/tracktrace/notifications`, { data: { id: orderId } });
//       expect(response.ok()).toBeTruthy();

//       const data = await response.json();

//       expect(data.message).toBeDefined;
//     });

//     test('Add delivery instructions', async ({ request }) => {
//       const comment = faker.random.words(5);
//       const response = await request.post(`/api/v2.4/tracktrace/comment`, { data: { id: orderId, comment: comment } });
//       expect(response.ok()).toBeTruthy();

//       const data = await response.json();

//       expect(data.comment).toEqual(comment);
//     });

//     test('Change delivery date', async ({ request }) => {
//       const date = faker.date.future(1);
//       const deliveryDate = `${date.getFullYear()}-${date.getMonth()}-${date.getUTCDate()}`;
//       const response = await request.post(`/api/v2.4/tracktrace/deliverydate`, {
//         data: {
//           id: orderId,
//           street: baseOrder.address.street,
//           nr: 1,
//           postalCode: baseOrder.address.postalCode,
//           city: baseOrder.address.city,
//           deliveryDate: deliveryDate,
//           deliveryTimeSlot: '18:00-22:00',
//         },
//       });
//       expect(response.ok()).toBeFalsy();

//       const data = await response.json();

//       expect(data.message).toBeDefined;
//     });
//   });

//   test.describe('Retour', () => {
//     test('should create an retour order as customer', async ({ request }) => {
//       test.setTimeout(120000);
//       const date = faker.date.future(1);
//       const pickupDate = `${date.getFullYear()}-${date.getMonth()}-${date.getUTCDate()}`;
//       const retourOrder = {
//         _id: orderId,
//         pickupDate: pickupDate,
//         pickupAddress: {
//           name: baseOrder.address.name,
//           street: 'Floresstraat',
//           nr: '1',
//           postalCode: '8022 AD',
//           city: 'Zwolle',
//           country: baseOrder.address.country,
//           email: baseOrder.address.email,
//         },
//       };
//       const response = await request.post(`/api/v2.4/order/retour`, {
//         data: retourOrder,
//       });
//       expect(response.ok()).toBeTruthy();
//       const data = await response.json();
//       expect(data.id).toBeDefined();
//       expect(data.label).toBeDefined();
//     });
//   });

//   test.describe('Cancel', () => {
//     test('should cancel a order as customer', async ({ request }) => {
//       // Cancel order
//       const response = await request.post(`/api/v2.4/order/cancel/${orderId}`);
//       expect(response.ok()).toBeTruthy();
//     });
//   });
// });
