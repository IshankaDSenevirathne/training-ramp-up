import {
  Body,
  Controller,
  Post,
  Response as Res,
  Req,
  Delete,
  UseGuards,
  Get,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto, SignUpDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async signup(@Body() body: SignUpDto, @Res() res: Response) {
    const result = await this.authService.signup(body);
    if (!result) {
      res.status(400);
      res.send('Signup Failed!');
      return;
    }
    res.cookie('accessToken', result.accessToken, {
      maxAge: 300000,
      httpOnly: true,
    });
    res.cookie('refreshToken', result.refreshToken, {
      maxAge: 3.154e10,
      httpOnly: true,
    });
    res.cookie('userData', result.userData, {
      maxAge: 300000,
    });
    res.status(200);
    res.send('User has been registered!');
    return;
  }

  @Post('/login')
  async login(@Body() body: LogInDto, @Res() res: Response) {
    const result = await this.authService.login(body.email, body.password);
    if (!result) {
      res.status(400);
      res.send('Invalid Credentials!');
      return;
    }
    res.cookie('accessToken', result.accessToken, {
      maxAge: 300000,
      httpOnly: true,
    });
    res.cookie('refreshToken', result.refreshToken, {
      maxAge: 3.154e10,
      httpOnly: true,
    });
    res.cookie('userData', result.userData, {
      maxAge: 300000,
    });
    res.status(200);
    res.send('User has been authenticated!');
    return;
  }

  @Post('/refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.refresh(req.cookies.refreshToken);
    if (!result) {
      res.status(400);
      res.send('Unauthorized!');
      return;
    }
    res.cookie('accessToken', result.accessToken, {
      maxAge: 300000,
      httpOnly: true,
    });
    res.cookie('userData', result.userData, {
      maxAge: 300000,
    });
    res.status(200);
    res.send('User has been re-authenticated!');
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/logout/:sessionId')
  async logout(@Req() req: Request, @Res() res: Response) {
    const { sessionId } = req.params;
    const result = await this.authService.logout(sessionId);

    if (!result) {
      res.status(400);
      res.send('Failed to logout!');
      return;
    }
    res.cookie('accessToken', '', {
      maxAge: 0,
      httpOnly: true,
    });
    res.cookie('refreshToken', '', {
      maxAge: 0,
      httpOnly: true,
    });
    res.cookie('userData', '', {
      maxAge: 0,
    });
    res.status(200);
    res.send('User has been logged out!');
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/status')
  status(@Res() res: Response) {
    res.status(200);
    res.send('User is verified!');
    return;
  }
}
