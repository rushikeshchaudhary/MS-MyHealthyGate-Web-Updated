import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
import { Observable } from "rxjs";

const getQueryParamsFromObject = (filterModal: any): string => {
  let queryParams = "";
  let index = 0;
  for (const key of Object.keys(filterModal)) {
    if (index === 0) queryParams += `?${key}=${filterModal[key]}`;
    else queryParams += `&${key}=${filterModal[key]}`;

    index++;
  }
  return queryParams;
};

@Injectable({
  providedIn: "root",
})
export class SchedulerService {
  getMasterDataURL = "api/MasterData/MasterDataByName";
  getAllProvidersForDDL = "Staffs/GetAllProvidersForDDL";
  getAllURL = "api/PatientAppointments/GetPatientAppointmentList";
  getMyAppointmentUrl = "api/PatientAppointments/GetMyAppointmentList";
  getStaffAndPatientByLocationURL =
    "api/PatientAppointments/GetStaffAndPatientByLocation";
  getStaffAvailabilityURL =
    "AvailabilityTemplates/GetStaffAvailabilityWithLocation";
  addAvailibilitySlot = "AvailabilityTemplates/AddAvailibilitySlot";
  private getAvailabilityById = "AvailabilityTemplates/GetAvailabilityById";
  private deleteAvailibilitySlot =
    "AvailabilityTemplates/DeleteAvailibilitySlot";
  getProviderAvailability = "AvailabilityTemplates/GetProviderAvailability";
  getMinMaxOfficeTimeURL = "MasterLocations/GetMinMaxOfficeTime";
  getPatientsURL = "Patients/GetPatients";
  checkIsValidAppointmentURL =
    "api/PatientAppointments/CheckIsValidAppointmentWithLocation";
  checkAuthorizationDetailsURL =
    "api/PatientAppointments/GetPatientAuthorizationData";
  getDataForSchedulerURL =
    "api/PatientAppointments/GetDataForSchedulerByPatient";
  createAppointmentURL = "api/PatientAppointments/SavePatientAppointment";
  createAppointmentFromPatientPortalURL =
    "PatientPortalAppointment/SavePatientAppointment";
  bookNewAppointmentFromPatientPortalURL =
    "PatientPortalAppointment/BookNewAppointment";
  bookNewAppointmentFromPatientPortalURL1 =
    "PatientPortalAppointment/BookNewAppointment1";
  RescheduleAppointmentURL = "PatientPortalAppointment/RescheduleAppointment";
  getAppointmentDetailURL = "api/PatientAppointments/GetAppointmentDetails";
  getAppointmentDetailsAsListURL =
    "api/PatientAppointments/GetAppointmentDetailsAsList";
  deleteAppointmentDetailURL = "api/PatientAppointments/DeleteAppointment";
  cancelAppointmentURL = "api/PatientAppointments/CancelAppointments";
  unCancelAppointmentURL = "api/PatientAppointments/ActivateAppointments";
  updateAppointmentStatusURL =
    "api/PatientAppointments/UpdateAppointmentStatus";
  UpdatePatientAppointmentForLabURL =
    "api/PatientAppointments/UpdatePatientAppointmentForLab";
  updateCallDurationURL = "api/PatientAppointments/UpdateCallDuration";
  bookNewFreeAppointmentFromPatientPortalURL =
    "PatientPortalAppointment/BookNewFreeAppointment";
  getAppointmentDetailsWithPatientURL =
    "api/PatientAppointments/GetAppointmentDetailsWithPatient";
  getStaffFeeSettingsURL = "Staffs/GetStaffFeeSettings?id=";
  getGetLastNewAppointmentURL =
    "api/PatientAppointments/GetLastNewAppointment?providerId=";
  GetPreviousAppointmentURL = "api/PatientAppointments/GetPreviousAppointment";
  // bookNewAppointmentFromPaymentPageURL = "PatientPortalAppointment/BookNewAppointmentFromPaymentPage";
  bookNewAppointmentFromPaymentPageURL =
    "Home/BookNewAppointmentFromPaymentPage";
  checkAppointmentTimeExpiryURL = "Home/CheckAppointmentTimeExpiry";
  bookNewUrgentCareAppointmentFromPatientPortalURL =
    "PatientPortalAppointment/BookUrgentCareAppointment";
  urgentCareRefundAppointmentFeeURL =
    "PatientPortalAppointment/UrgentCareRefundAppointmentFee";
  SaveSymptomatePatientReportURL = "Payers/SaveSymptomatePatientReport";
  private getStaffAvailabilityByLocationURL =
    "AvailabilityTemplates/GetStaffAvailabilityWithLocation";
  getLastUrgentCareCallStatusURL =
    "api/PatientAppointments/GetLastUrgentCareCallStatus?userId=";
  getLastUrgentCareCallStatusForPatientPortalURL =
    "api/PatientAppointments/GetLastUrgentCareCallStatusForPatientPortal?userId=";
  GetLastPatientFollowupDetailsURL =
    "api/PatientAppointments/GetLastPatientFollowupDetails?userId=";
  getLastPatientFollowupWithCurrentPovider =
    "api/PatientAppointments/GetLastPatientFollowupWithCurrentPovider";
  getAllfilteredApptURL = "api/PatientAppointments/GetFilteredAppointmentList";
  checkFollowupURL = "api/PatientAppointments/CheckFollowUpAppointment";
  checkFollowupFees = "api/PatientAppointments/CheckPatientFollowupFees";
  private checkoutPayment = "api/PatientAppointments/CheckoutPayment";
  private getAppointmentListForPatientsURL =
    "api/PatientAppointments/GetAppointmentListForPatients";
  ProviderBlockCalenderTimeUrl =
    "AvailabilityTemplates/ProviderBlockCalenderTime";

