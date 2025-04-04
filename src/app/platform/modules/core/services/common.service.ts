import { ICDCodeService } from "./../../agency-portal/masters/icd-codes/icd-code.service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, ReplaySubject, Observable, Subject } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { LoginUser, ProfileSetupModel } from "../modals/loginUser.modal";
import { environment } from "../../../../../environments/environment";
// import base64 from "base-64";
//import utf8 from "utf8";
import { AppointmentViewComponent } from "../../scheduling/appointment-view/appointment-view.component";
import { SaveDocumentComponent } from "src/app/front/save-document/save-document.component";
import { NgxSpinnerService } from "ngx-spinner";
// import * as base64 from "base-64";
//  import * as utf8 from "utf8";

import { Buffer } from 'buffer';

@Injectable()
export class CommonService {
  public callStartStopSubject = new BehaviorSubject(false);
  public callStartStopShareSubject = this.callStartStopSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private videoSessionStartedSubject = new BehaviorSubject<any>({
    IsStarted: false,
  });
  public videoSessionStarted = this.videoSessionStartedSubject
    .asObservable()
    .pipe(distinctUntilChanged());
  private SytemInfoSubject = new BehaviorSubject<any>({});
  public sytemInfo = this.SytemInfoSubject.asObservable().pipe(
    distinctUntilChanged()
  );

  public loginUserSubject = new BehaviorSubject<LoginUser>({} as LoginUser);
  public loginUser = this.loginUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  //   public currentUserSubject = new BehaviorSubject<any>({} as object);
  // public currentUser = this.currentUserSubject
  //   .asObservable()
  //   .pipe(distinctUntilChanged());

  public currentLoginUserInfoSubject = new BehaviorSubject<any>(null);
  public currentLoginUserInfo = this.currentLoginUserInfoSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public loginSecuritySubject = new BehaviorSubject<any>({} as object);
  public loginSecurity = this.loginSecuritySubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public profileMatChngTabSubject = new Subject<string>();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  private isPatientSubject = new BehaviorSubject<boolean>(false);
  public isPatient = this.isPatientSubject.asObservable();
  private isDoctorSubject = new BehaviorSubject<boolean>(false);
  public isDoctor = this.isDoctorSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string>("");
  public userRole = this.userRoleSubject.asObservable();
  public isShowLoaderToSpecificURL: boolean = false;
  public loadingStateSubject = new Subject<boolean>();
  public loadingState = this.loadingStateSubject.asObservable();
  private checkStaffProfile = "Staffs/CheckStaffProfile?id=";
  // for update the client side navigations ...
  private updateClientNavigationSubject = new BehaviorSubject<any>({} as any);
  public updateClientNavigation = this.updateClientNavigationSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private _isProfileComplete = new BehaviorSubject<ProfileSetupModel>(
    {} as ProfileSetupModel
  );
  isProfileComplete = this._isProfileComplete.asObservable();

