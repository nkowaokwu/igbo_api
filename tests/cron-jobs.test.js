import chai from 'chai';
import chaiHttp from 'chai-http';
import { sendEmailJob } from './shared/commands';

const { expect } = chai;

chai.use(chaiHttp);

describe('Automated Cron Jobs', () => {
  it('sends an email to all editors, mergers, and admins for merged stats', (done) => {
    sendEmailJob()
      .end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.message).to.not.equal(undefined);
        done();
      });
  });
});
