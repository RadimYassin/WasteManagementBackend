import { Body, Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("sensor")
  getHello(@Body() data: any, @Res() res: Response) {
    console.log('Received data:', data);
  }
}
