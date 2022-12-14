import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Role } from '../entities';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const requestMock = {
    body: {},
    params: {},
    cookies: {},
  } as unknown as Request;

  const responseMock = {
    status: jest.fn((x) => x),
    send: jest.fn((x) => x),
    cookie: jest.fn((x) => x),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'AUTH_SERVICE',
          useValue: {
            signup: jest.fn((x) => x),
            login: jest.fn((x) => x),
            logout: jest.fn((x) => x),
            refresh: jest.fn((x) => x),
          },
        },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>('AUTH_SERVICE');
  });

  it('Auth Contoller should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('Auth Service should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    //positive test
    it('should return a status of 200', async () => {
      requestMock.body = {
        name: 'fake_name',
        email: 'fake_email@fake.com',
        password: 'fake_password',
      };
      const result = {
        userData: {
          sessionId: 'fake_session_id',
          name: 'fake_name',
          email: 'fake_email@fake.com',
          role: Role.guest,
        },
        refreshToken: 'fake_refresh_token',
        accessToken: 'fake_access_token',
      };
      jest.spyOn(authService, 'signup').mockResolvedValueOnce(result);
      await controller.signup(requestMock.body, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.send).toHaveBeenCalledWith(
        'User has been registered!',
      );
    });
    //negative test
    it('should return a status of 400', async () => {
      requestMock.body = {
        name: 'fake_name',
        email: 'fake_email@fake.com',
        password: 'fake_password',
      };
      const result = undefined;
      jest.spyOn(authService, 'signup').mockResolvedValueOnce(result);
      await controller.signup(requestMock.body, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.send).toHaveBeenCalledWith('Signup Failed!');
    });
  });

  describe('login', () => {
    //positive test
    it('should return a status of 200', async () => {
      requestMock.body = {
        email: 'fake_email@fake.com',
        password: 'fake_password',
      };
      const result = {
        userData: {
          sessionId: 'fake_session_id',
          name: 'fake_name',
          email: 'fake_email@fake.com',
          role: Role.guest,
        },
        refreshToken: 'fake_refresh_token',
        accessToken: 'fake_access_token',
      };
      jest.spyOn(authService, 'login').mockResolvedValueOnce(result);
      await controller.login(requestMock.body, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.send).toHaveBeenCalledWith(
        'User has been authenticated!',
      );
    });
    //negative test
    it('should return a status of 400', async () => {
      requestMock.body = {
        email: 'fake_email@fake.com',
        password: 'fake_password',
      };
      const result = undefined;
      jest.spyOn(authService, 'login').mockResolvedValueOnce(result);
      await controller.login(requestMock.body, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.send).toHaveBeenCalledWith('Invalid Credentials!');
    });
  });

  describe('logout', () => {
    //positive test
    it('should return a status of 200', async () => {
      requestMock.params.sessionId = 'fake_session_Id';
      const result = { message: 'Successfully logged out!' };
      jest.spyOn(authService, 'logout').mockResolvedValueOnce(result);
      await controller.logout(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.send).toHaveBeenCalledWith(
        'User has been logged out!',
      );
    });
    //negative test
    it('should return a status of 400', async () => {
      requestMock.params.sessionId = 'fake_session_Id';
      const result = undefined;
      jest.spyOn(authService, 'logout').mockResolvedValueOnce(result);
      await controller.logout(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.send).toHaveBeenCalledWith('Failed to logout!');
    });
  });

  describe('refresh access', () => {
    //positive test
    it('should return a status of 200', async () => {
      requestMock.cookies = { refreshToken: 'fake_refresh_token' };
      const result = {
        userData: {
          sessionId: 'fake_session_id',
          name: 'fake_name',
          email: 'fake_email@fake.com',
          role: Role.guest,
        },
        accessToken: 'fake_access_token',
      };
      jest.spyOn(authService, 'refresh').mockResolvedValueOnce(result);
      await controller.refreshToken(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.send).toHaveBeenCalledWith(
        'User has been re-authenticated!',
      );
    });
    //negative test
    it('should return a status of 400', async () => {
      requestMock.cookies = { refreshToken: 'fake_refresh_token' };
      const result = undefined;
      jest.spyOn(authService, 'refresh').mockResolvedValueOnce(result);
      await controller.refreshToken(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.send).toHaveBeenCalledWith('Unauthorized!');
    });
  });
});
