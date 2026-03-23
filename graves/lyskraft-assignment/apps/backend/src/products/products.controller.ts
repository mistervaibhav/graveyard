import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly appService: ProductsService) {}

  @Get()
  getProducts(
    // @Query('page') page = 1,
    // @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'id',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('search') search = '',
    @Query('inStock') inStock: boolean | null = null // Add inStock parameter,
  ) {
    return this.appService.getProducts(
      // page,
      // limit,
      sortBy,
      sortOrder,
      search,
      inStock
    );
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.appService.getProductById(id);
  }

  @Get('/barcode/:id')
  getProductByBarcode(@Param('id') id: string) {
    return this.appService.getProductByBarcode(id);
  }
}
