import { faker } from '@faker-js/faker/locale/nl';

export const baseInfo = {
  nr: 7,
  addition: '',
  postalCode: '8011 LE',
};

export const requestLabelSortInfo = {
  postalCodeNumbers: `8011`,
  postalCodeLetters: 'LE',
  product: 1,
};

export function CreateTestOrder() {
  return {
    deliveryType: 2,
    product: 1,
    uniqRef: faker.datatype.uuid(),
    serviceFramework: 48,
    address: {
      name: faker.name.fullName(),
      street: 'Jufferenwal',
      nr: `${faker.datatype.number({ min: 1, max: 10 })}`,
      addition: 'D',
      postalCode: '8011 LE',
      city: 'Zwolle',
      country: 'NL',
      phone: faker.phone.number(),
      email: faker.internet.email(),
    },
    quantity: 1, //faker.datatype.number({ min: 1, max: 3 }),
  };
}
