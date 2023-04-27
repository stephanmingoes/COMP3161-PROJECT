import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto, SignInUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async signup(user: CreateUserDto) {
    const hashedPassword = await hash(user.password);
    await this.db.signUpUser({
      ...user,
      password: hashedPassword,
    });

    return { message: 'user created successfully' };
  }

  async signin(user: SignInUserDto) {
    const fetchedUser = await this.db.signInUser(user.username);
    if (!fetchedUser) throw new NotFoundException('User not found');
    const isPasswordValid = await verify(fetchedUser.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Incorrect Password');
    delete fetchedUser.password;

    return {
      access_token: await this.jwtService.signAsync(fetchedUser),
    };
  }
}
