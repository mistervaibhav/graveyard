import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class BillingService {
  // async createOrderItem(data: { productId: string; quantity: number }) {
  //     return await prisma.orderItem.create({
  //         data: {
  //             product: {
  //                 connect: {
  //                     id: data.productId,
  //                 },
  //             }
  //         },
  //     });
  // }
}
