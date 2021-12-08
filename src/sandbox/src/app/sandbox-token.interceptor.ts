import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SandboxTokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const TOKEN = localStorage.getItem('TOKEN');
    if (TOKEN) {
      return next.handle(req.clone({
        setHeaders: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }));
    }

    return next.handle(req);
  }
}
