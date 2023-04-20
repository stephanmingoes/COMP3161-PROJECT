import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { SignInUserDto } from 'src/auth/dto';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async signUpUser(user: { username: string; password: string; role: string }) {
    const query = `
    INSERT INTO users (username, password, role)
    VALUES (?, ?, ?)
  `;
    return await this.connection.query(query, [
      user.username,
      user.password,
      user.role,
    ]);
  }

  async signInUser(username: string) {
    const query = `
    SELECT * FROM users
    WHERE username = ?
  `;
    const data = await this.connection.query(query, [username]);
    return data[0];
  }
}
