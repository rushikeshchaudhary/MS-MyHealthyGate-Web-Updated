import { CommonService } from "./../../platform/modules/core/services/common.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FilterModel } from "src/app/super-admin-portal/core/modals/common-model";

@Injectable({
  providedIn: "root",
})
export class AddNewCallerService {
  private getStaffDetailsByNameUrl = "Staffs/GetStaffsByName?name=";
  private getOTSessionByAppointmentIdUrl =
    "api/Telehealth/GetOTSessionByApptId?appointmentId=";
  private inviteNewPersonUrl = "GroupSession/SaveInvitation";
  private getInvitedMemberListUrl = "GroupSession/GetInvitedMemberList";
  constructor(private commonService: CommonService) {}
  getStaffDetailsByName(name: string = ""): Observable<any> {
    return this.commonService.getAll(
      `${this.getStaffDetailsByNameUrl}${name}`,
      {}
    );
  }
  getOTSessionByAppointmentId(apptId: number = 0): Observable<any> {
    return this.commonService.getAll(
      `${this.getOTSessionByAppointmentIdUrl}${apptId}`,
      {}
    );
  }
  inviteNewPerson(data: any): Observable<any> {
    return this.commonService.post(`${this.inviteNewPersonUrl}`, data);
  }

  getInvitedMemberList(filterModel: any) {
    const URL =
      this.getInvitedMemberListUrl +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&patientId=" +
      filterModel.patientId;
    return this.commonService.getAll(URL, {});
  }
}
