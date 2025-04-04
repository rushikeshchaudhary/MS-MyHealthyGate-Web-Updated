import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, ReplaySubject, Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { LoginUser } from "../modals/loginUser.modal";
import { environment } from "../../../../environments/environment";
import { NgxSpinnerService } from "ngx-spinner";
import { SuperAdminDataModel } from "src/app/platform/modules/core/modals/common-model";
import { AdsModel } from "../../manage-ads/manage-ads.component";
import { ManageLabs } from "../../manage-labs/manage-labs.model";
import { ManagePharmacy } from "../../manage-pharmacy/manage-pharmacy.model";
import { ProviderModel } from "../../manage-providers/provider-model.model";
import { StaticPageModel } from "../../manage-static-page/manage-static-page.component";

@Injectable()
export class CommonService {
  private SytemInfoSubject = new BehaviorSubject<any>({});
  public sytemInfo = this.SytemInfoSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public loginUserSubject = new BehaviorSubject<LoginUser>({} as LoginUser);
  public loginUser = this.loginUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public loginSecuritySubject = new BehaviorSubject<any>({} as object);
  public loginSecurity = this.loginSecuritySubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private loadingStateSubject = new BehaviorSubject<boolean>(false);
  public loadingState = this.loadingStateSubject.asObservable();

  // for update the client side navigations ...
  private updateClientNavigationSubject = new BehaviorSubject<
    any
  >(null as unknown as number);
  public updateClientNavigation = this.updateClientNavigationSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(private http: HttpClient, private SpinnerService: NgxSpinnerService) {
    SystemIpAddress.then(value => {
      this.SytemInfoSubject.next({ ipAddress: value });
    }).catch(e => console.error(e));
  }
  setLoadinState(isLoading: boolean = false) {
    this.loadingStateSubject.next(isLoading);
  }
  initializeAuthData():any {
    if (localStorage.getItem("super-user-token")) {
      return this.http
        .get<any>(`${environment.api_url}/GetUserByToken`)
        .subscribe(response => {
          // login successful if there's a jwt token in the response
          if (response && response.access_token) {
            this.setAuth(response);
          } else {
            this.purgeAuth();
          }
          return response;
        });
    }
    return;
  }
  isValidFileType(fileName: string, fileType: 'video' | 'image' | 'pdf' | 'excel' | 'xml'): boolean {
    // Define the extension lists
    const extensionLists: { [key: string]: string[] } = {
      video: ["m4v", "avi", "mpg", "mp4"],
      image: ["jpg", "jpeg", "bmp", "png", "ico"],
      pdf: ["pdf"],
      excel: ["xls", "xlsx"],
      xml: ["xml"]
    };
  
    // Get the extension of the selected file
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
  
    // Check if the file type and extension are valid
    return fileExtension ? extensionLists[fileType].includes(fileExtension) : false;
  }
  
  logout() {
    // remove user from local storage to log user out
    this.purgeAuth();
  }

  setAuth(user: LoginUser) {
    localStorage.setItem("super-user-token", JSON.stringify(user.access_token));
    // Set current user data into observable
    this.loginUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    localStorage.removeItem("super-user-token");
    // Set current user to an empty object
    this.loginUserSubject.next({} as LoginUser);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
    localStorage.clear();
  }

  getLoginUserInfo(): LoginUser {
    return this.loginUserSubject.value;
  }

  getCurrentLoginLocationId(): string {
    let locationId: string = "";
    const loginData: LoginUser = this.loginUserSubject.value;
    if (loginData && loginData.data) {
      locationId =
        loginData.data.staffLocation[0] &&
        loginData.data.staffLocation[0].locationID;
    }
    return locationId.toString();
  }

  getSystemIpAddress(): string {
    return this.SytemInfoSubject.value && this.SytemInfoSubject.value.ipAddress;
  }

  updateClientNaviagations(clientId: number) {
    this.updateClientNavigationSubject.next(clientId);
  }

