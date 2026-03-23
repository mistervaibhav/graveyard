export class SearchCustomerDto {
  name?: string;
  phone?: string;
}

export class CreateCustomerDto {
  name: string;
  phone: string;
}

export class CreateAddressDto {
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}
