import { isEqual } from 'lodash';
import { NO_PROVIDED_TERM } from '../src/shared/constants/errorMessages';
import { searchTerm } from './shared/commands';

describe('JSON Dictionary', () => {
  describe('/GET words', () => {
    it.skip('should return back word information', async () => {
      const keyword = 'agụū';
      const res = await searchTerm(keyword);
      expect(res.status).toEqual(200);
      Object.keys(res.body).forEach((key) => {
        expect(['(agụū) -gụ', '-gụ agụū', 'agụū mmīli', keyword]).toContain(key);
      });
      expect(res.body[keyword][0].wordClass).toEqual('NNC');
    });

    it('should return an error for searching no word', async () => {
      const res = await searchTerm();
      expect(res.status).toEqual(400);
      expect(res.body.error).toEqual(NO_PROVIDED_TERM);
    });

    it('should return the same term information', async () => {
      const { status, body: normalizeData } = await searchTerm('ndi ndi');
      expect(status).toEqual(200);
      const { status: rawStatus, body: rawData } = await searchTerm('ndị ndi');
      expect(rawStatus).toEqual(200);
      expect(isEqual(normalizeData, rawData)).toEqual(true);
    });

    it('should return term using variation', async () => {
      const res = await searchTerm('-mu-mù');
      expect(res.status).toEqual(200);
      expect(res.body['-mụ-mù']).toHaveLength(1);
    });
  });
});
