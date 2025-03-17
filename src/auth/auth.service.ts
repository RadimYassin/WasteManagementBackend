
import { Injectable,  HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // User Registration with Email Verification
  async register(dto:  RegisterDto) {

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');


    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
        throw new HttpException(
          { message: "User already exists" }, 
          HttpStatus.BAD_REQUEST
        );
      }
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        verificationToken,
        isActive: false,
      },
    });

    await this.sendVerificationEmail(user.email, verificationToken);
    return { message: 'User registered. Please check your email to verify your account.' };
  }

  // Send Verification Email
  async sendVerificationEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Account',
      text: `Click the link to verify your account: ${process.env.APP_URL}/auth/verify?token=${token}`,
    };

    await transporter.sendMail(mailOptions);
  }

  // Verify User Account
  async verifyAccount(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {


      throw new HttpException(
                  { message: "Invalid or expired token" }, 
                  HttpStatus.BAD_REQUEST
               );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isActive: true, verificationToken: null },
    });

    return { message: 'Account verified successfully' };
  }

  // Login with JWT
  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        throw new HttpException(
            { message: "Invalid credentials" }, 
            HttpStatus.UNAUTHORIZED
          );

    //   throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
        throw new HttpException(
            { message: "Account is not verified. Check your email" }, 
            HttpStatus.UNAUTHORIZED
          );
        
    //   throw new UnauthorizedException('Account is not verified. Check your email.');
    }

    const payload = { userId: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { message: 'Login successful', accessToken: token };
  }
}
