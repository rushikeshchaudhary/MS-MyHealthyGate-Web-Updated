import { Injectable, Injector } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let additionalHeaders;

    try {
      additionalHeaders = req.headers.get("additionalHeaders") || "";
    } catch (error) {
      additionalHeaders = "";
    }
    let headerJson = (additionalHeaders && JSON.parse(additionalHeaders)) || {};
    // console.log(headerJson)
    // if (headerJson) {
    //   headerJson = Object.entries(headerJson).reduce((newObj, [key, val]) => {
    //     if (newObj[key] == "business_token" && val === null) {
    //       //console.log('interceptor => headerJson => business', localStorage.getItem("business_token"));
    //       newObj[key] = localStorage.getItem("business_token");
    //     }
    //     newObj[key] = val === null ? "" : val;

    //     return newObj;
    //   }, {});
    // }
    if (headerJson) {
      headerJson = Object.entries(headerJson).reduce((newObj: { [key: string]: any }, [key, val]) => {
        if (newObj[key] === "business_token" && val === null) {
          newObj[key] = localStorage.getItem("business_token");
        }
        newObj[key] = val === null ? "" : val;
    
        return newObj;
      }, {});
    }
    
    let headersConfig = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headerJson,
    };

    if (
      req.url.includes("Staffs/UploadStaffVideo") ||
      req.url.includes("Dicom/UploadDicomFile")
    ) {
      headersConfig = {};
    } else {
      headersConfig = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headerJson,
      };
    }

    if (localStorage.getItem("access_token")) {
      const token = JSON.parse(localStorage.getItem("access_token")!);
      headersConfig["Authorization"] = `Bearer ${token}`;
    }
    const request = req.clone({ setHeaders: headersConfig });

    return next.handle(request);
  }
}
