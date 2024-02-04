import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { UserService } from '../user/user.service';
import { RegisterAuthenticationDto } from './dto/register-authentication.dto';
import { LoginAuthenticationDto } from './dto/login-authentication.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import { verifyPassword } from '../../utils/hash';
import { JwtService } from '@nestjs/jwt';

jest.mock('../../utils/hash.ts', () => ({
  hashPassword: jest
    .fn()
    .mockImplementation(async (password) => `hashed_${password}`),
  verifyPassword: jest
    .fn()
    .mockImplementation(
      async (password, hashedPassword) => password == hashedPassword
    ),
}));

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let userService: UserService;
  let authenticationService: AuthenticationService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        AuthenticationService,
        UserService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    userService = module.get<UserService>(UserService);
    authenticationService = module.get<AuthenticationService>(
      AuthenticationService
    );
    jwtService = module.get<JwtService>(JwtService);

    // Set ENV Variable
    process.env.JWT_SECRET = 'myJwtSecret';
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Register Process', () => {
    it('should return error duplicate email', async () => {
      jest.spyOn(userService, 'doesThisEmailExist').mockResolvedValue(true);

      jest.spyOn(authenticationService, 'register');

      const mockBody = {
        email: 'rudolph@mail.com',
        password: 'asdfghjkl',
      } as RegisterAuthenticationDto;

      try {
        await controller.register(mockBody);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
        expect(error.message).toBe('Data with this email already exists.');
      }

      expect(authenticationService.register).not.toHaveBeenCalled();
    });

    it('should create new data', async () => {
      const mockBody = {
        name: 'rudolph',
        email: 'rudolph@mail.com',
        password: 'asdfghjkl',
      } as RegisterAuthenticationDto;

      jest.spyOn(userService, 'doesThisEmailExist').mockResolvedValue(false);

      jest.spyOn(authenticationService, 'register').mockResolvedValue({
        ...mockBody,
        _id: 'lkjasdsalkj' as unknown as Types.ObjectId,
      } as UserDocument);

      const registrationProcess = await controller.register(mockBody);

      expect(registrationProcess).toEqual({
        _id: 'lkjasdsalkj',
        name: mockBody.name,
        email: mockBody.email,
      });

      expect(authenticationService.register).toHaveBeenCalled();
      expect(userService.doesThisEmailExist).toHaveBeenCalledWith(
        mockBody.email
      );
      expect(authenticationService.register).toHaveBeenCalledWith({
        ...mockBody,
        password: `hashed_${mockBody.password}`,
      });

      // @ts-ignore
      expect(registrationProcess.password).toBeUndefined();
    });
  });

  describe('Login Process', () => {
    describe('Wrong Email', () => {
      it('Should Return Error Email Or Password Wrong', async () => {
        const mockBody = {
          email: 'wrong@mail.com',
          password: 'wrongPass',
        } as LoginAuthenticationDto;

        jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

        try {
          const loginProcess = await controller.login(mockBody);

          expect(loginProcess).toThrowError();
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
          expect(error.message).toBe('The Email or Password is wrong.');
        }

        expect(userService.findByEmail).toHaveBeenCalledWith(mockBody.email);
        expect(verifyPassword).not.toHaveBeenCalled();
      });
    });

    describe('Wrong Password', () => {
      it('Should Return Error Email Or Password Wrong', async () => {
        const mockUser = {
          name: 'rudolph',
          email: 'rudolph@mail.com',
          password: 'hashed_password',
        } as UserDocument;

        const mockBody = {
          email: 'rudolph@mail.com',
          password: 'wrongPassword',
        } as LoginAuthenticationDto;

        jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);

        try {
          const loginProcess = await controller.login(mockBody);

          expect(loginProcess).toThrowError();
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
          expect(error.message).toBe('The Email or Password is wrong.');
        }

        expect(userService.findByEmail).toHaveBeenCalledWith(mockBody.email);
        expect(verifyPassword).toHaveBeenCalledWith(
          mockBody.password,
          mockUser.password
        );
      });
    });

    it('should return access token', async () => {
      const mockUser = {
        name: 'rudolph',
        email: 'rudolph@mail.com',
        password: 'hashed_password',
      } as UserDocument;

      const mockBody = {
        email: 'rudolph@mail.com',
        password: 'hashed_password',
      } as LoginAuthenticationDto;

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('userAccessToken');

      const loginProcess = await controller.login(mockBody);

      expect(loginProcess).toEqual(
        expect.objectContaining({
          access_token: expect.any(String),
        })
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(mockBody.email);
      expect(verifyPassword).toHaveBeenCalledWith(
        mockBody.password,
        mockUser.password
      );
      expect(jwtService.signAsync).toHaveBeenCalled();
    });
  });
});
