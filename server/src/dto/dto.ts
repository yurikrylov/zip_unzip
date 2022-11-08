import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthBody {
    @ApiProperty({example: 'https://example.ru', description: 'URL инстанса'})
    c1URL: string;
    @ApiProperty({example: 'admin@admin.admin', description: 'username для входа'})
    username: string;
    @ApiProperty({example: 'asdasdda', description: 'password для входа'})
    password: string;
}

export class Token {
    @ApiProperty({example: 'adc32c223cf23c23cf324fc23fc32c', description: 'Токен CaseOne'})
    token: string
}