  public _isHistoryShareable = new BehaviorSubject<boolean>(false);
  public isHistoryShareable = this._isHistoryShareable.asObservable();
  private pendingAppointmentSubject = new BehaviorSubject<any>('0');
  pendingAppointment$ = this.pendingAppointmentSubject.asObservable();
  private inboxCountSubject = new BehaviorSubject<any>('0');
  inboxCount$ = this.inboxCountSubject.asObservable();
  public _isAppointmentCompleted = new BehaviorSubject<boolean>(false);
  public isAppointmentCompleted = this._isAppointmentCompleted.asObservable();
  //showCompleteProfileMessage$ = this.showCompleteProfileMessageSubject.asObservable();
  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService
  ) {
    SystemIpAddress.then((value) => {
      this.SytemInfoSubject.next({ ipAddress: value });
    }).catch((e) => console.error(e));


  }
  setIsProfileComplete(data: any) {
    this._isProfileComplete.next(data);
  }

  setPendingAppointment(value: any) {


    this.pendingAppointmentSubject.next(value);

  }





  getPendingAppointment() {
    return this.pendingAppointmentSubject.getValue();
  }

  setInboxCount(value: any) {
    this.inboxCountSubject.next(value);

  }

  getInboxCount(): any {
    return this.inboxCountSubject.getValue();
  }

  videoSession(isStarted: boolean) {
    if (!isStarted) localStorage.removeItem("otSession");
    this.videoSessionStartedSubject.next({ IsStarted: isStarted });
  }

  changeCallStartStopStatus(value: boolean) {
    this.callStartStopSubject.next(value);
  }

  getFullName(firstName: string, middleName: string, lastName: string) {
    return middleName != undefined
      ? lastName != ""
        ? firstName + " " + middleName + " " + lastName
        : firstName + " " + middleName
      : firstName + " " + lastName;
  }
  initializeAuthData():any {
    if (localStorage.getItem("access_token")) {
      return this.http
        .get<any>(`${environment.api_url}/GetUserByToken`)
        .subscribe((response:any) => {
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

  isValidFileType(fileName: any, fileType: any): boolean {
    // Create an object for all extension lists
    // let extentionLists: {
    //   video: string[],
    //   image: string[],
    //   pdf: string[],
    //   excel: string[],
    //   xml: string[],
    // } = {
    //   video: [],
    //   image: [],
    //   pdf: [],
    //   excel: [],
    //   xml: [],
    // }; 
    const extensionLists: { [key: string]: string[] } = {
      video: ["m4v", "avi", "mpg", "mp4"],
      image: ["jpg", "jpeg", "bmp", "png", "ico"],
      pdf: ["pdf"],
      excel: ["xls", "xlsx","excel"],
      xml: ["xml"]
    };
    let isValidType = false;
    // extentionLists.video = ["m4v", "avi", "mpg", "mp4"];
    // extentionLists.image = ["jpg", "jpeg", "bmp", "png", "ico"];
    // extentionLists.pdf = ["pdf"];
    // extentionLists.excel = ["excel"];
    // extentionLists.xml = ["xml"];
    //get the extension of the selected file.
    let fileExtension = fileName.split(".").pop().toLowerCase();
    isValidType = extensionLists[fileType].indexOf(fileExtension) > -1;
    return isValidType;
  }
  logout() {
    // remove user from local storage to log user out
    this.purgeAuth();
  }

  setAuth(user: LoginUser) {
    // const userRoleName =
    //   user.data.users3 && user.data.users3.userRoles.userType;
    // if ((userRoleName || "").toUpperCase() != "CLIENT")
    //   this.isProfileUpdated(user.data.id);
    localStorage.setItem("access_token", JSON.stringify(user.access_token));
    // Set current user data into observable
    this.loginUserSubject.next(user);
    let locationid =
      user.data.staffLocation &&
      user.data.staffLocation[0] &&
      user.data.staffLocation[0].locationID;
    this.currentLoginUserInfoSubject.next({
      ...user.data,
      currentLocationId:
        locationid == undefined ? user.data.locationID : locationid,
      userLocations: user.userLocations || [],
    });
    // this.currentLoginUserInfoSubject.next({
    //   ...user.data,
    //   currentLocationId:
    //     user.data.staffLocation &&
    //     user.data.staffLocation[0] &&
    //     user.data.staffLocation[0].locationID,
    //   userLocations: user.userLocations || [],
    // });
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
    const userRoleName =
      user.data.users3 && user.data.users3.userRoles.userType;
    this.userRoleSubject.next(userRoleName);
  }
  setIsPatient(isPatient: boolean = true) {
    this.isPatientSubject.next(isPatient);
  }

  endCallsession(isDoctor: boolean = true) {
    var keys = Object.keys(localStorage);
    keys.forEach((val) => {
      if (val.indexOf("called") > -1) {
        localStorage.removeItem(val);
      }
    });
  }
  purgeAuth() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("apptId");
    localStorage.removeItem("isPatient");
    localStorage.removeItem("opentok_client_id");
    localStorage.removeItem("UserId");
    localStorage.removeItem("payment_token");
    localStorage.removeItem("UserRole");
    localStorage.removeItem("staffdob");

    // Set current user to an empty object
    this.loginUserSubject.next({} as LoginUser);

    this.currentLoginUserInfoSubject.next(null);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
    return
    //localStorage.clear();
  }

  setSecurityQuestions(securityQuestionObj: object) {
    this.loginSecuritySubject.next(securityQuestionObj);
  }

  getLoginUserInfo(): any {
    return this.loginUserSubject.value;
  }
  setCurrentUser(user: any) {
    debugger
    localStorage.setItem("UserId", user.userID);
    // ////debugger;
    if (user.users1 != null)
      localStorage.setItem("UserRole", user.users1.userRoles.userType);
    else localStorage.setItem("UserRole", user.users3.userRoles.userType);
    // this.currentUserSubject.next(user);
  }
  // getCurrentUser(): any {
  //   return this.currentUserSubject.value;
  // }

  getCurrentLoginLocationId(): string {
    let locationId: string = "";
    const loginData: any = this.currentLoginUserInfoSubject.value;
    if (loginData) {
      locationId = loginData.currentLocationId || 0;
    }
    return locationId.toString();
  }

  getSystemIpAddress(): string {
    return this.SytemInfoSubject.value && this.SytemInfoSubject.value.ipAddress;
  }

  updateCurrentLoginUserInfo(locationId: number) {
    const loginData: any = this.currentLoginUserInfoSubject.value;
    if (loginData) {
      const newUserObj = {
        ...loginData,
        currentLocationId: locationId,
      };
      this.currentLoginUserInfoSubject.next(newUserObj);
    }
  }

  updateClientNaviagations(clientId: number, userId: number) {
    this.updateClientNavigationSubject.next({ clientId, userId });
  }

  get getAdditionalHeaders(): string {
    // const additionalHeaders = JSON.stringify({
    //   Offset: new Date().getTimezoneOffset().toString(),
    //   Timezone: calculateTimeZone(),
    //   IPAddress: this.getSystemIpAddress(),
    //   LocationID: this.getCurrentLoginLocationId(),
    //   BusinessToken: localStorage.getItem("business_token"),
    // });
    const additionalHeaders = JSON.stringify({
      Offset: new Date().getTimezoneOffset().toString(),
      Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      IPAddress: this.getSystemIpAddress(),
      LocationID: this.getCurrentLoginLocationId(),
      BusinessToken: localStorage.getItem("business_token"),
    });
    return additionalHeaders;
  }

  videoPost(url: any, data: any, isLoading: boolean = true): Observable<any> {
    let headers = new HttpHeaders({
      "Content-Type": "multipart/form-data",
      enctype: "multipart/form-data",
    });

    this.SpinnerService.show();
    isLoading && this.loadingStateSubject.next(true);

    return this.http
      .post<any>(`${environment.api_url}/${url}`, data, { headers: headers })
      .pipe(
        map((res:any) => {
          //if(isLoading){
          isLoading && this.loadingStateSubject.next(false);
          this.SpinnerService.hide();
          //}
          return res;
        })
      );
  }

  post(url: any, data: any, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });

    this.SpinnerService.show();
    isLoading && this.loadingStateSubject.next(true);

    return this.http
      .post<any>(`${environment.api_url}/${url}`, data, { headers: headers })
      .pipe(
        map((res:any) => {
          //if(isLoading){
          isLoading && this.loadingStateSubject.next(false);
          this.SpinnerService.hide();
          //}
          return res;
        })
      );
  }

  postWithNoLoader(url: any, data: any, isLoading: boolean = true): Observable<any> {
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
        map((res:any) => {
          /*   if(isLoading){
          isLoading && this.loadingStateSubject.next(false);
          this.SpinnerService.hide();
          }*/
          return res;
        })
      );
  }

  get(url: any, isLoading: boolean = false): Observable<any> {
    isLoading && this.loadingStateSubject.next(true);
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });
    this.SpinnerService.show();
    return this.http
      .get<any>(`${environment.api_url}/${url}`, {
        headers: headers,
      })
      .pipe(
        map((res:any) => {
          isLoading && this.loadingStateSubject.next(false);
          this.SpinnerService.hide();
          return res;
        })
      );
  }

  put(url: any, data: any): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });
    return this.http.put<any>(`${environment.api_url}/${url}`, data, {
      headers: headers,
    });
  }

  getById(url: any, data: any, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });
    if (url.includes("CheckStaffProfile")) {
      isLoading && this.loadingStateSubject.next(false);
    } else {
      isLoading && this.loadingStateSubject.next(true);
    }
    // this.SpinnerService.show();

    //console.log('loader open :',url)
    this.isShowLoaderToSpecificURL = false;
    // if(url.includes('GetStaffById') && !this.isShowLoaderToSpecificURL){
    //   this.isShowLoaderToSpecificURL=true;
    // }
    return this.http
      .get<any>(`${environment.api_url}/${url}`, { headers: headers })
      .pipe(
        map((res:any) => {
          if (!this.isShowLoaderToSpecificURL) {
            isLoading && this.loadingStateSubject.next(false);
            // this.SpinnerService.hide();
            //console.log('loader close isGetStaffById false:',url);
          }
          if (this.isShowLoaderToSpecificURL) {
            // console.log('loader close isGetStaffById true response :',url);
            // this.SpinnerService.show();
            this.loadingStateSubject.next(true);
            if (url.includes("GetStaffById")) {
              //   console.log('loader close isGetStaffById response false :',url);
              isLoading && this.loadingStateSubject.next(false);
              // this.SpinnerService.hide();
              // this.isShowLoaderToSpecificURL=false;
            }
          }
          return res;
        })
      );
  }

  getAll(url: any, data: any, isLoading: boolean = true): Observable<any> {
    this.SpinnerService.show();
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(`${environment.api_url}/${url}`, { headers: headers })
      .pipe(
        map((res:any) => {
          isLoading && this.loadingStateSubject.next(false);
          this.SpinnerService.hide();
          return res;
        })
      );
  }

  delete(url: any): Observable<any> {

    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });
    return this.http.delete<any>(`${environment.api_url}/${url}`, {
      headers: headers,
    });
  }
  patch(url: any, data: any, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .patch<any>(`${environment.api_url}/${url}`, data, { headers: headers })
      .pipe(
        map((res:any) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  download(url: any, headers: any): Observable<Blob> {
    return this.http.get(`${environment.api_url}/${url}`, {
      headers: headers,
      responseType: "blob",
    });
  }

  calculateFileSizehandler(files: any): boolean {
    let totalFileSize = 0;
    let fileSizeInKB: any;
    // @desc - define const max upload file size 5MB
    let totalFileSizeInMB: any;
    const fileSize5MB = "5.00";
    files.map((obj: any, i: any) => {
      totalFileSize = totalFileSize + obj.size;
      totalFileSizeInMB = (totalFileSize / 1024 / 1024).toFixed(2);
      fileSizeInKB = Math.round(obj.size / 1024); // converted bytes(incoming file size) to KB.
      // 1024kb = 1MB
      let fileSizeInMB = Math.round(obj.size / 1024 / 1024);
      let fileSizeInMBFixTo2Decimal = fileSizeInMB.toFixed(2);
      return fileSizeInKB >= 1024
        ? `${fileSizeInMBFixTo2Decimal}MB`
        : `${fileSizeInKB}KB`;
    });

    if (
      parseFloat(fileSizeInKB) === 0.0 ||
      parseFloat(totalFileSizeInMB) > parseFloat(fileSize5MB)
    ) {
      return false;
    } else {
      return true;
    }
  }

  encryptValue(value: any, isEncrypt: boolean = true): any {
    let response: any;
    if (value != null && value != "") {
      let pwd = "HCPRODUCT#!_2018@";
      let bytes: any;
      if (isEncrypt) {
        //old
        // bytes = utf8.encode(value.toString());
        // response = base64.encode(bytes);
       
        //new
        // Convert to UTF-8 bytes
        bytes = Buffer.from(value.toString(), 'utf-8');
        // Encode bytes to base64
        response = bytes.toString('base64');
        //response = CryptoJS.AES.encrypt(JSON.stringify(value), pwd);
      } else {
        //old
        // bytes = base64.decode(value);
        // response = utf8.decode(bytes);

        //new
        // Decode base64 to bytes
        bytes = Buffer.from(value, 'base64');
        // Convert bytes to UTF-8 string
        response = bytes.toString('utf-8');
        // const bytes = CryptoJS.AES.decrypt(value, pwd);
        // if (bytes.toString()) {
        //   response= JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        // }
        //      response = CryptoJS.AES.decrypt(value, pwd);//.toString(CryptoJS.enc.Utf8);
      }
    }
    return response;
  }

  getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    const returnObj = {} as Record<string, any>;
    const loginData: LoginUser = this.loginUserSubject.value;
    if (loginData.userPermission) {
      const modules = loginData.userPermission.modulePermissions || [],
        screens = loginData.userPermission.screenPermissions || [],
        actions = loginData.userPermission.actionPermissions || [],
        userRoleName =
          loginData.data.users3 && loginData.data.users3.userRoles.userType,
        isAdminLogin = (userRoleName || "").toUpperCase() === "ADMIN";

      const moduleobj = modules.find((obj: any) => obj.moduleKey == moduleName);
      const screenObj = screens.find(
        (obj: any) =>
          obj.screenKey == screenName &&
          obj.moduleId == (moduleobj && moduleobj.moduleId)
      );

      const actionPermissions =
        actions.filter(
          (obj: any) => obj.screenId == (screenObj && screenObj.screenId)
        ) || [];

      actionPermissions.forEach((obj: any) => {
        returnObj[obj.actionKey] = obj.permission || isAdminLogin;
      });
    }
    return returnObj;
  }
  getProfileUpdated(staffId: number): Observable<any> {
    return this.getById(this.checkStaffProfile + staffId, null, false);
  }
  isProfileUpdated(staffId: number) {
    if (staffId !== null || staffId !== undefined) {
      this.getProfileUpdated(staffId).subscribe((res:any) => {
        if (res.statusCode == 200) {
          this.setIsProfileComplete(res.data as ProfileSetupModel);
        } else {
          let profile = new ProfileSetupModel();
          this.setIsProfileComplete(profile);
        }
      });
    }

    return false;
  }

  isRoutePermission(routeName: string): boolean {
    //this.isProfileUpdated(this.loginUserSubject.value.data.id);
    var changedRouteName = routeName.replace("/web", "");
    if (routeName.indexOf("webadmin") > -1) {
      changedRouteName = routeName.replace("/webadmin", "");
    }
    if (changedRouteName.length) {
      const index = changedRouteName.indexOf("?");
      changedRouteName = changedRouteName.substring(
        0,
        index != -1 ? index : changedRouteName.length
      );
    }
    let permission = false;
    // Added Exception as per discussoon with Rishi- User Can Add/Edit his profile without Role permission.
    if (changedRouteName == "/manage-users/user-profile") {
      permission = true;
      return permission;
    }
    const loginData: LoginUser = this.loginUserSubject.value,
      userRoleName =
        loginData.data &&
        loginData.data.users3 &&
        loginData.data.users3.userRoles.userType;
    if (
      loginData.userPermission &&
      ((userRoleName || "").toUpperCase() == "STAFF" ||
        (userRoleName || "").toUpperCase() == "PROVIDER" ||
        (userRoleName || "").toUpperCase() == "RADIOLOGY" ||
        (userRoleName || "").toUpperCase() == "LAB" ||
        (userRoleName || "").toUpperCase() == "PHARMACY" ||
        (userRoleName || "").toUpperCase() == "ADMIN")
    ) {
      const modules = loginData.userPermission.modulePermissions || [],
        screens = loginData.userPermission.screenPermissions || [],
        isAdminLogin = (userRoleName || "").toUpperCase() == "ADMIN";

      const moduleobj = modules.find(
        (obj: any) => obj.navigationLink == changedRouteName
      );
      if (moduleobj) {
        permission = moduleobj.permission || isAdminLogin;
      } else {
        // routing changes due to some conditions ....
        if (changedRouteName.includes("/Masters"))
          changedRouteName = changedRouteName.replace("/Masters", "");
        if (changedRouteName.includes("/manage-users"))
          changedRouteName = changedRouteName.replace("/manage-users", "");
        if (changedRouteName.includes("/payment"))
          changedRouteName = changedRouteName.replace("/payment", "");
        if (changedRouteName.includes("/Billing"))
          changedRouteName = changedRouteName.replace("/Billing", "");
        if (changedRouteName.includes("/Logs"))
          changedRouteName = changedRouteName.replace("/Logs", "");

        const screenObj = screens.find(
          (obj: any) => obj.navigationLink == changedRouteName
        );
        permission = (screenObj && screenObj.permission) || isAdminLogin;
      }

      if (changedRouteName == "/user" && !permission) {
        const encryptId = decodeURIComponent(routeName).replace(
          "/web/manage-users/user?id=",
          ""
        ),
          decUserId =
            encryptId &&
            !encryptId.includes("/web/manage-users/user") &&
            this.encryptValue(encryptId, false);
        permission = true;
      }

      if (changedRouteName == "/adduser" && !permission) {
        const encryptId = decodeURIComponent(routeName).replace(
          "/web/manage-users/adduser?id=",
          ""
        ),
          decUserId =
            encryptId &&
            !encryptId.includes("/web/manage-users/adduser") &&
            this.encryptValue(encryptId, false);
        permission = true;
      }
    }

    return permission;
  }
  stDate!: Date;
  edDate!: Date;
  checkAvailablityofCallTime(startDateTime: string, endDateTime: string) {
    let currentDate = new Date();
    this.stDate = new Date(startDateTime);
    // this.stDate = new Date(
    //   this.stDate.setMinutes(this.stDate.getMinutes() - 10)
    // );
    this.edDate = new Date(endDateTime);
    let apptDuration = this.diff_minutes(this.edDate, this.stDate);
    let currDuration = this.diff_minutes(currentDate, this.stDate);
    console.log("apptDuration currDuration ", apptDuration, currDuration);
    if (currDuration > 0 && apptDuration >= currDuration) {
      return true;
    }
    return false;
  }
  diff_minutes(dt2: any, dt1: any) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.round(diff);
  }
  isRoutePermissionForClient(routeName: string): boolean {
    routeName = routeName.replace("/web", "");
    if (routeName.length) {
      const index = routeName.indexOf("?");
      routeName = routeName.substring(
        0,
        index != -1 ? index : routeName.length
      );
    }
    if (routeName == "admin/client/my-profile") {
      return true;
    }
    let permission: boolean = false;
    const loginData: LoginUser = this.loginUserSubject.value,
      userRoleName =
        loginData.data &&
        loginData.data.users3 &&
        loginData.data.users3.userRoles.userType;
    const roles = ["CLIENT", "LAB", "PHARMACY"];
    if (
      !loginData.userPermission &&
      roles.includes((userRoleName || "").toUpperCase())
    ) {
      const screens = [
        { navigationLink: "/client/dashboard", permission: true },
        { navigationLink: "/client/raiseticket", permission: true },
        { navigationLink: "/client/my-scheduling", permission: true },
        // { navigationLink: "/client/payment-history", permission: true },
        // { navigationLink: "/client/refund-history", permission: true },
        { navigationLink: "/client/payment", permission: true },
        { navigationLink: "/client/payment/payment-history", permission: true },
        { navigationLink: "/client/payment/refund-history", permission: true },
        { navigationLink: "/client/payment/card-history", permission: true },
        { navigationLink: "/client/my-profile", permission: true },
        { navigationLink: "/client/my-care-library", permission: true },
        { navigationLink: "/client/waiting-room", permission: true },
        { navigationLink: "/client/history", permission: true },
        {
          navigationLink: "/client/history/my-family-history",
          permission: true,
        },
        {
          navigationLink: "/client/history/my-social-history",
          permission: true,
        },
        //{ navigationLink: "/client/my-family-history", permission: true },
        //{ navigationLink: "/client/my-social-history", permission: true },
        { navigationLink: "/client/my-vitals", permission: true },
        { navigationLink: "/client/my-documents", permission: true },
        { navigationLink: "/client/mailbox", permission: true },
        { navigationLink: "/client/assigned-documents", permission: true },
        { navigationLink: "/client/soap-note", permission: true },
        { navigationLink: "/client/client-profile", permission: true },
        { navigationLink: "/client/address", permission: true },
        { navigationLink: "/client/review-rating", permission: true },
        { navigationLink: "/client/review-ratingList", permission: true },
        { navigationLink: "/client/symptom-checker", permission: true },
      ];

      const screenObj = screens.find((obj) => obj.navigationLink == routeName);
      permission = screenObj && screenObj.permission !== undefined
        ? screenObj.permission
        : false;
    }
    return permission;
  }

  parseStringToHTML(str: any) {
    var dom = document.createElement("div");
    dom.innerHTML = str;
    return dom.firstChild;
  }

  profileMatTabValChange(data: any) {
    //passing the data as the next observable
    this.profileMatChngTabSubject.next(data);
  }
}

const SystemIpAddress = new Promise((r) => {
  const w: any = window,
    a = new (w.RTCPeerConnection ||
      w.mozRTCPeerConnection ||
      w.webkitRTCPeerConnection)({ iceServers: [] }),
    b = () => { };
  a.createDataChannel("");
  a.createOffer((c: any) => a.setLocalDescription(c, b, b), b);
  a.onicecandidate = (c: any) => {
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
