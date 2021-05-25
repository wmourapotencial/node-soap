import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
var soap = require('soap');
var fs = require('fs-extra');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // the splitter function, used by the service
  function splitter_function(args) {
    let logger = new Logger('Message Recebimento')
    logger.log(`${args.message}`)
    fs.appendFile("./log.txt", args.message+ "\n", function (err) {
        if (err) console.log(err);
    });
    return {
      result: 'conectado'
    }
  }

  var xml = fs.readFileSync('/Users/xitaomoura/Projetos/soap-nestjs/src/service.wsdl', 'utf8');

  // the service
  var serviceObject = {
  MessageRecebimentoService: {
        MessageRecebimentoServiceSoapPort: {
            MessageRecebimento: splitter_function
        },
        MessageRecebimentoServiceSoap12Port: {
            MessageRecebimento: splitter_function
        }
    }
  };

  let app2 = await app.listen(3000);
  var wsdl_path = "/wsdl";

  await soap.listen(app2, wsdl_path, serviceObject, xml);
}
bootstrap();