import { IsEnum, IsString, Length } from 'class-validator';

export enum UserRole {
  Student = 'student',
  Admin = 'admin',
  Lecturer = 'lecturer',
}

export class CreateUserDto {
  @IsString()
  @Length(1, 30)
  username: string;

  @IsString()
  @Length(1, 40)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class SignInUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
