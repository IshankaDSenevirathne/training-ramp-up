import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export enum Gender {
  Female = 'Female',
  Male = 'Male',
  Other = 'Other',
}

export class StudentDto {
  @IsInt()
  @IsOptional()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  mobileNo: number;

  @IsDateString()
  @IsNotEmpty()
  dob: Date;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  age: number;
}
