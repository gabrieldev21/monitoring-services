import { IsArray, ArrayNotEmpty, IsInt, Min } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  productIds: number[];
}
