import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { json } from 'body-parser'
@Injectable()
export class LoginMiddleware implements NestMiddleware {
    public async use(req: Request, res: Response, next: Function) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) throw new UnauthorizedException({ isError: true, message: 'Login required' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            throw new UnauthorizedException({ isError: true, message: 'Login required' });
        }
        next(); 
      });
  }
}