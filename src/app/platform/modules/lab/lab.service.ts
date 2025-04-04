import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonService } from "../core/services/common.service";
import { LabPaymentModel } from "./lab.model";

@Injectable({
  providedIn: "root",
})
export class LabService {
  private GetLabAppointmentUrl = "Labs/GetLabAppointment";
  private GetLAB_DashboardDetailsUrl = "Labs/GetLAB_DashboardDetails";
  private GetFilterLabAppointmentUrl = "Labs/GetFilterLabAppointment";
  private CancelLabAppointmentUrl = "Labs/CancelLabAppointment";
  private ApproveLabAppointmentUrl = "Labs/ApproveLabAppointment";
  private GetLabProfileData = "Labs/GetLabProfileData";
  private GetlabByIdUrl = "Labs/GetLabById";
  private GetRadiologyByIdURL = "Radiology/GetRadiologyById";
  private UpdateLabProfileUrl = "Labs/UpdateLabProfile";
  private UpdateRadiologyProfileUrl = "Radiology/UpdateRadiologyProfile";
  private UpdateRadiologyAddressUrl = "Radiology/UpdateRadiologyAddress";
  private DeleteRadiologyAddressUrl="Radiology/DeleteRadiologyAddress";
  
  private UpdateLabAddressUrl = "Labs/UpdateLabAddress";
  private DeleteLabAddressUrl = "Labs/DeleteLabAddress";
  private UpdateLabTimeIntervalUr = "Labs/UpdateLabTimeInterval";
  private SaveUpdateAvailabilityLabUrl = "Labs/SaveUpdateAvailabilityLab";
  private GetLabClientUrl = "Labs/GetLabClients";
  private GetLabPaymentsUrl = "Labs/GetLabPayments";
  private UpdateLabsFeesAndRefundsSettingsUrl="Labs/UpdateLabsFeesAndRefundsSettings";
  private GetLabsFeesAndRefundsSettingsUrl = "Labs/GetLabsFeesAndRefundsSettings";

  labAppointmentData: any;
  labDetails: any;

  constructor(private commonService: CommonService) {}

  UpdateLabProfile(data:any) {
    return this.commonService.post(this.UpdateLabProfileUrl, data);
  }

  UpdateRadiologyProfile(data:any) {
    return this.commonService.post(this.UpdateRadiologyProfileUrl, data);
  }
  UpdateLabAddress(data:any) {
    return this.commonService.post(this.UpdateLabAddressUrl, data);
  }
  UpdateRadiologyAddress(data:any) {
    return this.commonService.post(this.UpdateRadiologyAddressUrl, data);
  }
  UpdateTimeIntervalLab(data:any) {
    return this.commonService.post(this.UpdateLabTimeIntervalUr, data);
  }

  GetLabProfile(id:any) {
    return this.commonService.get(this.GetLabProfileData + `/${id}`);
  }
  GetLAB_DashboardDetails(data:any){
    return this.commonService.get(this.GetLAB_DashboardDetailsUrl + `?StaffID=${data.staffId}&TodaysDate=${data.todaysDate}&ThismonthStartDate=${data.thismonthStartDate}&ThismonthLastDate=${data.thismonthLastDate}&LastmonthStartDate=${data.lastmonthStartDate}&LastmonthLastDate=${data.lastmonthLastDate}`);
  }
  GetLabById(id:any) {
    return this.commonService.get(this.GetlabByIdUrl + `?Id=${id}`);
  }

  GetRadiologyById(id:any) {
    return this.commonService.get(this.GetRadiologyByIdURL + `?RadiologyId=${id}`);
  }

  GetLabAppointmentByLabId(labId:any, fromDate:any, toDate:any) {
    let url = `?labId=${labId}&fromDate=${fromDate}&toDate =${toDate}`;
    return this.commonService.get(this.GetLabAppointmentUrl + url);
  }
  GetFilterLabAppointmentByLabId(labId:any, status:any, fromDate:any, toDate:any, filters:any,bookingMode:any) {
    let url = `?labId=${labId}&status=${status}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${filters.pageNumber}&pageSize=${filters.pageSize}&sortColumn=${filters.sortColumn}&sortOrder=${filters.sortOrder}&searchText=${filters.searchText}&bookingModes=${bookingMode}`;
    return this.commonService.get(this.GetFilterLabAppointmentUrl + url);
  }
  cancelLabAppointment(data: any) {
    return this.commonService.post(this.CancelLabAppointmentUrl, data);
  }
  ApproveLabAppointment(data:any) {
    return this.commonService.patch(
      this.ApproveLabAppointmentUrl + "?appointmentId=" + data,
      {}
    );
  }

  setLabDetails = (data: any) => {
    this.labDetails = data;
  };
  getLabDetails = () => {
    return this.labDetails;
  };

  setLabAppointmentDetails = (data:any) => {
    this.labAppointmentData = data;
  };
  getLabAppointmentDetails = () => {
    return this.labAppointmentData;
  };

  deleteLabAddress(data:any) {
    return this.commonService.post(this.DeleteLabAddressUrl, data);
  }
  deleteRadiologyAddress(id:any){
    return this.commonService.get(this.DeleteRadiologyAddressUrl +`?AddressId=${id}`);
  }

  saveUpdateLabAvailability(data: any) {
    return this.commonService.post(this.SaveUpdateAvailabilityLabUrl, data);
  }
  getLabClient = (data:any) => {
    let url = `?labId=${data.labId}&searchText=${data.searchText}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}&sortColumn=${data.sortColumn}&sortOrder=${data.sortOrder}`;
    return this.commonService.get(this.GetLabClientUrl + url);
  };

  getAppointmentPayments(postData: LabPaymentModel): Observable<any> {
    return this.commonService.post(this.GetLabPaymentsUrl, postData, true);
  }

  updateLabFeeAndCancellationRules=(data:any)=>{
    return this.commonService.post(this.UpdateLabsFeesAndRefundsSettingsUrl,data);
  }
  getLabFeeAndCancellationRules=()=>{
    return this.commonService.get(this.GetLabsFeesAndRefundsSettingsUrl)
  }

}
