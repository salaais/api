import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('hello') // Define o caminho base para o controlador
export class HelloController {
    @Get() // Define o método HTTP GET
    getHello(@Res() res: Response): void {
        res.status(200).json({ message: 'Hello from Vercel!' });
    }
}
