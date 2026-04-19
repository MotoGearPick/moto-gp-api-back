import { PaginationDto } from './pagination.dto';

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

interface PaginableModel {
  findMany(args: any): Promise<any[]>;
  count(args: any): Promise<number>;
}

export interface PaginateOptions<TModel extends PaginableModel> {
  model: TModel;
  pagination: PaginationDto;
  where?: Parameters<TModel['findMany']>[0] extends { where?: infer W } ? W : never;
  orderBy?: Parameters<TModel['findMany']>[0] extends { orderBy?: infer O } ? O : never;
  include?: Parameters<TModel['findMany']>[0] extends { include?: infer I } ? I : never;
  select?: Parameters<TModel['findMany']>[0] extends { select?: infer S } ? S : never;
}

export async function paginate<
  TModel extends PaginableModel,
  TResult = Awaited<ReturnType<TModel['findMany']>>[number],
>({
  model,
  pagination,
  where,
  orderBy,
  include,
  select,
}: PaginateOptions<TModel>): Promise<PaginatedResponse<TResult>> {
  const MAX_LIMIT = 100;
  const page = Math.max(1, pagination.page ?? 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, pagination.limit ?? 20));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    model.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      ...(include && { include }),
      ...(select && { select }),
    }),
    model.count({ where }),
  ]);

  return {
    data: items as TResult[],
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
