import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  serviceObject(){
    return 'Soap WSDL Potencial Tecnologia'
  }

  get(){
    
  }
}
