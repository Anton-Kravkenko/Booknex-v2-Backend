import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export interface Pagination {
	page?: number
}


export const GetPage = createParamDecorator((data, ctx: ExecutionContext): Pagination => {
  const req: Request = ctx.switchToHttp().getRequest();
  const paginationParams: Pagination = {
    page: 1 // default page number
  };
  paginationParams.page = req.query.page ? parseInt(req.query.page.toString()) : 1;
  return paginationParams;
});