import { Injectable } from '@nestjs/common';

import { OrderStatus, PrismaClient } from '@prisma/client';
import { CreateOrderDto } from './dtos';

const prisma = new PrismaClient();
@Injectable()
export class OrdersService {
  async getOrders(paymentStatus: string, orderStatus: string) {
    const where = {};

    if (paymentStatus !== 'ALL') {
      where['paymentStatus'] = paymentStatus;
    }

    if (orderStatus !== 'ALL') {
      where['status'] = orderStatus;
    }

    return prisma.order.findMany({
      include: {
        customer: { select: { name: true } },
        salesStaff: { select: { name: true } },
      },
      where,
    });
  }

  async getOrderDetails(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        address: true,
        salesStaff: true,
        items: {
          include: {
            product: true,
            billingStore: true,
            fulfilmentStore: true,
          },
        },
      },
    });
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const {
      customerId,
      paymentMode,
      salesStaffId,
      items,
      paymentStatus,
      transactionId,
    } = createOrderDto;

    if (createOrderDto.addressId.length === 0) {
      delete createOrderDto.addressId;
    }

    return prisma.order.create({
      data: {
        paymentMode,
        paymentStatus,
        transactionId,
        status: OrderStatus.RUNNING,
        customer: { connect: { id: customerId } },
        ...(createOrderDto.addressId
          ? { address: { connect: { id: createOrderDto.addressId } } }
          : {}),
        salesStaff: { connect: { id: salesStaffId } },
        items: {
          create: items.map((item) => ({
            ...item,
            // product: { connect: { id: item.productId } },
            quantity: item.quantity || 1,
          })),
        },
      },
    });
  }
}
