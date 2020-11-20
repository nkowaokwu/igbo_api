import chai from 'chai';
import { getAPIUrlRoute, getLocalUrlRoute } from './shared/commands';
import { SITE_TITLE } from './shared/constants';

const { expect } = chai;

describe('API Homepage', () => {
  it('should render the built site', (done) => {
    getLocalUrlRoute()
      .end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.type).to.equal('text/html');
        expect(res.charset).to.equal('UTF-8');
        expect(res.body).to.be.an('object');
        expect(res.text).to.not.contain('An unexpected error has occurred.');
        expect(res.text).to.contain('Igbo API');
        expect(res.text).to.contain(SITE_TITLE);
        done();
      });
  });
});

describe('API Requests For Home Directory \'/\'', () => {
  it('should return response status of 404 in /undefinedRoute', (done) => {
    const route = '/undefinedRoute';
    getAPIUrlRoute(route)
      .end((_, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('should contain Igbo API in / route', (done) => {
    getAPIUrlRoute()
      .end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.type).to.equal('text/html');
        expect(res.charset).to.equal('UTF-8');
        expect(res.body).to.be.an('object');
        expect(res.text).to.contain(SITE_TITLE);
        done();
      });
  });
});