  GetProviderBlockCalendarUrl =
    "AvailabilityTemplates/GetProviderBlockCalendar";
  GetProviderBlockCalendarDocumentUrl =
    "AvailabilityTemplates/GetProviderBlockCalendarDocument";

  DeleteProviderBlockCalendarUrl =
    "AvailabilityTemplates/DeleteProviderBlockCalendar";
  GetPaymentStatusUrl = "api/PatientAppointments/GetPaymentStatus";

  constructor(private commonService: CommonService) {}

  getMasterData(masterData: any): Observable<any> {
    return this.commonService.post(this.getMasterDataURL, masterData);
  }

  getListData(filterModal: any): Observable<any> {
    // ?locationIds=1&fromDate=2018-11-11&toDate=2018-11-17&staffIds=3
    const queryParams = getQueryParamsFromObject(filterModal);

    return this.commonService.getAll(this.getAllURL + queryParams, {});
  }
  getMyAppointment(filterModal: any): Observable<any> {
    const queryParams = getQueryParamsFromObject(filterModal);
    return this.commonService.getAll(
      this.getMyAppointmentUrl + queryParams,
      null,
      true
    );
  }
  getAppointmentListForPatients(filterModel: any): Observable<any> {
    const queryParams = getQueryParamsFromObject(filterModel);
    return this.commonService.getAll(
      this.getAppointmentListForPatientsURL + queryParams,
      {}
    );
  }
  getAllProviders(): Observable<any> {
    return this.commonService.getAll(this.getAllProvidersForDDL, {});
  }

  getStaffAndPatientByLocation(
    locationIds: string,
    permissionKey: string = "SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES"
  ): Observable<any> {
    const queryParams = `?locationIds=${locationIds}&permissionKey=${permissionKey}&isActiveCheckRequired=YES`;
    return this.commonService.getAll(
      this.getStaffAndPatientByLocationURL + queryParams,
      {}
    );
  }

  getStaffAvailability(
    staffIds: string,
    locationId: string,
    appointmentMode: any
  ): Observable<any> {
    const queryParams = `?staffId=${staffIds}&locationId=${locationId}&appointmentMode=${appointmentMode}`;
    return this.commonService.getAll(
      this.getStaffAvailabilityURL + queryParams,
      {}
    );
  }

  getMinMaxOfficeTime(locationIds: string): Observable<any> {
    const queryParams = `?locationIds=${locationIds}`;
    return this.commonService.getAll(
      this.getMinMaxOfficeTimeURL + queryParams,
      {}
    );
  }

  getPatientsByLocation(
    searchText: string,
    locationIds: string
  ): Observable<any> {
    // http://108.168.203.227/HC_Patient_Merging/Patients/GetPatients
    const queryParams = `?searchKey=${searchText}&locationIDs=${locationIds}&pageSize=5&isActive=true`;
    return this.commonService.getAll(this.getPatientsURL + queryParams, {});
  }

  getDataForScheduler(filterModal: any): Observable<any> {
    const queryParams = getQueryParamsFromObject(filterModal);
    return this.commonService.getAll(
      this.getDataForSchedulerURL + queryParams,
      {}
    );
  }

  checkIsValidAppointment(appointmentData: any): Observable<any> {
    const postJson = appointmentData;
    return this.commonService.post(this.checkIsValidAppointmentURL, postJson);
  }

  checkAuthorizationDetails(filterModal: any): Observable<any> {
    const queryParams = getQueryParamsFromObject(filterModal);
    return this.commonService.getAll(
      this.checkAuthorizationDetailsURL + queryParams,
      {}
    );
  }

  createAppointment(appointmentData: any, params: any): Observable<any> {
    const queryParams = getQueryParamsFromObject(params);
    const postJson = appointmentData;
    return this.commonService.post(
      this.createAppointmentURL + queryParams,
      postJson
    );
  }

