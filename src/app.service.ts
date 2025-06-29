import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  createworled(name: string): string {
    return `welcome to ${name}`;
  }
}