  get getAdditionalHeaders(): string {
    // const additionalHeaders = JSON.stringify({
    //   Offset: new Date().getTimezoneOffset().toString(),
    //   Timezone: calculateTimeZone(),
    //   IPAddress: this.getSystemIpAddress()
    // });
    const additionalHeaders = JSON.stringify({
        Offset: new Date().getTimezoneOffset().toString(),
        Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        IPAddress: this.getSystemIpAddress()
      });
    return additionalHeaders;
  }

  post(url: string, data: ManageLabs | SuperAdminDataModel | AdsModel | ManagePharmacy | ProviderModel | StaticPageModel): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders
    });
    return this.http.post<any>(`${environment.api_url}/${url}`, data, {
      headers: headers
    });
  }

  put(url: any, data: any): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders
    });
    return this.http.put<any>(`${environment.api_url}/${url}`, data, {
      headers: headers
    });
  }

  getById(url: string, data: any): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders
    });
    this.SpinnerService.show();
    this.loadingStateSubject.next(true);
    return this.http
      .get<any>(`${environment.api_url}/${url}`, { headers: headers })
      .pipe(
        map(res => {
          this.loadingStateSubject.next(false);
          this.SpinnerService.hide();

          return res;
        })
      );
  }

  getAll(url: string, data: any): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders
    });
    this.SpinnerService.show();
    this.loadingStateSubject.next(true);
    return this.http
      .get<any>(`${environment.api_url}/${url}`, { headers: headers })
      .pipe(
        map(res => {
          this.loadingStateSubject.next(false);
          this.SpinnerService.hide();
          return res;
        })
      );
  }

  getAllNotification(url: string, data: any, isLoading: boolean = true): Observable<any> {
    //  this.SpinnerService.show();
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(`${environment.api_url}/${url}`, { headers: headers })
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          //   this.SpinnerService.hide();
          return res;
        })
      );
  }

  postWithNoLoader(url: string, data: any, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });
    /*if(isLoading){
    this.SpinnerService.show();
    isLoading && this.loadingStateSubject.next(true);
    }*/

    return this.http
      .post<any>(`${environment.api_url}/${url}`, data, { headers: headers })
      .pipe(
        map((res) => {
          /*   if(isLoading){
          isLoading && this.loadingStateSubject.next(false);
          this.SpinnerService.hide();
          }*/
          return res;
        })
      );
  }

  delete(url: any, data: any): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders
    });
    return this.http.delete<any>(`${environment.api_url}/${url}`, {
      headers: headers
    });
  }
  patch(url: string, data: any): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders
    });
    this.SpinnerService.show();
    this.loadingStateSubject.next(true);
    return this.http
      .patch<any>(`${environment.api_url}/${url}`, data, { headers: headers })
      .pipe(
        map(res => {
          this.loadingStateSubject.next(false);
          this.SpinnerService.hide();
          return res;
        })
      );
  }

  download(url: any, headers: any): Observable<Blob> {
    return this.http.get(`${environment.api_url}/${url}`, {
      headers: headers,
      responseType: "blob"
    });
  }

 
}

const SystemIpAddress = new Promise(r => {
  const w: any = window,
    a = new (w.RTCPeerConnection ||
      w.mozRTCPeerConnection ||
      w.webkitRTCPeerConnection)({ iceServers: [] }),
    b = () => { };
  a.createDataChannel("");
  a.createOffer((c: any) => a.setLocalDescription(c, b, b), b);
  a.onicecandidate = (c: { candidate: { candidate: { match: (arg0: RegExp) => unknown[]; }; }; }) => {
    try {
      c.candidate.candidate
        .match(
          /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
        )
        .forEach(r);
    } catch (e) { }
  };
});

function calculateTimeZone(dateInput?: Date): string {
  var dateObject = dateInput || new Date(),
    dateString = dateObject + "",
    tzAbbr: any =
      // Works for the majority of modern browsers
      dateString.match(/\(([^\)]+)\)$/) ||
      // IE outputs date strings in a different format:
      dateString.match(/([A-Z]+) [\d]{4}$/);

  if (tzAbbr) {
    // Old Firefox uses the long timezone name (e.g., "Central
    // Daylight Time" instead of "CDT")
    tzAbbr = tzAbbr[1];
  }
  return tzAbbr;
}
