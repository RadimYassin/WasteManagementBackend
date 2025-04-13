import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'mysecret',
    });
  }

  async validate(payload: { userId: string,role:string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });



    if (!user) {
        throw new HttpException(
          { message: "User not found ." }, 
          HttpStatus.UNAUTHORIZED
        );
      }

    return user; 
  }
}
