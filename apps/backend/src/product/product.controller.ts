import { Controller, Get, Param, Query } from '@nestjs/common';
import { Prisma } from 'database';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(
    @Query()
    query: Pick<Prisma.ProductFindFirstArgs, 'skip' | 'take' | 'orderBy'> & {
      storeId?: number;
      discId?: number;
    },
  ) {
    return this.productService.findMany({
      where: {
        storeId: query.storeId,
        discId: query.discId,
      },
      skip: query.skip,
      take: query.take,
      orderBy: query.orderBy,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findUnique({ where: { id: +id } });
  }
}
