import { ExecutionContext, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';

function makeContext(headers: Record<string, string | string[] | undefined>): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  } as unknown as ExecutionContext;
}

describe('ApiKeyGuard', () => {
  const guard = new ApiKeyGuard();
  const VALID = 'test-api-key-123';

  beforeEach(() => {
    process.env.PUBLIC_API_KEY = VALID;
  });

  afterEach(() => {
    delete process.env.PUBLIC_API_KEY;
  });

  it('allows matching key', () => {
    expect(guard.canActivate(makeContext({ 'x-api-key': VALID }))).toBe(true);
  });

  it('rejects mismatched key', () => {
    expect(() => guard.canActivate(makeContext({ 'x-api-key': 'wrong' }))).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects missing key', () => {
    expect(() => guard.canActivate(makeContext({}))).toThrow(UnauthorizedException);
  });

  it('throws InternalServerError when env not configured', () => {
    delete process.env.PUBLIC_API_KEY;
    expect(() => guard.canActivate(makeContext({ 'x-api-key': VALID }))).toThrow(
      InternalServerErrorException,
    );
  });
});
