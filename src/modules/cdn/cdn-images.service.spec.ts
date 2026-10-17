import * as sharp from 'sharp';
import { CdnImagesService } from './cdn-images.service';

describe('CdnImagesService.processVariantImages', () => {
  const run = async (urls: string[]) => {
    const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: 'red' } }).png().toBuffer();
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response(new Uint8Array(png)));
    const s3 = { exists: jest.fn(async () => true), putBuffer: jest.fn() };
    return new CdnImagesService(s3 as any).processVariantImages(urls, 'shoei', 'rf-1400', 'v1');
  };

  afterEach(() => jest.restoreAllMocks());

  it('keys each image by its source URL, so a reshoot at the same position is not skipped as "already uploaded"', async () => {
    const [before] = await run(['https://brand.example/black-2024.jpg']);
    const [after] = await run(['https://brand.example/black-2026.jpg']);
    const [retry] = await run(['https://brand.example/black-2024.jpg']);

    expect(before).toMatch(/^helmets\/shoei\/rf-1400\/v1\/[0-9a-f]{12}$/);
    expect(after).not.toBe(before);
    expect(retry).toBe(before); // same images again: same keys, uploads skipped
  });
});
