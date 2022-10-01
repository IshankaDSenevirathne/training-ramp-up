import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}
  async getStudents() {
    try {
      const students = await this.studentRepository.find();
      return { students };
    } catch (error) {
      return { error: "Couldn't retrieve student data!" };
    }
  }

  async addStudent(data: any) {
    try {
      const dob = new Date(data.dob);
      const age = this.calcAge(dob);
      const student = new Student();
      student.name = data.name;
      student.gender = data.gender;
      student.address = data.address;
      student.dob = dob;
      student.mobileNo = data.mobileNo;
      student.age = age;
      const newStudent = await this.studentRepository.save(student);
      if (!newStudent) {
        return { error: 'Failed to add student!' };
      }
      return { message: 'Student added successfully!', data: newStudent };
    } catch (error) {
      return { error: 'Failed to create student entity!' };
    }
  }

  async updateStudent(data: any) {
    try {
      const student = await this.studentRepository.findOneBy({ id: data.id });
      if (!student) {
        return { error: 'Student not found!' };
      }
      const dob = new Date(data.dob);
      const age = this.calcAge(dob);
      const updatedStudent = await this.studentRepository.save({
        ...student,
        ...data,
        age,
        dob,
      });
      if (!updatedStudent) {
        return { error: 'Failed to update student!' };
      }
      return {
        message: 'Successfully updated the student!',
        data: updatedStudent,
      };
    } catch (error) {
      return { error: 'Failed to update student!' };
    }
  }

  async deleteStudent(id: number) {
    try {
      const student = await this.studentRepository.findOneBy({ id });
      if (!student) {
        return { error: "Student doesn't exist!" };
      }
      await this.studentRepository.remove(student);
      return { message: 'Student removed successfully!', data: student };
    } catch (error) {
      return { error: 'Failed to delete student!' };
    }
  }

  private calcAge(date: Date) {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age;
  }
}
