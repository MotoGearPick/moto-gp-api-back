import { Prisma } from '@prisma/products-client';

export type PrismaKnownRequestError = Error & {
  code: string;
  clientVersion: string;
  meta?: { target?: unknown; cause?: unknown; [key: string]: unknown };
  batchRequestIdx?: number;
};

export type PrismaValidationError = Error;

export const isPrismaKnownRequestError = (
  err: unknown,
): err is PrismaKnownRequestError =>
  err instanceof Prisma.PrismaClientKnownRequestError;

export const isPrismaValidationError = (
  err: unknown,
): err is PrismaValidationError =>
  err instanceof Prisma.PrismaClientValidationError;
