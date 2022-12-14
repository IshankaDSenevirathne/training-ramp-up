import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Response as Res,
  UseGuards,
  Put,
  Delete,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from '../entities/index';
import { UserService } from './user.service';
import { RolesGuard } from './guards/roles.guard';
import { StudentDto } from './dto';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: UserService,
  ) {}

  //Guest Requests
  @UseGuards(JwtAuthGuard)
  @Get('/getStudents')
  @UseGuards(RolesGuard)
  @Roles(Role.admin, Role.guest)
  async getStudents(@Res() res: Response) {
    const result = await this.userService.getStudents();
    if (result.error) {
      res.status(400);
      res.json({ error: result.error });
      return;
    }
    res.status(200);
    res.json({ students: result.students });
    return;
  }

  //Admin Requests
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @Post('/addStudent')
  async addStudent(@Body() body: StudentDto, @Res() res: Response) {
    const result = await this.userService.addStudent(body);
    if (result.error) {
      res.status(400);
      res.json({ error: result.error });
      return;
    }
    res.status(200);
    res.json({ student: result.data });
    return;
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @Put('/updateStudent')
  async updateStudent(@Body() body: StudentDto, @Res() res: Response) {
    const result = await this.userService.updateStudent(body);
    if (result.error) {
      res.status(400);
      res.json({ error: result.error });
      return;
    }
    res.status(200);
    res.json({ student: result.data });
    return;
  }
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @Delete('/deleteStudent/:id')
  async deleteStudent(@Req() req: Request, @Res() res: Response) {
    const result = await this.userService.deleteStudent(
      parseInt(req.params.id),
    );
    if (result.error) {
      res.status(400);
      res.json({ error: result.error });
      return;
    }
    res.status(200);
    res.json({ student: result.data });
    return;
  }
}
