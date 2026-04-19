import { ConflictException } from '@nestjs/common';
import { AuthAdminService } from './auth.admin.service';

describe('AuthAdminService', () => {
  const originalEnv = { ...process.env };

  beforeAll(() => {
    process.env.APP_ENV = 'test';
    process.env.APP_URL = 'http://localhost';
    process.env.PUBLIC_API_KEY = 'k';
    process.env.APP_DATABASE_URL = 'postgres://x';
    process.env.PRODUCTS_DATABASE_URL = 'postgres://x';
    process.env.REDIS_URL = 'redis://x';
    process.env.JWT_ADMIN_ACCESS_SECRET = 'access';
    process.env.JWT_ADMIN_REFRESH_SECRET = 'refresh';
    process.env.JWT_ADMIN_RESET_SECRET = 'reset';
    process.env.S3_ACCESS_KEY_ID = 'x';
    process.env.S3_SECRET_ACCESS_KEY = 'x';
    process.env.S3_BUCKET = 'x';
    process.env.S3_ENDPOINT = 'http://localhost';
    process.env.RESEND_API_KEY = 'x';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const makeService = (overrides: Partial<Record<string, jest.Mock>> = {}) => {
    const repo = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findByIdOrFail: jest.fn(),
      remove: jest.fn(),
      ...overrides,
    };
    const jwt = {
      signAsync: jest.fn(async (payload, opts) => `token-${opts.secret}-${opts.expiresIn}`),
    };
    const service = new AuthAdminService(repo as any, jwt as any);
    return { service, repo, jwt };
  };

  it('issues access + refresh tokens with configured expirations', async () => {
    const { service, jwt } = makeService();
    const tokens = await service.generateTokens({ id: 'u1' });

    expect(jwt.signAsync).toHaveBeenCalledTimes(2);
    const calls = jwt.signAsync.mock.calls;
    expect(calls[0][1].expiresIn).toBeDefined();
    expect(calls[1][1].expiresIn).toBeDefined();
    expect(tokens.accessToken).toContain('access');
    expect(tokens.refreshToken).toContain('refresh');
  });

  it('rejects registration when email already exists', async () => {
    const { service, repo } = makeService({
      findByEmail: jest.fn().mockResolvedValue({ id: 'existing' }),
    });

    await expect(
      service.register({ name: 'x', email: 'a@b.com', password: 'pw12345678' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(repo.create).not.toHaveBeenCalled();
  });
});
