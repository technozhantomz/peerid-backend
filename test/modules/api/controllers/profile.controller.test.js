process.env.NODE_ENV = 'test';
const {assert} = require('chai');
const request = require('supertest');
const chai = require('chai');
chai.use(require('chai-url'));
const chaiHttp = require('chai-http');

const {isSuccess, isError} = require('../helpers/test.response.helper');
const {login} = require('../helpers/test.login.helper');
const ApiModule = require('../api.module.test');
const constants = require('../../../constants.json');

chai.use(chaiHttp);
let agent;
let apiModule;

before(async () => {
  apiModule = await ApiModule();
  agent = request.agent(apiModule.app);
  // await TestDbHelper.truncateAll(apiModule);
});

describe('POST /api/v1/profile/peerplays/create-account', () => {

  beforeEach(async () => {
    await login(agent, null, apiModule);
  });

  it('should forbid, user not logged', async () => {
    await agent.post('/api/v1/auth/logout');
    const response = await agent.post('/api/v1/profile/peerplays/create-account').send({});
    isError(response, 401);
  });

  it('should forbid, invalid request', async () => {
    const response = await agent.post('/api/v1/profile/peerplays/create-account').send({});
    isError(response, 400);
  });

  it('should forbid, invalid key', async () => {
    const response = await agent.post('/api/v1/profile/peerplays/create-account').send({
      name: constants.modules.api.profile.validPeerplaysName,
      activeKey: constants.modules.api.profile.validPeerplaysKey,
      ownerKey: 'test'
    });
    isError(response, 400);
  });

  it('should forbid invalid accouname', async () => {
    const response = await agent.post('/api/v1/profile/peerplays/create-account').send({
      name: 'test',
      activeKey: constants.modules.api.profile.validPeerplaysKey,
      ownerKey: constants.modules.api.profile.validPeerplaysKey
    });
    isError(response, 400);
  });

  it('should success with valid data', async () => {
    const profileResponse = await agent.get('/api/v1/profile');
    const profile = profileResponse.body.result;
    const response = await agent.post('/api/v1/profile/peerplays/create-account').send({
      name: constants.modules.api.profile.validPeerplaysName,
      activeKey: constants.modules.api.profile.validPeerplaysKey,
      ownerKey: constants.modules.api.profile.validPeerplaysKey
    });
    isSuccess(response);
    profile.peerplaysAccountName = constants.modules.api.profile.validPeerplaysName;
    assert.deepEqual(response.body.result, profile);
  });

});

after(async () => {
  await apiModule.close();
});

