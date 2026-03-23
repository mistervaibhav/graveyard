export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  storeId: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}
