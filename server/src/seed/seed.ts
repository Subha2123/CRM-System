import { faker } from '@faker-js/faker';
import * as mongoose from 'mongoose';
import { CustomerSchema } from '../customer/customer.schema';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);

  const Customer = mongoose.model('Customer', CustomerSchema);

  await Customer.deleteMany({});

  const statuses = ['Lead', 'Active', 'Inactive'];

  function createRandomUser() {
    return {
      name: faker.internet.username(),
      email: `${faker.internet.username()}@example.com`,
      password: faker.internet.password(),
      status: faker.helpers.arrayElement(statuses),
      company: faker.company.name(),
    };
  }

  const customers = faker.helpers.multiple(createRandomUser, {
    count: 50,
  });

  await Customer.insertMany(customers);

  await mongoose.disconnect();
}

seed()
  .then(() => {
    console.log('Seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
