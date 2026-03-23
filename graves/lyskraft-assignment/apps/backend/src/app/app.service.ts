import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAddressDto, CreateCustomerDto, SearchCustomerDto } from './dtos';

const prisma = new PrismaClient();

@Injectable()
export class AppService {
  async getStores() {
    return await prisma.store.findMany();
  }

  async getStaffByStoreId(storeId: string) {
    return await prisma.storeStaff.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      where: {
        storeId: storeId,
      },
    });
  }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    return prisma.customer.create({
      data: createCustomerDto,
    });
  }

  async searchCustomers(searchQuery: string) {
    if (searchQuery.trim().length === 0) {
      return [];
    }

    return prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { phone: { contains: searchQuery } },
        ],
      },
    });
  }

  async getAddressesByCustomerId(customerId: string) {
    return prisma.address.findMany({
      where: { customerId },
    });
  }

  async createAddress(customerId: string, createAddressDto: CreateAddressDto) {
    return prisma.address.create({
      data: {
        ...createAddressDto,
        customerId,
      },
    });
  }
}
