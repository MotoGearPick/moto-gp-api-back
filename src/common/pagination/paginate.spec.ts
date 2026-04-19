import { paginate } from './paginate';

function mockModel(items: unknown[]) {
  return {
    findMany: jest.fn(async ({ skip, take }: { skip: number; take: number }) =>
      items.slice(skip, skip + take),
    ),
    count: jest.fn(async () => items.length),
  };
}

describe('paginate', () => {
  it('returns data with meta', async () => {
    const items = Array.from({ length: 25 }, (_, i) => ({ id: i }));
    const model = mockModel(items);

    const result = await paginate({ model, pagination: { page: 2, limit: 10 } });

    expect(result.data).toHaveLength(10);
    expect(result.meta).toEqual({ total: 25, page: 2, limit: 10, totalPages: 3 });
    expect(model.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 10 }),
    );
  });

  it('caps limit to 100 to prevent OOM from malicious clients', async () => {
    const items = Array.from({ length: 200 }, (_, i) => ({ id: i }));
    const model = mockModel(items);

    const result = await paginate({ model, pagination: { page: 1, limit: 9999 } });

    expect(result.meta.limit).toBe(100);
    expect(model.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100 }),
    );
  });

  it('defaults page and limit', async () => {
    const model = mockModel([]);
    const result = await paginate({ model, pagination: {} });
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(20);
  });

  it('clamps page to minimum 1', async () => {
    const model = mockModel([]);
    const result = await paginate({ model, pagination: { page: -5, limit: 10 } });
    expect(result.meta.page).toBe(1);
    expect(model.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0 }),
    );
  });
});
