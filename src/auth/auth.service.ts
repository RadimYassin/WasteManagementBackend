import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // Generate a 6-digit verification code
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Random 6-digit number
  }

  // User Registration with Email Verification
  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verificationCode = this.generateVerificationCode();

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
        verificationCode, // Store the 6-digit code
        isActive: false,
        createdAt: new Date(), // Store the creation time of the code
      },
    });

    await this.sendVerificationCode(user.email, verificationCode);
    return { message: 'User registered. Please check your email to verify your account.' };
  }

  // Send Verification Code via Email
  async sendVerificationCode(email: string, code: string) {
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
      text: `Your verification code is: ${code}. It will expire in 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  }

  // Verify User Account with 6-Digit Code
  async verifyAccount(code: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationCode: code },
    });

    if (!user) {
      throw new HttpException(
        { message: "Invalid or expired code" },
        HttpStatus.BAD_REQUEST
      );
    }

    const isCodeExpired = Date.now() - user.createdAt.getTime() > 15 * 60 * 1000; // 15 minutes
    if (isCodeExpired) {
      throw new HttpException(
        { message: "Code expired" },
        HttpStatus.BAD_REQUEST
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isActive: true, verificationCode: null },
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
    }

    if (!user.isActive) {
      throw new HttpException(
        { message: "Account is not verified. Check your email" },
        HttpStatus.UNAUTHORIZED
      );
    }

    const payload = { userId: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { message: 'Login successful', accessToken: token };
  }
}