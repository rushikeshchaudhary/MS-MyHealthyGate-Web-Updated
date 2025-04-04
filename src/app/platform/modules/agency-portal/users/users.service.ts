import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
import { FilterModel } from "../../core/modals/common-model";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Subject, BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import {
  UserModel,
  StaffPayrollRateModel,
  AddUserDocumentModel,
  StaffLeaveModel,
  AddProviderEducationalDocumentModel,
  UpdatePatAppointmentIdUserDocumentModel,
} from "./users.model";
import { StaffCustomLabel } from "./staff-custom-label.model";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private loginSubject = new BehaviorSubject<boolean>(false);
  loginState = this.loginSubject.asObservable();
  private loadingStateSubject = new Subject<boolean>();
  public loadingState = this.loadingStateSubject.asObservable();
  private getMasterDataURL = "api/MasterData/MasterDataByName";
  private getMasterDataByNameURL = "Home/MasterDataByName";
  private createURL = "Staffs/CreateUpdateStaff";
  private deleteURL = "Staffs/DeleteStaff";
  private getStaffByIdURL = "Staffs/GetStaffById";
  private getAllURL = "Staffs/GetStaffs";
  private getStaffsByCreatedByURL = "Staffs/GetStaffsByCreatedBy";
  private getStaffHeaderInfoURL = "Staffs/GetStaffHeaderData";
  private getStaffLeavesURL = "StaffLeave/GetStaffLeaveList";
  private updateLeaveStatusURL = "StaffLeave/UpdateLeaveStatus";
  private getStaffLeaveByIdURL = "StaffLeave/GetAppliedStaffLeaveById";
  private deleteStaffLeaveByIdURL = "StaffLeave/DeleteAppliedLeave";
  private DeleteUploadedImagesURL= "Staffs/DeleteUploadedImages?"
  private saveStaffLeaveURL = "StaffLeave/SaveStaffAppliedLeave";
  private getStateByCountryIDURL = "api/MasterData/GetStateByCountryID"
  private getStaffCustomLabelsURL = "StaffCustomLabel/GetStaffCustomLabels";
  private saveStaffCustomLabelsURL = "StaffCustomLabel/SaveCustomLabels";

  private getStaffLocationURL = "Staffs/GetAssignedLocationsById";
  private getStaffAvailabilityByLocationURL =
    "AvailabilityTemplates/GetStaffAvailabilityWithLocation";
  private getLabAvailabilityByLocationURL =
    "AvailabilityTemplates/GetLabAvailabilityWithLocation";
  private saveStaffAvailabilityByLocationURL =
    "AvailabilityTemplates/SaveUpdateAvailabilityWithLocation";

  private getStaffPayrollRateURL =
    "StaffPayrollRateForActivity/GetStaffPayRateOfActivity";
  private saveUpdatePayrollRateURL =
    "StaffPayrollRateForActivity/SaveUpdateStaffPayrollRateForActivity";

  private getUserDocumentsURL = "userDocument/GetUserDocuments";
  private getUserByLocationURL =
    "api/PatientAppointments/GetStaffAndPatientByLocation";
  private getUserDocumentURL = "userDocument/GetUserDocument";
  private deleteUserDocumentURL = "userDocument/DeleteUserDocument";
  private updateDocumentStatusURL =
    "userDocument/UpdateProviderEducationalDocumentStatus";
  private uploadUserDocumentURL = "userDocument/UploadUserDocuments";
  private UpdatePatientAppointmentDocumentsURL =
    "userDocument/UpdatePatientAppointmentDocuments";

  private getStaffProfileURL = "Staffs/GetStaffProfileData";

  private updateUserStatusURL = "user/UpdateUserStatus";
  private updateUserActiveStatusURL = "staffs/UpdateStaffActiveStatus";

  private getStaffExperienceURL = "Staffs/GetStaffExperience";
  private saveStaffExperienceURL = "Staffs/SaveUpdateStaffExperience";

  private deleteUserExperienceUrl = "Staffs/DeleteUserExperience";

  private getStaffQualificationURL = "Staffs/GetStaffQualifications";
  private deleteUserQualificationUrl = "Staffs/DeleteUserQualification";
  private deleteUserAwardUrl = "Staffs/DeleteUserAward";

  private saveStaffQualificationURL = "Staffs/SaveUpdateStaffQualifications";

  private newSaveStaffQualificationUrl = "Staffs/SaveStaffQualification";

  private getStaffAwardURL = "Staffs/GetStaffAwards";
  private saveStaffAwardURL = "Staffs/SaveUpdateStaffAwards";
  private updateProviderTimeIntervalURL = "Staffs/UpdateProviderTimeInterval/";
  private getprovidereductaionalDocumentsURL =
    "userDocument/GetProviderEducationalDocuments";
  private getprovidereductaionalDocumentsForPatientCheckinURL =
    "userDocument/GetprovidereductaionalDocumentsForPatientCheckin";
  private getCountryPhoneCodeUrl: string = "Home/GetCountryPhoneCode";
  constructor(private http: HttpClient, private commonService: CommonService) { }
  create(data: UserModel) {
    return this.commonService.post(this.createURL, data);
  }

  delete(id: number) {
    return this.commonService.patch(this.deleteURL + "/" + id, {});
  }
  deleteStaff(id: number) {
    return this.commonService.post(this.deleteURL + "?id=" + id, {});
  }

  getStaffLeaves(filterModel: FilterModel, staffId: number) {
    let url =
      this.getStaffLeavesURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&sortColumn=" +
      filterModel.sortColumn +
      "&sortOrder=" +
      filterModel.sortOrder +
      "&staffId=" +
      staffId +
      "&fromDate=" +
      "1990-01-01" +
      "&toDate=" +
      "2018-11-28";
    return this.commonService.getAll(url, {});
  }
  deleteStaffLeave(id: number) {
    return this.commonService.patch(
      this.deleteStaffLeaveByIdURL + "?StaffLeaveId=" + id,
      {}
    );
  }
  getStaffLeaveById(id: number) {
    return this.commonService.getById(
      this.getStaffLeaveByIdURL + "?StaffLeaveId=" + id,
      {}
    );
  }
  saveStaffLeave(data: StaffLeaveModel) {
    return this.commonService.post(this.saveStaffLeaveURL, data);
  }
  getAll(
    filterModel: FilterModel,
    tags: any,
    roleIds: any,
    locationId: number
  ) {
    let url =
      this.getAllURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&sortColumn=" +
      filterModel.sortColumn +
      "&sortOrder=" +
      filterModel.sortOrder +
      "&LocationIDs=" +
      locationId +
      "&searchKey=" +
      (filterModel.searchText || "") +
      "&RoleIds=" +
      roleIds +
      "&Tags=" +
      tags;
    return this.commonService.getAll(url, {});
  }

  getStaffsByCreatedByAll(
    filterModel: FilterModel,
    tags: any,
    roleIds: any,
    locationId: number
  ) {
    let url =
      this.getStaffsByCreatedByURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&sortColumn=" +
      filterModel.sortColumn +
      "&sortOrder=" +
      filterModel.sortOrder +
      "&LocationIDs=" +
      locationId +
      "&searchKey=" +
      (filterModel.searchText || "") +
      "&RoleIds=" +
      roleIds +
      "&Tags=" +
      tags;
    return this.commonService.getAll(url, {});
  }
  // getMasterData(value: string = "") {
  //   return this.commonService.post(this.getMasterDataURL, {
  //     masterdata: value
  //   });
  // }


  DeleteUploadedImages(id:any,type:any){
    
    return this.commonService.post(this.DeleteUploadedImagesURL + "Id=" + id + "&type="+ type,{});
    
  }

  getMasterData(
    value: string = "",
    isLoading: boolean = true,
    globalCodeId: any[] |null = []
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")!,
    });

    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.getMasterDataByNameURL + "?globalCodeId=" + globalCodeId
        }`,
        { masterdata: value },
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
  getStaffCustomLabels(staffId: number) {
    let url = this.getStaffCustomLabelsURL + "?staffId=" + staffId;
    return this.commonService.getAll(url, {});
  }
  getStaffById(id: number) {
    return this.commonService.getById(this.getStaffByIdURL + "?id=" + id, {},true);
  }

  getStaffHeaderInfo(id: number) {
    return this.commonService.getById(
      this.getStaffHeaderInfoURL + "?id=" + id,
      {}
    );
  }

  saveCustomLabels(data: StaffCustomLabel[]) {
    return this.commonService.post(this.saveStaffCustomLabelsURL, data);
  }
  getStaffLocations(staffId: number) {
    return this.commonService.getById(
      this.getStaffLocationURL + "?Id=" + staffId,
      {}
    );
  }
  getStaffAvailabilityByLocation(staffId: number, locationId: number, date: any, appointmentmode: any) {
    return this.commonService.getById(
      this.getStaffAvailabilityByLocationURL +
      "?staffId=" +
      staffId +
      "&locationId=" +
      locationId +
      "&appointmentmode=" + appointmentmode +
      "&date=" + date,
      {}
    );
  }
  getLabAvailabilityByLocation(labId: number, locationId: number) {
    return this.commonService.getById(
      this.getLabAvailabilityByLocationURL +
      "?labId=" +
      labId +
      "&locationId=" +
      locationId +
      "&isLeaveNeeded=false",
      {}
    );
  }
  saveStaffAvailability(data: any) {
    return this.commonService.post(
      this.saveStaffAvailabilityByLocationURL,
      data
    );
  }
  updateLeaveStatus(data: any) {
    return this.commonService.post(this.updateLeaveStatusURL, data);
  }

  getStaffPayrollRate(staffId: number) {
    return this.commonService.getById(
      this.getStaffPayrollRateURL + "?staffId=" + staffId,
      {}
    );
  }

  saveStaffPayrollRate(data: StaffPayrollRateModel[]) {
    return this.commonService.post(this.saveUpdatePayrollRateURL, data);
  }
  getUserDocuments(userId: number, from: string, toDate: string) {
    return this.commonService.getAll(
      this.getUserDocumentsURL +
      "?userId=" +
      userId +
      "&from=" +
      from +
      "&to=" +
      toDate,
      {}
    );
  }

  getUserByLocation(locationId: number) {
    let url =
      this.getUserByLocationURL +
      "?locationIds=" +
      locationId +
      "&permissionKey=SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES&isActiveCheckRequired=YES";
    return this.commonService.getAll(url, {});
  }
  
  getUserDocument(id: number) {
    return this.commonService.download(
      this.getUserDocumentURL + "?id=" + id,
      {}
    );
  }
  getDocumentForDownlod(id: number, key: any = "userdoc") {
    return this.commonService.get(
      this.getUserDocumentURL + "?id=" + id + "&key=" + key
    );
  }

  deleteUserDocument(id: number) {
    return this.commonService.patch(
      this.deleteUserDocumentURL + "?id=" + id,
      {}
    );
  }

  updateDocumentStatus(id: number, documentstatus: boolean) {
    //////debugger;
    return this.commonService.patch(
      //this.updateDocumentStatusURL + "?id=" + id +"&documentstatus"+documentstatus,
      this.updateDocumentStatusURL + "/" + id + "/" + documentstatus,
      {}
    );
  }

  uploadUserDocuments(data: AddUserDocumentModel) {
    //////debugger;
    return this.commonService.post(this.uploadUserDocumentURL, data);
  }

  updatePatientAppointmentDocuments(
    data: UpdatePatAppointmentIdUserDocumentModel[]
  ) {
    //////debugger;
    return this.commonService.post(
      this.UpdatePatientAppointmentDocumentsURL,
      data
    );
  }

  getStaffProfileData(id: number) {
    return this.commonService.getById(this.getStaffProfileURL + "/" + id, {});
  }


  
  downloadFile(blob: Blob, filetype: string, filename: string) {
    var newBlob = new Blob([blob], { type: filetype });
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    const nav = window.navigator as any;
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(newBlob);
      return;
    }
    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = data;
    link.download = filename;
    link.click();
    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(data);
    }, 100);
  }

  getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    return this.commonService.getUserScreenActionPermissions(
      moduleName,
      screenName
    );
  }

  updateUserStatus(userId: number, status: boolean) {
    return this.commonService.patch(
      this.updateUserStatusURL + "/" + userId + "/" + status,
      {}
    );
  }

  updateUserActiveStatus(staffId: number, status: boolean) {
    return this.commonService.patch(
      this.updateUserActiveStatusURL +
      "?staffId=" +
      staffId +
      "&isActive=" +
      status,
      {}
    );
  }

  getUserExperience(data:any) {
    let url =
      this.getStaffExperienceURL +
      "?pageNumber=" +
      data.pageNumber +
      "&pageSize=" +
      data.pageSize +
      "&SortColumn=" +
      data.sortColumn +
      "&SortOrder=" +
      data.sortOrder +
      "&searchCriteria=" +
      data.searchText +
      "&staffId=" +
      data.staffId;
    return this.commonService.getAll(url, {});
  }

  saveStaffExperience(data: any) {
    return this.commonService.post(this.saveStaffExperienceURL, data);
  }
  DeleteUserExperience = (data: any) => {
    return this.commonService.post(this.deleteUserExperienceUrl, data);
  };

  getUserQualification = (data: any) => {
    let url =
      this.getStaffQualificationURL +
      "?pageNumber=" +
      data.pageNumber +
      "&pageSize=" +
      data.pageSize +
      "&SortColumn=" +
      data.sortColumn +
      "&SortOrder=" +
      data.sortOrder +
      "&searchCriteria=" +
      data.searchText +
      "&staffId=" +
      data.staffId;

    return this.commonService.getAll(url, {});
  };

  DeleteUserQualification = (data: any) => {
    return this.commonService.post(this.deleteUserQualificationUrl, data);
  };

  saveStaffQualification(data: any) {
    return this.commonService.post(this.saveStaffQualificationURL, data);
  }

  newSaveStaffQualification(data: any) {
    return this.commonService.post(this.newSaveStaffQualificationUrl, data);
  }

  getUserAward(data: any) {
    let url =
      this.getStaffAwardURL +
      "?pageNumber=" +
      data.pageNumber +
      "&pageSize=" +
      data.pageSize +
      "&SortColumn=" +
      data.sortColumn +
      "&SortOrder=" +
      data.sortOrder +
      "&searchCriteria=" +
      data.searchText +
      "&staffId=" +
      data.staffId;
    return this.commonService.getAll(url, {});
  }

  saveStaffAward(data: any) {
    return this.commonService.post(this.saveStaffAwardURL, data);
  }

  DeleteUserAward = (data: any) => {
    return this.commonService.post(this.deleteUserAwardUrl, data);
  };

  updateProviderTimeInterval(id: string) {
    return this.commonService.put(this.updateProviderTimeIntervalURL + id, {});
  }

  getprovidereductaionalDocuments(
    userId: number,
    from: string,
    toDate: string
  ) {
    return this.commonService.getAll(
      this.getprovidereductaionalDocumentsURL +
      "?userId=" +
      userId +
      "&from=" +
      from +
      "&to=" +
      toDate,
      {}
    );
  }

  getprovidereductaionalDocumentsForPatientCheckin(staffid: number) {
    return this.commonService.getAll(
      this.getprovidereductaionalDocumentsForPatientCheckinURL +
      "?staffid=" +
      staffid,

      {}
    );
  }

  uploadProviderEducationalDocuments(
    data: AddProviderEducationalDocumentModel
  ) {
    //////debugger;
    return this.commonService.post(this.uploadUserDocumentURL, data);
  }

  getStateByCountryId(id: number) {
    return this.commonService.getById(
      this.getStateByCountryIDURL + "?countryID=" + id,
      {}
    );
  }
  getCountriesPhoneCode(countryId: number) {
    return this.commonService.getAll(`${this.getCountryPhoneCodeUrl}?countryId=${countryId}`, {})
  }
}
