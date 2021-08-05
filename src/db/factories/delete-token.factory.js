const Faker = require('faker');

class DeleteTokenFactory {
  static generateObject({
    token = Faker.internet.password(),
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    return {
      token,
      isActive,
      createdAt, updatedAt
    };
  }

}

module.exports = DeleteTokenFactory;
