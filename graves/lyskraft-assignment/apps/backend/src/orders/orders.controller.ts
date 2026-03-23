import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get('/')
  async getOrders(
    @Query('paymentStatus') paymentStatus = 'ALL',
    @Query('orderStatus') orderStatus = 'ALL'
  ) {
    return this.service.getOrders(paymentStatus, orderStatus);
  }

  @Get(':id')
  async getOrderDetails(@Param('id') id: string) {
    return this.service.getOrderDetails(id);
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.service.createOrder(createOrderDto);
  }
}
