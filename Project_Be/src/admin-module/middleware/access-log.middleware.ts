
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
    private readonly log = new Logger(AccessLogMiddleware.name);

    use(request: Request, res: Response, next: NextFunction) {
        next();
    }
}