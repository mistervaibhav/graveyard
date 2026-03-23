import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateAddressDto, CreateCustomerDto } from './dtos';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('stores')
  getStores() {
    return this.service.getStores();
  }

  @Get('staff/:id')
  getStaffByStoreId(@Param('id') id: string) {
    return this.service.getStaffByStoreId(id);
  }

  @Get('customers/:id/addresses')
  async getAddressesByCustomerId(@Param('id') id: string) {
    return this.service.getAddressesByCustomerId(id);
  }

  @Get('customers')
  async searchCustomers(@Query('search') searchQuery: string) {
    return this.service.searchCustomers(searchQuery);
  }

  @Post('customers')
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.service.createCustomer(createCustomerDto);
  }

  @Post('customers/:id/addresses')
  async createAddress(
    @Param('id') id: string,
    @Body() createAddressDto: CreateAddressDto
  ) {
    return this.service.createAddress(id, createAddressDto);
  }
}
