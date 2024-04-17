import { getLocalUrlRoute } from './shared/commands';
import { SITE_TITLE, DOCS_SITE_TITLE } from './shared/constants';

describe.skip('API Homepage', () => {
  it('render the built site', async () => {
    const res = await getLocalUrlRoute();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('text/html');
    expect(res.charset.toLowerCase()).toEqual('utf-8');
    expect(res.text).not.toContain('An unexpected error has occurred.');
    expect(res.text).toContain('Igbo API');
    expect(res.text).toContain(SITE_TITLE);
  });

  it('render the docs site', async () => {
    const res = await getLocalUrlRoute('/docs');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('text/html');
    expect(res.charset.toLowerCase()).toEqual('utf-8');
    expect(res.text).not.toContain('An unexpected error has occurred.');
    expect(res.text).toContain(DOCS_SITE_TITLE);
  });
});
