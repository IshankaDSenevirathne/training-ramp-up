import { Request, Response } from 'express';
import { Test, TestingModule } from '@nestjs/testing';
import { Gender } from '../entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('AuthController', () => {
  let controller: UserController;
  let userService: UserService;

  let requestMock = {
    body: {},
    params: {},
  } as unknown as Request;

  let responseMock = {
    status: jest.fn((x) => x),
    json: jest.fn((x) => x),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: 'USER_SERVICE',
          useValue: {
            getStudents: jest.fn((x) => x),
            addStudent: jest.fn((x) => x),
            updateStudent: jest.fn((x) => x),
            deleteStudent: jest.fn((x) => x),
          },
        },
      ],
    }).compile();
    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>('USER_SERVICE');
    requestMock = {
      body: {},
      params: {},
    } as unknown as Request;

    responseMock = {
      status: jest.fn((x) => x),
      json: jest.fn((x) => x),
    } as unknown as Response;
  });
  it('Auth Contoller should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('Auth Service should be defined', () => {
    expect(userService).toBeDefined();
  });
  describe('get students', () => {
    const students = [
      {
        id: 1,
        name: 'Ishanka',
        address: 'Kandy',
        gender: Gender.Male,
        mobileNo: 714942987,
        age: 27,
        dob: new Date('1995-03-16 00:00:00'),
      },
      {
        id: 2,
        name: 'Sara',
        address: 'Colombo',
        gender: Gender.Female,
        mobileNo: 714542947,
        age: 27,
        dob: new Date('1995-04-17 00:00:00'),
      },
    ];
    //positive test
    it('should return a status of 200', async () => {
      jest
        .spyOn(userService, 'getStudents')
        .mockResolvedValueOnce({ students });
      await controller.getStudents(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.json).toHaveBeenCalledWith({ students });
    });
    //negative test
    it('should return a status of 400', async () => {
      jest
        .spyOn(userService, 'getStudents')
        .mockResolvedValueOnce({ error: "Couldn't retrieve student data!" });
      await controller.getStudents(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.json).toHaveBeenCalledWith({
        error: "Couldn't retrieve student data!",
      });
    });
  });
  describe('add student', () => {
    const student = {
      id: 1,
      name: 'Ishanka',
      address: 'Kandy',
      gender: Gender.Male,
      mobileNo: 714942987,
      age: 0,
      dob: '1995-03-16 00:00:00',
    };
    const createdStudent = { ...student, age: 27, dob: new Date(student.dob) };
    requestMock.body = student;
    //positive test
    it('should return a status of 200', async () => {
      jest.spyOn(userService, 'addStudent').mockResolvedValueOnce({
        message: 'Student added successfully!',
        data: createdStudent,
      });
      await controller.addStudent(requestMock.body, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.json).toHaveBeenCalledWith({
        student: createdStudent,
      });
    });
    //negative test
    it('should return a status of 400', async () => {
      jest
        .spyOn(userService, 'addStudent')
        .mockResolvedValueOnce({ error: 'Failed to create student entity!' });
      await controller.addStudent(requestMock.body, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.json).toHaveBeenCalledWith({
        error: 'Failed to create student entity!',
      });
    });
  });
  describe('update student', () => {
    const student = {
      id: 1,
      name: 'Alexa',
      address: 'Kandy',
      gender: Gender.Female,
      mobileNo: 714942987,
      age: 0,
      dob: '1995-03-16 00:00:00',
    };
    const updatedStudent = { ...student, age: 27, dob: new Date(student.dob) };
    requestMock.body = student;
    //positive test
    it('should return a status of 200', async () => {
      jest.spyOn(userService, 'updateStudent').mockResolvedValueOnce({
        message: 'Student added successfully!',
        data: updatedStudent,
      });
      await controller.updateStudent(requestMock.body, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.json).toHaveBeenCalledWith({
        student: updatedStudent,
      });
    });
    //negative test
    it('should return a status of 400', async () => {
      jest
        .spyOn(userService, 'updateStudent')
        .mockResolvedValueOnce({ error: 'Failed to update student!' });
      await controller.updateStudent(requestMock.body, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.json).toHaveBeenCalledWith({
        error: 'Failed to update student!',
      });
    });
  });
  describe('delete student', () => {
    requestMock.params.id = '2';
    const deletedStudent = {
      id: 1,
      name: 'Alexa',
      address: 'Kandy',
      gender: Gender.Female,
      mobileNo: 714942987,
      age: 27,
      dob: new Date('1995-03-16 00:00:00'),
    };
    //positive test
    it('should return a status of 200', async () => {
      jest.spyOn(userService, 'deleteStudent').mockResolvedValueOnce({
        message: 'Student added successfully!',
        data: deletedStudent,
      });
      await controller.deleteStudent(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.json).toHaveBeenCalledWith({
        student: deletedStudent,
      });
    });
    //negative test
    it('should return a status of 400', async () => {
      jest
        .spyOn(userService, 'deleteStudent')
        .mockResolvedValueOnce({ error: 'Failed to delete student!' });
      await controller.deleteStudent(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.json).toHaveBeenCalledWith({
        error: 'Failed to delete student!',
      });
    });
  });
});
