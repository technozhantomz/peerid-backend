const Faker = require('faker');
const Bcrypt = require('bcrypt');

class UserFactory {
  static async generateObject({
    username = Faker.internet.userName(),
    email = Faker.internet.email(),
    googleName = Faker.internet.userName(),
    facebook = Faker.internet.url(),
    peerplaysAccountName = Faker.internet.userName(),
    createdAt = new Date(),
    updatedAt = new Date(),
    password = 'pass1234',
    isEmailVerified = true
  }) {
    return {
      username,
      email,
      googleName,
      facebook,
      peerplaysAccountName,
      createdAt, updatedAt,
      isEmailVerified,
      password: Bcrypt.hashSync(password, 10)
    };
  }

}

module.exports = UserFactory;
