import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

// Convert the scrypt from callback to a promise
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use and return early
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('Email in use');

    // Generate a salt (16 chars long)
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together (use as Buffer to help Typescript)
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const hashedResult = `${salt}.${hash.toString('hex')}`;

    // Create a new user, save it and return it
    return await this.usersService.create(email, hashedResult);
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('User not found');

    // Retrieve the stored hash and the salt by splitting the db entry
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) throw new BadRequestException('Wrong password');

    return user;
  }
}
