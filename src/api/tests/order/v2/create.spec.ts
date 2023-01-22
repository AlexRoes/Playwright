import { expect, test } from '@playwright/test';
import { CreateTestOrder } from '../../../data/Order';

const baseOrder = CreateTestOrder();
let orderId = '';
let trackTrace = '';

test.describe('Create order flow (v2)', () => {
  test('should create a order as customer', async ({ request }) => {
    const newOrder = await request.post(`/api/v2/order`, {
      data: {
        order: baseOrder,
      },
    });
    expect(newOrder.ok()).toBeTruthy();

    const order = await newOrder.json();
    orderId = order.id;
    trackTrace = order.trackTrace;
  });

  test('should verify a order as customer by id', async ({ request }) => {
    const verifyOrder = await request.get(`/api/v2/order/${orderId}`);
    expect(verifyOrder.ok()).toBeTruthy();

    const verifyOrderData = await verifyOrder.json();

    expect(verifyOrderData.order._id).toEqual(orderId);
    expect(verifyOrderData.order.quantity).toEqual(baseOrder.quantity);
    expect(verifyOrderData.order.trackTrace).toEqual(trackTrace);
  });

  test('should verify a order as customer by tracktrace', async ({ request }) => {
    const verifyTracktrace = await request.get(`/api/v2/order/tracktrace/${trackTrace}`);

    expect(verifyTracktrace.ok()).toBeTruthy();

    const verifyTracktraceData = await verifyTracktrace.json();

    expect(verifyTracktraceData.order._id).toEqual(orderId);
    expect(verifyTracktraceData.order.quantity).toEqual(baseOrder.quantity);
    expect(verifyTracktraceData.order.trackTrace).toEqual(trackTrace);
  });

  test('should cancel a order as customer', async ({ request }) => {
    const response = await request.post(`/api/v2/order/cancel/${orderId}`);
    expect(response.ok()).toBeTruthy();
  });
});
