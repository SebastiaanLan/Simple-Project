'use strict';

import bcrypt from 'bcrypt';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const password = '12345678';
  const now = new Date();

  const hash = await bcrypt.hash(password, 10);

  await queryInterface.bulkInsert('users', [
    {
      name: 'Sebastiaan',
      email: 'sebas@email.com',
      phone: '+31675120974',
      password: hash,
      role: 'admin',
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Rick',
      email: 'rick@email.com',
      phone: '+3167483951',
      password: hash,
      role: 'user',
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Lucas',
      email: 'lucas@email.com',
      phone: '+31609784924',
      password: hash,
      role: 'user',
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'John',
      email: 'john@email.com',
      phone: '+316345194374',
      password: hash,
      role: 'user',
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Robert',
      email: 'robert@email.com',
      phone: '+31690097334',
      password: hash,
      role: 'admin',
      createdAt: now,
      updatedAt: now
    }
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('users', {
    email: [
      'sebas@email.com',
      'rick@email.com',
      'lucas@email.com',
      'john@email.com',
      'robert@email.com',
    ]
  })
}