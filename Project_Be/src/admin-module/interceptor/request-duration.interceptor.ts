import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { IncomingMessage } from "http";
import { Observable, tap } from "rxjs";
import { InterceptorUtils } from "src/app-module/utils/interceptor/interceptor.utils";

@Injectable()
export class RequestDurationInterceptor implements NestInterceptor {
    private readonly log = new Logger(RequestDurationInterceptor.name);
    private readonly enabled: boolean = process.env['interceptor.request-duration.enabled'] === 'true';

    constructor() {
        if (this.enabled) InterceptorUtils.regHandler(this);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        return next.handle().pipe(tap(() => {
            let __in: IncomingMessage = context.getArgByIndex(0);
            this.log.debug(`[${__in.method}] ${__in['originalUrl']} +${Date.now() - now}ms`);
        }))
    }
}