  createAppointmentFromPatientPortal(appointmentData: any): Observable<any> {
    const postJson = appointmentData;
    return this.commonService.post(
      this.createAppointmentFromPatientPortalURL,
      postJson
    );
  }
  bookNewAppointmentFromPatientPortal(appointmentData: any): Observable<any> {
    const postJson = appointmentData;
    return this.commonService.post(
      this.bookNewAppointmentFromPatientPortalURL,
      postJson
    );
  }

  bookNewAppointmentFromPatientPortal1(appointmentData: any): Observable<any> {
    const postJson = appointmentData;
    return this.commonService.post(
      this.bookNewAppointmentFromPatientPortalURL1 + "?a=2",
      { a: 1 }
    );
  }

  RescheduleAppointment(appointmentData: any): Observable<any> {
    const postJson = appointmentData;
    return this.commonService.post(this.RescheduleAppointmentURL, postJson);
  }
  bookNewFreeAppointmentFromPatientPortal(
    appointmentData: any
  ): Observable<any> {
    const postJson = appointmentData;
    return this.commonService.post(
      this.bookNewFreeAppointmentFromPatientPortalURL,
      postJson
    );
  }

  bookNewAppointmentFromPaymentPage(appointmentData: any): Observable<any> {
    const postJson = appointmentData;
    return this.commonService.post(
      this.bookNewAppointmentFromPaymentPageURL,
      postJson
    );
  }

  getAppointmentDetails(appointmentId: number): Observable<any> {
    const queryParams = `?appointmentId=${appointmentId}`;
    return this.commonService.getById(
      this.getAppointmentDetailURL + queryParams,
      {}
    );
  }

  getAppointmentDetailsWithPatient(appointmentId: number): Observable<any> {
    const queryParams = `?appointmentId=${appointmentId}`;
    return this.commonService.getById(
      this.getAppointmentDetailsWithPatientURL + queryParams,
      {}
    );
  }

  deleteAppointmentDetails(
    appointmentId: number,
    parentAppointmentId: number,
    deleteSeries: boolean,
    isAdmin: boolean
  ): Observable<any> {
    const queryParams = `?appointmentId=${appointmentId}&parentAppointmentId=${parentAppointmentId}&deleteSeries=${deleteSeries}&isAdmin=${isAdmin}`;
    return this.commonService.patch(
      this.deleteAppointmentDetailURL + queryParams,
      {}
    );
  }

  cancelAppointment(appointmentData: any): Observable<any> {
    return this.commonService.post(this.cancelAppointmentURL, appointmentData);
  }

  unCancelAppointment(appointmentId: number): Observable<any> {
    const queryParams = `?appointmentId=${appointmentId}`;
    return this.commonService.patch(
      this.unCancelAppointmentURL + queryParams,
      {}
    );
  }

  updateAppointmentStatus(appointmentData: any): Observable<any> {
    return this.commonService.post(
      this.updateAppointmentStatusURL,
      appointmentData
    );
  }
  updatePatientAppointmentForLab(appointmentData: any): Observable<any> {
    return this.commonService.post(
      this.UpdatePatientAppointmentForLabURL,
      appointmentData
    );
  }

  getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    return this.commonService.getUserScreenActionPermissions(
      moduleName,
      screenName
    );
  }
  UpdateCallDuration(
    appointmentId: number,
    timeDuration: string
  ): Observable<any> {
    const queryParams = `?appointmentId=${appointmentId}&timeDuration=${timeDuration}`;
    return this.commonService.post(
      this.updateCallDurationURL + queryParams,
      {}
    );
  }

  getStaffFeeSettings(staffId: number): Observable<any> {
    return this.commonService.get(this.getStaffFeeSettingsURL + staffId, true);
  }

  getGetLastNewAppointment(providerId: string): Observable<any> {
    return this.commonService.get(
      this.getGetLastNewAppointmentURL + providerId,
      true
    );
  }
  getPreviousAppointment(
    providerId: string,
    patientId: number
  ): Observable<any> {
    const queryParams = `?providerId=${providerId}&clientId=${patientId}`;
    return this.commonService.post(
      this.GetPreviousAppointmentURL + queryParams,
      {}
    );
  }

  checkAppointmentTimeExpiry(appointmentId: number): Observable<any> {
    const queryParams = `?appointmentId=${appointmentId}`;
    return this.commonService.patch(
      this.checkAppointmentTimeExpiryURL + queryParams,
      {}
    );
  }

  getAppointmentDetailsAsList(appointmentId: number): Observable<any> {
    const queryParams = `?appointmentId=${appointmentId}`;
    return this.commonService.getById(
      this.getAppointmentDetailsAsListURL + queryParams,
      {}
    );
  }

  bookUrgentCareAppointmentFromPatientPortal(
    appointmentData: any
  ): Observable<any> {
    const postJson = appointmentData;
    return this.commonService.post(
      this.bookNewUrgentCareAppointmentFromPatientPortalURL,
      postJson
    );
  }

  urgentCareRefundAppointmentFee(appointmentId: number): Observable<any> {
    const queryParams = `?appointmentId=${appointmentId}`;
    return this.commonService.post(
      this.urgentCareRefundAppointmentFeeURL + queryParams,
      {}
    );
  }

  SaveSymptomatePatientReport(data: any) {
    return this.commonService.post(this.SaveSymptomatePatientReportURL, data);
  }
  saveAvailibilitySlot(data: any) {
    return this.commonService.post(this.addAvailibilitySlot, data);
  }

  GetAvailabilityById(data: any) {
    return this.commonService.get(`${this.getAvailabilityById}?id=${data}`);
  }
  DeleteAvailibilitySlot(data: any) {
    return this.commonService.post(this.deleteAvailibilitySlot, data);
  }
  GetProviderAvailability(startDate: any, endDate: any) {
    return this.commonService.get(
      `${this.getProviderAvailability}?startDate=${startDate}&endTime=${endDate}`,
      true
    );
  }

  getLastUrgentCareCallStatus(userId: string): Observable<any> {
    return this.commonService.get(
      this.getLastUrgentCareCallStatusURL + userId,
      true
    );
  }
  getLastUrgentCareCallStatusForPatientPortal(userId: string): Observable<any> {
    return this.commonService.get(
      this.getLastUrgentCareCallStatusForPatientPortalURL + userId,
      true
    );
  }
  GetLastPatientFollowupDetails(patientId: any): Observable<any> {
    return this.commonService.get(
      this.GetLastPatientFollowupDetailsURL + patientId,
      true
    );
  }
  GetLastPatientFollowupWithCurrentPovider(
    patinetUserId: string,
    providerId: any,
    appointmentDate: any,
    isNotification: boolean
  ): Observable<any> {
    const queryParams = `?userId=${patinetUserId}&staffId=${providerId}&appointmentDate=${appointmentDate}&isNotification=${isNotification}`;
    return this.commonService.get(
      this.getLastPatientFollowupWithCurrentPovider + queryParams
    );
  }

  getStaffAvailabilityByLocation(
    staffId: number,
    locationId: number,
    appointmentMode: any
  ) {
    return this.commonService.getById(
      this.getStaffAvailabilityByLocationURL +
        "?staffId=" +
        staffId +
        "&locationId=" +
        locationId +
        "&appointmentMode=" +
        appointmentMode,
      {}
    );
  }

  getfilteredAppointmentListData(filterModal: any): Observable<any> {
    // ?locationIds=1&fromDate=2018-11-11&toDate=2018-11-17&staffIds=3
    const queryParams = getQueryParamsFromObject(filterModal);

    return this.commonService.getAll(
      this.getAllfilteredApptURL + queryParams,
      {}
    );
  }
  checkfollowupAppointment(id: number): Observable<any> {
    const queryParams = `?AppointmentId=${id}`;
    return this.commonService.get(this.checkFollowupURL + queryParams);
  }
  checkFollowupPricewhichoneapply(
    patinetUserId: string,
    providerId: any,
    appointmentDate: any
  ): Observable<any> {
    const queryParams = `?PatientId=${patinetUserId}&StaffId=${providerId}&appointmentDate=${appointmentDate}`;
    return this.commonService.get(this.checkFollowupFees + queryParams);
  }

  checkoutPaymentForAppointment(amount: string): Observable<any> {
    const queryParams = `?amount=${amount}`;
    return this.commonService.get(this.checkoutPayment + queryParams);
  }

  HyperPayPaymentStatus(checloutId: string): Observable<any> {
    const queryParams = `?checkoutId=${checloutId}`;
    return this.commonService.get(this.GetPaymentStatusUrl + queryParams);
  }

  SaveProviderBlockCalenderTime(data: any) {
    return this.commonService.post(this.ProviderBlockCalenderTimeUrl, data);
  }

  getProviderBlockCalenderTime(startDate: any, endDate: any): Observable<any> {
    // `${this.GetProviderBlockCalendarUrl}?startDate=${startDate}&endTime=${endDate}`,
    // true
    return this.commonService.getAll(
      `${this.GetProviderBlockCalendarUrl}?startDate=${startDate}&endTime=${endDate}`,
      true
    );
  }

  DeleteProviderBlockCalendarApi(id: number): Observable<any> {
    const queryParams = `?id=${id}`;
    return this.commonService.patch(
      this.DeleteProviderBlockCalendarUrl + queryParams,
      {}
    );
  }

  getProviderBlockCalenderDocument(id: number): Observable<any> {
    const queryParams = `?id=${id}`;
    return this.commonService.get(
      this.GetProviderBlockCalendarDocumentUrl + queryParams
    );
  }
}
