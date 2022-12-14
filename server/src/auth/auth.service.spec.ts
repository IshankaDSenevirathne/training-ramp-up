import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { AuthService } from './auth.service';
import { Role, User, Session } from '../entities';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: Repository<User>;
  let sessionRepository: Repository<Session>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  const SESSION_REPOSITORY_TOKEN = getRepositoryToken(Session);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: SESSION_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    authRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    sessionRepository = module.get<Repository<Session>>(
      SESSION_REPOSITORY_TOKEN,
    );
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('Auth repository should be defined', () => {
    expect(authRepository).toBeDefined();
  });
  it('Session repository should be defined', () => {
    expect(sessionRepository).toBeDefined();
  });

  describe('login', () => {
    //positive test
    it('should return an access token, refresh token and session data', async () => {
      const dataIn = {
        email: 'fake_email@fake.com',
        password: 'fake_password',
      };
      const user = {
        id: 1,
        name: 'fake_name',
        email: 'fake_email@fake.com',
        password: 'fake_password',
        role: Role.guest,
      };
      const dataOut = {
        refreshToken: 'fake_refresh_token',
        accessToken: 'fake_access_token',
        userData: {
          sessionId: 'fake_session_id',
          email: 'fake_email@fake.com',
          name: 'fake_name',
          role: Role.guest,
        },
      };
      jest.spyOn(argon, 'verify').mockResolvedValue(true);
      jest.spyOn(authRepository, 'findOneBy').mockResolvedValueOnce(user);
      jest
        .spyOn(service, 'newRefreshAndAccessToken')
        .mockResolvedValueOnce(dataOut);
      const result = await service.login(dataIn.email, dataIn.password);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.userData).toBeDefined();
    });
    //negative test
    it('should return undefined', async () => {
      const dataIn = {
        email: 'fake_email@fake.com',
        password: 'fake_password',
      };
      const user = undefined;
      jest.spyOn(authRepository, 'findOneBy').mockResolvedValueOnce(user);
      const result = await service.login(dataIn.email, dataIn.password);
      expect(result).toBeUndefined();
    });
  });
  describe('signup', () => {
    //positive test
    it('should return an access token, refresh token and session data', async () => {
      const dataIn = {
        name: 'fake_name',
        email: 'fake_email@fake.com',
        password: 'fake_password',
      };
      const user = {
        id: 1,
        name: 'fake_name',
        email: 'fake_email@fake.com',
        password: 'fake_password',
        role: Role.guest,
      };
      const dataOut = {
        refreshToken: 'fake_refresh_token',
        accessToken: 'fake_access_token',
        userData: {
          sessionId: 'fake_session_id',
          email: 'fake_email@fake.com',
          name: 'fake_name',
          role: Role.guest,
        },
      };
      jest.spyOn(argon, 'hash').mockResolvedValue('fake_hash_password');
      jest.spyOn(authRepository, 'save').mockResolvedValueOnce(user);
      jest
        .spyOn(service, 'newRefreshAndAccessToken')
        .mockResolvedValueOnce(dataOut);
      const result = await service.signup(dataIn);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.userData).toBeDefined();
    });
    //negative test
    it('should return undefined', async () => {
      const dataIn = {
        name: 'fake_name',
        email: 'fake_email@fake.com',
        password: 'fake_password',
      };
      const user = undefined;
      const dataOut = undefined;
      jest.spyOn(argon, 'hash').mockResolvedValue('fake_hash_password');
      jest.spyOn(authRepository, 'save').mockResolvedValueOnce(user);
      jest
        .spyOn(service, 'newRefreshAndAccessToken')
        .mockResolvedValueOnce(dataOut);
      const result = await service.signup(dataIn);
      expect(result).toBeUndefined();
    });
  });
  describe('refresh access token', () => {
    //positive test
    it('should return a access token and user data', async () => {
      const refreshToken = 'fake_refresh_token';
      const payload = {
        sessionId: 'fake_session_id',
        email: 'fake_email@fake.com',
        role: Role.guest,
        name: 'fake_name',
      } as any;
      const session = {
        id: 'fake_session_id',
        email: 'fake_email@fake.com',
        valid: true,
        name: 'fake_name',
      };
      const user = {
        id: 1,
        name: 'fake_name',
        email: 'fake_email@fake.com',
        password: 'fake_password',
        role: Role.guest,
      };
      jest.spyOn(authRepository, 'findOneBy').mockResolvedValueOnce(user);
      jest.spyOn(sessionRepository, 'findOneBy').mockResolvedValueOnce(session);
      jest.spyOn(service, 'retrieveRefreshToken').mockReturnValueOnce(payload);
      const result = await service.refresh(refreshToken);
      expect(result.accessToken).toBeDefined();
      expect(result.userData).toEqual(payload);
    });
    //negative test
    it('should return undefined', async () => {
      const refreshToken = 'fake_refresh_token';
      jest
        .spyOn(service, 'retrieveRefreshToken')
        .mockReturnValueOnce(undefined);
      const result = await service.refresh(refreshToken);
      expect(result).toBeUndefined();
    });
  });
  describe('logout', () => {
    //positive test
    it('should return a success message', async () => {
      const sessionId = 'fake_session_id';
      const session = {
        id: 'fake_session_id',
        email: 'fake_email@fake.com',
        valid: true,
        name: 'fake_name',
      };
      jest.spyOn(sessionRepository, 'findOneBy').mockResolvedValueOnce(session);
      jest.spyOn(sessionRepository, 'save').mockResolvedValueOnce(session);
      const result = await service.logout(sessionId);
      expect(result.message).toEqual('Successfully logged out!');
    });
    //negative test
    it('should return undefined', async () => {
      const sessionId = 'fake_session_id';
      const session = undefined;
      jest.spyOn(sessionRepository, 'findOneBy').mockResolvedValueOnce(session);
      const result = await service.logout(sessionId);
      expect(result).toBeUndefined();
    });
  });
});
