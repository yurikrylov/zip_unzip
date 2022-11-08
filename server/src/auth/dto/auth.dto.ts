import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({example: 'Private key', description: 'Имя пользователя'})
  readonly username: string;
  @ApiProperty({example: 'Private key', description: 'Пароль'})
  readonly password: string;
}

export class AuthResponse {
  @ApiProperty({example: 'JWTToken', description: 'Токен, действующий 24 часа'})
  token: string;
}
