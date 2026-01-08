
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtProvider } from 'src/common-module/utils/auth-provider/jwt.provider';
import { UserDetail } from '../../common-module/dto/user/user.dto';
import * as _ from 'lodash';
import { MemCacheAdapter } from 'src/common-module/utils/cache/mem-cache-adapter';
import { IAuthProvider } from 'src/common-module/utils/auth-provider/i-auth.provider';
import { AuthUtils } from 'src/common-module/utils/auth-provider/auth.utils';

@Injectable()
export class JWTParseMiddleware implements NestMiddleware {
    readonly log: Logger = new Logger(JWTParseMiddleware.name);

    constructor(jwtProvider: JwtProvider, private cacheManager: MemCacheAdapter) {
        AuthUtils.authProviders.push(jwtProvider);
    }

    public static regProvider(provider: IAuthProvider) {
        AuthUtils.authProviders.push(provider)
    }

    async use(req: Request, res: Response, next: NextFunction) {
        let userDetail: UserDetail = await this.validateRequest(req);
        if (userDetail) {
            req['userDetail'] = userDetail;
        }
        next();
    }

    async validateRequest(request: any): Promise<UserDetail> {
        let authorization: string = request.headers['authorization']
        if (_.isEmpty(authorization) || !authorization.startsWith('Bearer')) {
            return;
        }
        let accessToken = authorization.substring(7);
        return AuthUtils.getUserDetail(accessToken);
    }
}