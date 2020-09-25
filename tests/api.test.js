import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { NO_PROVIDED_TERM } from '../utils/constants/errorMessages';

process.env.NODE_ENV = 'test';
const { expect } = chai;

chai.use(chaiHttp);

describe('Words', () => {
    describe('/GET words', () => {
        it('should return back word information', (done) => {
            chai.request(server)
                .get('/api/v1/search/words')
                .query({ keyword: 'agụū' })
                .end((_, res) => {
                    const keys = ['wordClass', 'definition', 'examples', 'phrases'];
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.be.equal(1);
                    expect(res.body[0]).to.have.keys(...keys);
                    done();
                })
        });

        it('should return an error for searching no word', (done) => {
            chai.request(server)
                .get('/api/v1/search/words')
                .query({})
                .end((_, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.text).to.equal(NO_PROVIDED_TERM);
                    done();
                })
        })
    })
})

after(() => server.close())