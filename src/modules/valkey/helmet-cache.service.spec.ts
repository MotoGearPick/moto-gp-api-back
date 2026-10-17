import { HelmetCacheService } from './helmet-cache.service';

describe('HelmetCacheService.getHelmetDetail', () => {
  const makeService = (model: unknown) => {
    const client = { get: jest.fn().mockResolvedValue(null), set: jest.fn() };
    const db = { helmet_model: { findFirst: jest.fn().mockResolvedValue(model) } };
    return { service: new HelmetCacheService(client as any, db as any), client, db };
  };

  it('on a cache miss loads the helmet from the DB and puts it back in Valkey', async () => {
    const { service, client } = makeService({ id: 'm1', slug: 'rf-1400', name: 'RF-1400', brand: { slug: 'shoei' } });

    const detail = await service.getHelmetDetail('shoei', 'rf-1400');

    expect(detail).toMatchObject({ id: 'm1', slug: 'rf-1400' });
    expect(client.set).toHaveBeenCalledWith('helmet:shoei:rf-1400', JSON.stringify(detail), 'EX', expect.any(Number));
  });

  it('returns null for an unknown slug without caching anything', async () => {
    const { service, client } = makeService(null);

    expect(await service.getHelmetDetail('shoei', 'nope')).toBeNull();
    expect(client.set).not.toHaveBeenCalled();
  });

  it('serves a cache hit without touching the DB', async () => {
    const { service, client, db } = makeService(null);
    client.get.mockResolvedValue(JSON.stringify({ id: 'm1' }));

    expect(await service.getHelmetDetail('shoei', 'rf-1400')).toEqual({ id: 'm1' });
    expect(db.helmet_model.findFirst).not.toHaveBeenCalled();
  });
});
