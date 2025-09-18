import { IsNumber, IsString } from 'class-validator';

export class CreateCatalogDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;
}
