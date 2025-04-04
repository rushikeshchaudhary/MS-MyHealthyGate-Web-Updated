import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, ReplaySubject, BehaviorSubject } from "rxjs";
import { environment } from "../environments/environment";
import { map } from "rxjs/operators";

@Injectable()
export class SubDomainService {
  private subject = new BehaviorSubject<any>(null);
   subjectlogo = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {}

  // getSubDomainUrl() {
  //   let hostName = window.location.host;
  //   let subdomain = null;
  //   // @if running on localhost or (34.211.31.84:8017) server

  //   if (
  //     hostName === "localhost:4200" ||
  //     hostName === "mscore.stagingsdei.com:9608" || hostName === "www.corvushealthrec.com"
  //   ) {
  //     hostName = "Vedus";
  //   }


  //     subdomain = hostName;

  //   return subdomain;
  // }
  // Use this for local
     getSubDomainUrl() {
        let hostName = window.location.host;
        let fullUrlName = window.location.href;
        let subdomain = null;
    //    // @if running on localhost or (34.211.31.84:8017) server
      if (hostName === 'localhost:4200' || hostName === '34.211.31.84:8092' || hostName === '34.211.31.84:8093') {

           if (fullUrlName.includes('localhost:4200/webadmin') || fullUrlName.includes('34.211.31.84:8092/webadmin') || fullUrlName.includes('34.211.31.84:8093/webadmin'))
               hostName = '';
           else
               // hostName = 'lnc.smarthealth.net.in';               
                hostName = 'mscore.stagingsdei.com:9610';
               // hostName = 'staging-beacon.smarthealth.net.in';
       }
       const splitHostName = hostName.split('.');
       if (splitHostName.length >= 3) {
           subdomain = splitHostName[0];
       }
    //   return subdomain;
    return "myhealthygate";
    }
   //Use this for staging
     //getSubDomainUrl() {
     //    let hostName = window.location.host;
     //    let fullUrlName = window.location.href;
     //    let subdomain = null;
     //    const splitHostName = hostName.split('.');
     //    if (splitHostName.length >= 3) {
     //        subdomain = splitHostName[0];
     //        if (subdomain == 'staging-app')
     //            subdomain = '';
     //    }
     //    return subdomain;
     //}
    ///Use this for production
  //   getSubDomainUrl() {
  //     let hostName = window.location.host;
  //     let fullUrlName = window.location.href;
  //     let subdomain = null;
  //     const splitHostName = hostName.split('.');
  //     if (splitHostName.length >= 3) {
  //         subdomain = splitHostName[0];
  //         if (subdomain == 'app')
  //             subdomain = '';
  //     }
  //     return subdomain;
  // }

  getSubDomainInfo(): Observable<any> {
    return this.subject.asObservable();
  }

  setupVerifyBusinessResponse(response:any){
    if (response.statusCode === 200) {
      localStorage.setItem("business_token", response.data.businessToken);
      sessionStorage.setItem("logo","data:image/png;base64," +response.data.organization.logoBase64)
      sessionStorage.setItem("businessName",response.data.organization.businessName)

      
      setTimeout(() => {
        this.subjectlogo.next(true);
      }, 500);
     
      this.subject.next({ ...response.data });
      
    } else {
      localStorage.removeItem("business_token");
      this.subject.next(null);
    }
  }
  verifyBusinessName(domainName: string) {
    return this.http
      .get<any>(
        `${environment.api_url}/VerifyBusinessName?BusinessName=${domainName}`
      )
      .pipe(
        map(response => {
          if (response.statusCode === 200) {
            localStorage.setItem("business_token", response.data.businessToken);
            sessionStorage.setItem("logo","data:image/png;base64," +response.data.organization.logoBase64)
            sessionStorage.setItem("businessName",response.data.organization.businessName)

            
            setTimeout(() => {
              this.subjectlogo.next(true);
            }, 500);
           
            this.subject.next({ ...response.data });
            
          } else {
            localStorage.removeItem("business_token");
            this.subject.next(null);
          }
        })
      );
  }

  updateFavicon(faviconUrl: string) {
    let link: any =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = faviconUrl;
    document.getElementsByTagName("head")[0].appendChild(link);
  }
}
