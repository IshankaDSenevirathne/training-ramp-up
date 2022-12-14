import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { Student, Gender } from '../entities';

describe('AuthService', () => {
  let service: UserService;
  let studentRepository: Repository<Student>;

  const STUDENT_REPOSITORY_TOKEN = getRepositoryToken(Student);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: STUDENT_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    studentRepository = module.get<Repository<Student>>(
      STUDENT_REPOSITORY_TOKEN,
    );
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('Auth repository should be defined', () => {
    expect(studentRepository).toBeDefined();
  });
  describe('get students', () => {
    //positive test
    it('should return all students', async () => {
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
      jest.spyOn(studentRepository, 'find').mockResolvedValueOnce(students);
      const result = await service.getStudents();
      expect(result).toEqual({ students });
    });
    //negative test
    it('should return error', async () => {
      jest.spyOn(studentRepository, 'find').mockImplementationOnce(() => {
        throw new Error('Not Found!');
      });
      const result = await service.getStudents();
      expect(result.error).toEqual("Couldn't retrieve student data!");
    });
  });
  describe('add student', () => {
    // positive test
    it('should return added student', async () => {
      const student = {
        name: 'Ishanka',
        address: 'Kandy',
        gender: Gender.Male,
        mobileNo: 714942987,
        age: 0,
        dob: '1995-03-16 00:00:00',
      };
      const savedStudent = {
        id: 1,
        name: 'Ishanka',
        address: 'Kandy',
        gender: Gender.Male,
        mobileNo: 714942987,
        age: 27,
        dob: new Date('1995-03-16 00:00:00'),
      };
      jest.spyOn(service, 'calcAge').mockReturnValueOnce(27);
      jest.spyOn(studentRepository, 'save').mockResolvedValueOnce(savedStudent);
      const result = await service.addStudent(student);
      expect(result.data).toEqual(savedStudent);
      expect(result.message).toEqual('Student added successfully!');
    });
    //negative test
    it('should return error', async () => {
      const student = {
        name: 'Ishanka',
        address: 'Kandy',
        gender: Gender.Male,
        mobileNo: 714942987,
        age: 0,
        dob: '1995-03-16 00:00:00',
      };
      jest.spyOn(studentRepository, 'save').mockImplementationOnce(() => {
        throw new Error('Failed to register student!');
      });
      const result = await service.addStudent(student);
      expect(result.error).toEqual('Failed to create student entity!');
    });
  });
  describe('update student', () => {
    // positive test
    it('should return updated student', async () => {
      const student = {
        id: 1,
        name: 'Alexa',
        address: 'Kandy',
        gender: Gender.Female,
        mobileNo: 714942987,
        age: 0,
        dob: '1995-03-16 00:00:00',
      };
      const oldStudent = {
        id: 1,
        name: 'Fred',
        address: 'Kandy',
        gender: Gender.Male,
        mobileNo: 714942987,
        age: 27,
        dob: new Date('1995-03-16 00:00:00'),
      };
      const updatedStudent = {
        id: 1,
        name: 'Alexa',
        address: 'Kandy',
        gender: Gender.Female,
        mobileNo: 714942987,
        age: 27,
        dob: new Date('1995-03-16 00:00:00'),
      };
      jest.spyOn(service, 'calcAge').mockReturnValueOnce(27);
      jest
        .spyOn(studentRepository, 'findOneBy')
        .mockResolvedValueOnce(oldStudent);
      jest
        .spyOn(studentRepository, 'save')
        .mockResolvedValueOnce(updatedStudent);
      const result = await service.updateStudent(student);
      expect(result.data).toEqual(updatedStudent);
      expect(result.message).toEqual('Successfully updated the student!');
    });
    //negative test
    it('should return error', async () => {
      const student = {
        name: 'Ishanka',
        address: 'Kandy',
        gender: Gender.Male,
        mobileNo: 714942987,
        age: 0,
        dob: '1995-03-16 00:00:00',
      };
      const oldStudent = {
        id: 1,
        name: 'Fred',
        address: 'Kandy',
        gender: Gender.Male,
        mobileNo: 714942987,
        age: 27,
        dob: new Date('1995-03-16 00:00:00'),
      };
      jest.spyOn(service, 'calcAge').mockReturnValueOnce(27);
      jest
        .spyOn(studentRepository, 'findOneBy')
        .mockResolvedValueOnce(oldStudent);
      jest.spyOn(studentRepository, 'save').mockImplementationOnce(() => {
        throw new Error('Failed to update student!');
      });
      const result = await service.updateStudent(student);
      expect(result.error).toEqual('Failed to update student!');
    });
  });
  describe('delete student', () => {
    //positive test
    it('should return deleted student', async () => {
      const student = {
        id: 1,
        name: 'Ishanka',
        address: 'Kandy',
        gender: Gender.Male,
        mobileNo: 714942987,
        age: 27,
        dob: new Date('1995-03-16 00:00:00'),
      };
      jest.spyOn(studentRepository, 'findOneBy').mockResolvedValueOnce(student);
      jest.spyOn(studentRepository, 'remove').mockResolvedValueOnce(student);
      const result = await service.deleteStudent(student.id);
      expect(result.message).toEqual('Student removed successfully!');
      expect(result.data).toEqual(student);
    });
    //negative test
    it('should return error', async () => {
      const student = {
        id: 1,
        name: 'Ishanka',
        address: 'Kandy',
        gender: Gender.Male,
        mobileNo: 714942987,
        age: 27,
        dob: new Date('1995-03-16 00:00:00'),
      };
      jest.spyOn(studentRepository, 'findOneBy').mockResolvedValueOnce(student);
      jest.spyOn(studentRepository, 'remove').mockImplementationOnce(() => {
        throw new Error('Not Found!');
      });
      const result = await service.deleteStudent(student.id);
      expect(result.error).toEqual('Failed to delete student!');
    });
  });
});
