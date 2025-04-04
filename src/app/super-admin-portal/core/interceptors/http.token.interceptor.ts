import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headersConfig: { [header: string]: string | string[] } = {};

    if (!req.url.includes('MasterTestimonial/UploadProfilePic') && !req.url.includes('Staffs/UploadStaffVideo')) {
      headersConfig = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
    }

    const token = localStorage.getItem('super-user-token');
    if (token) {
      headersConfig['Authorization'] = `Bearer ${JSON.parse(token)}`;
    }

    const request = req.clone({ setHeaders: headersConfig });

    return next.handle(request);
  }
}
