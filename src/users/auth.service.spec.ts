import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  /** Global var for all tests **/
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  /** Run before all tests in this file start **/
  beforeEach(async () => {
    /** Create a fake copy of the users service **/
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 99999), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [AuthService, { provide: UsersService, useValue: fakeUsersService }],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'password123');
    expect(user.password).not.toEqual('password123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(salt).toHaveLength(16);
    expect(hash).toMatch(/^[a-f0-9]/i);
    expect(hash).toBeDefined();
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]/i);
  });

  it('throws an error if user signs up with an email that is in use', async () => {
    /** Signup twice **/
    await service.signup('mymail@mail.com', 'password123');
    await expect(service.signup('mymail@mail.com', 'password123')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws if signin is called with unused email', async () => {
    await expect(service.signin('test@test.com', 'password123')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('throws if signin is called with invalid password', async () => {
    /** Modify the find method to resolve to something custom for demo purposes **/
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'test@test.com',
          password: 'password123.9b13d4781235b06aa38c5b93c8388c384dc5388ab0d3950670983eb7d6d131ac',
        } as User,
      ]);

    await expect(service.signin('test@test.com', 'password1234')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('returns a user if the correct email & password is provided', async () => {
    await service.signup('test@test.com', 'password123');
    const user = await service.signin('test@test.com', 'password123');
    expect(user).toBeDefined();
  });
});
