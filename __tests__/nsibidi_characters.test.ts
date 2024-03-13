import { getNsibidiCharactersV2 } from './shared/commands';

describe('MongoDB Nsibidi Characters', () => {
  describe('/GET mongodb nsibidi characters V2', () => {
    it('should return nsibidi character by searching', async () => {
      const res = await getNsibidiCharactersV2({ keyword: '123' }, {});
      expect(res.status).toEqual(200);
    });
  });
});
