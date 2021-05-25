import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
var soap = require('soap');
var fs = require('fs-extra');
var data = new Date();
var dia     = data.getDate();
var mes     = data.getMonth();
var ano    = data.getFullYear();
var hora    = data.getHours();
var min     = data.getMinutes();
var seg     = data.getSeconds();
var str_data = dia + '/' + (mes+1) + '/' + ano;
var str_hora = hora + ':' + min + ':' + seg;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // the splitter function, used by the service
  function splitter_function(args) {
    let logger = new Logger('Message Recebimento')
    logger.log(`[${str_data} ${str_hora}]${args.message}`)
    fs.appendFile("./log.txt", args.message+ "\n", function (err) {
        if (err) console.log(err);
    });
    return {
      result: 'conectado'
    }
  }

  var xml = fs.readFileSync('/var/www/html/node-soap/src/service.wsdl', 'utf8');

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

  let app2 = await app.listen(6000);
  var wsdl_path = "/wsdl";

  await soap.listen(app2, wsdl_path, serviceObject, xml);
}
bootstrap();