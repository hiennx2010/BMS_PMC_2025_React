import { Injectable, CanActivate, ExecutionContext, Logger, HttpStatus } from "@nestjs/common";
import { BehaviorSubject, Observable } from "rxjs";
import { UserDetail } from "../../common-module/dto/user/user.dto";
import * as _ from "lodash";
import { RequestMapService } from "../service/request-map/request-map.service";
import { RequestMap } from "../entity/request-map/request-map.entity";
import { Request, Response } from "express";
import * as globToRegExp from 'glob-to-regexp'
import { ModuleRefUtils } from "src/common-module/utils/module-ref.utils";

/**
 * Kiểm tra role có quyền truy cập API không
 */
@Injectable()
export class RequestMapGuard implements CanActivate {
    /**
     * Có sử dụng Guard hay không
     */
    static active: boolean = true;

    static inited: boolean = false;

    static readonly log = new Logger(RequestMapGuard.name);

    public static get requestMapService(): RequestMapService {
        return ModuleRefUtils.getModuleRef('AdminModule').get(RequestMapService);
    }

    public static requestMapRegex: any = {};

    private static __requestMapBS: BehaviorSubject<RequestMap[]> = new BehaviorSubject([]);
    public static get requestMaps(): RequestMap[] {
        return RequestMapGuard.__requestMapBS.getValue();
    }

    constructor() {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return RequestMapGuard.active === false || this.validateRequest(request, response);
    }

    async validateRequest(request: Request, response: Response): Promise<any> {
        if (!RequestMapGuard.inited) {
            await RequestMapGuard.clearCacheRequestMap();
            RequestMapGuard.inited = true;
        }

        let userDetail: UserDetail = request['userDetail'];
        if (!userDetail) {
            userDetail = { username: 'anonymousUser' };
        }

        let logBody: boolean = true;

        let requestRoutePath: string = request.route['path'];

        let __requestMaps: RequestMap[] = RequestMapGuard.requestMaps.filter((requestMap) => {
            let regex: RegExp = RequestMapGuard.requestMapRegex[requestMap.uuid];
            let match: boolean = regex.test(requestRoutePath) && (_.isEmpty(requestMap.httpMethod) || (requestMap.httpMethod === request.method));
            let configAttributes = requestMap.configAttributes.split(',');
            match &&= configAttributes.includes('permitAll') || (userDetail?.authorities && (configAttributes.includes('isAuthenticated()') || _.difference(userDetail.authorities, configAttributes).length < userDetail.authorities.length));
            if (match) {
                logBody = logBody && requestMap.logBody;
            }
            return match;
        })

        let rs: boolean = __requestMaps.length > 0 || (__requestMaps.length === RequestMapGuard.requestMaps.length);

        RequestMapGuard.log.debug(`[${request['socket']['remoteAddress']}][${request.method}][${userDetail?.username}] ${requestRoutePath} --[${__requestMaps.map((requestMap) => { return requestMap.id })}]--> ${rs}`)
        if (logBody && rs) {
            RequestMapGuard.log.debug(`<-- [${request['socket']['remoteAddress']}][${request['method']}][${userDetail?.username}] ${requestRoutePath} | ${JSON.stringify(request['body'])}`);
        }

        /**
         * Xác định trả 401 hay 403
         */
        if (!rs && (!userDetail || userDetail.username === 'anonymousUser')) {
            response.status(HttpStatus.UNAUTHORIZED).send({
                "statusCode": HttpStatus.UNAUTHORIZED,
                "message": "Unauthorized",
                "error": "Unauthorized"
            });
        }

        return rs;
    }

    static async clearCacheRequestMap(): Promise<RequestMap[]> {
        RequestMapGuard.log.log('clearCacheRequestMap...');
        let res: RequestMap[] = await RequestMapGuard.requestMapService.entityRepository.find({
            where: {
                active: true,
                deleted: false
            }
        });

        RequestMapGuard.__requestMapBS.next(res);

        RequestMapGuard.requestMaps.forEach((requestMap: RequestMap) => {
            let regex: RegExp = globToRegExp(requestMap.url.trim());
            RequestMapGuard.requestMapRegex[requestMap.uuid] = regex;
        })
        RequestMapGuard.log.log('clearCacheRequestMap done');

        return RequestMapGuard.requestMaps;
    }
}