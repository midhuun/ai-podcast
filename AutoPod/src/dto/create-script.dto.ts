import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, Min, Max } from 'class-validator';

export class CreateScriptDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Topic must be at least 3 characters long' })
  @MaxLength(500, { message: 'Topic must be less than 500 characters long' })
  topic: string;

  @IsNumber()
  @Min(1, { message: 'Minutes must be at least 1' })
  @Max(20, { message: 'Minutes cannot exceed 20' })
  minutes?: number = 2;
}
