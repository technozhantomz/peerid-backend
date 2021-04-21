const Sequelize = require('sequelize');
const {model} = require('../db/models/session.model');
const BasePostgresRepository = require('./abstracts/base-postgres.repository');

class SessionRepository extends BasePostgresRepository {

  constructor() {
    super(model);
  }

  async limitSessions(userId) {
    const likeString = `%"passport":{"user":${userId}}%`;
    const userSessions = await this.model.findAll({
      where: {data: {[Sequelize.Op.like]: likeString}}
    }, {
      order: [
        ['expires','DESC']
      ]
    });

    if(userSessions && userSessions.length >= 10) {
      await this.destroy({
        where: {
          sid: userSessions[userSessions.length - 1].sid
        },
        force: true
      });
    }
  }
}

module.exports = SessionRepository;
