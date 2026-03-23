import { Injectable } from '@nestjs/common';
import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ProductsService {
  // async getProducts() {
  //   return await prisma.product.findMany();
  // }

  async getProducts(
    // page = 1,
    // limit = 10,
    sortBy = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
    search = '',
    inStock: boolean | null = null
  ): Promise<Array<Product>> {
    // const skip = (page - 1) * limit;
    const products = await prisma.product.findMany({
      // take: limit,
      // skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
      where: {
        AND: [
          {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { color: { contains: search, mode: 'insensitive' } },
            ],
          },
          inStock !== null
            ? {
                stocks: {
                  some: {
                    quantity: inStock ? { gt: 0 } : { equals: 0 },
                  },
                },
              }
            : {},
        ],
      },
    });

    // const totalCount = await prisma.product.count();
    // const totalPages = Math.ceil(totalCount / limit);
    // const nextPage =
    //   page < totalPages ? `/products?page=${page + 1}&limit=${limit}` : null;
    // const prevPage =
    //   page > 1 ? `/products?page=${page - 1}&limit=${limit}` : null;

    return products;
  }

  async getProductById(id: string) {
    return await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
  }

  async getProductByBarcode(barcode: string) {
    return await prisma.product.findFirst({
      where: {
        barcode: barcode,
      },
      include: {
        stocks: {
          include: {
            store: true,
          },
        },
      },
    });
  }
}
