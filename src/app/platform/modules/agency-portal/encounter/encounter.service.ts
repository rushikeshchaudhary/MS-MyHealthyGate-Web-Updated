import { Injectable, ElementRef } from '@angular/core';
import { CommonService } from '../../core/services';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  PatientEncounterCheckInNotesModel,
  PatientEncounterNotesModel,
} from '../clients/diagnosis/diagnosis.model';
import { FilterModel } from '../clients/medication/medication.model';

const getQueryParamsFromObject = (filterModal: any): string => {
  let queryParams = '';
  let index = 0;
  for (const key of Object.keys(filterModal)) {
    if (index === 0) queryParams += `?${key}=${filterModal[key]}`;
    else queryParams += `&${key}=${filterModal[key]}`;

    index++;
  }
  return queryParams;
};

@Injectable({
  providedIn: 'root',
})
export class EncounterService {
  private changeSOAPPanelStateSubject = new BehaviorSubject<any>({});
  public SOAPPanelData = this.changeSOAPPanelStateSubject.asObservable();

  getMasterDataURL = 'api/MasterData/MasterDataByName';
  getPatientEncounterDetailsURL =
    'patient-encounter/GetPatientEncounterDetails';
  getNonBillableEncounterDetailsURL =
    'patient-encounter/GetPatientNonBillableEncounterDetails';
  getAppConfigurationsURL = 'AppConfigurations/GetAppConfigurations';
  //savePatientEncounterURL = "patient-encounter/SavePatientEncounter";
  savePatientEncounterURL = 'patient-encounter/SavePatientEncounters';
  savePatientAppointmentEncountersURL =
    'patient-encounter/SavePatientAppointmentEncounters';
  updatePatientEncounterURL = 'patient-encounter/UpdatePatientEncounter';

  getPatientEncounterNotesURL = 'patient-encounter/GetPatientEncounterNotes';
  getPatientEncounterCheckInNotesURL =
    'patient-encounter/GetPatientEncounterCheckInNotes';
  getPatientEncounterCheckInNotesByAppointmentId =
    'patient-encounter/GetPatientEncounterCheckInNotesByAppointmentId';
  GetDetailsSoapNotesUrl = 'patient-encounter/GetDetailsSoapNotes';
  GetDetailsSoapNotesByPatientIdUrl =
    'patient-encounter/GetDetailsSoapNotesByPatientId';
  GetAllSoapNotesUrl = 'patient-encounter/GetAllSoapNotes';
  saveNonBillableEncounterURL =
    'patient-encounter/SavePatientNonBillableEncounter';
  saveEncounterSignatureURL = 'patient-encounter/SaveEncounterSignature';
  createClaimURL = 'Claim/CreateClaim';
  private getClientHeaderInfoURL = 'Patients/GetPatientHeaderInfo';
  getTelehealthSessionURL =
    'api/Telehealth/GetTelehealthSession?appointmentId=';
  getMasterTemplatesURL = 'MasterTemplates/GetMasterTemplates';
  GetMasterTemplateListByProviderURL =
    'MasterTemplates/GetMasterTemplateListByProvider?';
  GetTemplateByIdURL = 'patient-encounter/GetPatientEncounterTemplateData';
  SaveTemplateDataURL = 'patient-encounter/SaveEncounterTemplateData';
  private getPreviousEncountersURL = 'patient-encounter/GetPreviousEncounters';
  private getPreviousEncountersDataURL =
    'patient-encounter/GetPreviousEncountersData';
  private checkServiceCodeAvailabilityURL =
    'patient-encounter/CheckServiceCodeAvailability';
  getTelehealthSessionForInvitedAppointmentIdURL =
    'api/Telehealth/GetTelehealthSessionByInvitedAppointmentId?appointmentId=';
  private savePatientEncounterNotesURL =
    'patient-encounter/SavePatientEncounterNotes';
  private getCheckInNotesByAppointmentIDURL =
    'patient-encounter/GetCheckInNotesByAppointmentID';
  private savePatientEncounterCheckInNotesURL =
    'patient-encounter/SavePatientEncounterCheckInNotes';
  private getMasterICD = 'MasterICDs/GetMasterICD';
  private SavePatientDiagnosisUrl = 'PatientsDiagnosis/SavePatientDiagnosis';
  private GetDiagnosisUrl = 'PatientsDiagnosis/GetDiagnosis';
  private getEndSessionValidateDataURL =
    'patient-encounter/GetEndSessionValidateData';
  private getIcdCodesUrl = 'patient-encounter/GetIcdCodes';
  private SOAPPanel!: ElementRef;
  constructor(private commonService: CommonService) {}

  getEndSessionValidateData(patientId: number, staffId: number, appId: number) {
    return this.commonService.get(
      `${this.getEndSessionValidateDataURL}?patientId=${patientId}&staffId=${staffId}&appId=${appId}`
    );
  }

  getIcdCodes(patientId: number, staffId: number, appId: number) {
    return this.commonService.get(
      `${this.getIcdCodesUrl}?patientId=${patientId}&staffId=${staffId}&appId=${appId}`
    );
  }
  getMasterICDOnSearch(data: any, pageSize: any): Observable<any> {
    return this.commonService.get(
      this.getMasterICD + '?searchText=' + data + '&pageSize=' + pageSize
    );
  }
  getPatientDiagnosis(id: any): Observable<any> {
    return this.commonService.get(this.GetDiagnosisUrl + '?patientId=' + id);
  }
  getCheckInNotesByAppointmentID(id: any): Observable<any> {
    return this.commonService.get(
      this.getCheckInNotesByAppointmentIDURL + '?appointmentId=' + id
    );
  }
  savePatientIcd(postData: any) {
    return this.commonService.post(this.SavePatientDiagnosisUrl, postData);
  }

  changeSOAPPanelData(
    changedState: boolean,
    extraParams: any,
    isSaved: boolean = false
  ) {
    this.changeSOAPPanelStateSubject.next({
      changedState,
      ...extraParams,
      isSaved,
    });
  }
  get SOAPPanelRef() {
    return this.SOAPPanel;
  }
  CheckServiceCodeAvailability(
    patientAppointmentId: number,
    serviceCodeId: string
  ) {
    const queryParams = `?patientAppointmentId=${patientAppointmentId}&serviceCodeId=${serviceCodeId}`;
    return this.commonService.post(
      this.checkServiceCodeAvailabilityURL + queryParams,
      {}
    );
  }
  public setClientPanel(clientPanel: ElementRef) {
    this.SOAPPanel = clientPanel;
  }
  getMasterData(masterData: any): Observable<any> {
    return this.commonService.post(this.getMasterDataURL, masterData);
  }

  GetPatientEncounterDetails(apptId: number, encId: number, isAdmin: boolean) {
    const queryParams = `/${apptId}/${encId}?isAdmin=${isAdmin}`;
    return this.commonService.getAll(
      this.getPatientEncounterDetailsURL + queryParams,
      {}
    );
  }

  getNonBillableEncounterDetails(
    apptId: number,
    encId: number,
    isAdmin: boolean
  ) {
    const queryParams = `/${apptId}/${encId}?isAdmin=${isAdmin}`;
    return this.commonService.getAll(
      this.getNonBillableEncounterDetailsURL + queryParams,
      {}
    );
  }

  getAppConfigurations() {
    return this.commonService.getAll(this.getAppConfigurationsURL, {});
  }

  SavePatientEncounter(postData: any, isAdmin: boolean) {
    //////debugger;
    const queryParams = `?isAdmin=${isAdmin}`;
    return this.commonService.post(
      this.savePatientEncounterURL + queryParams,
      postData
    );
  }
  SavePatientAppointmentEncounters(postData: any, isAdmin: boolean) {
    //////debugger;
    const queryParams = `?isAdmin=${isAdmin}`;
    return this.commonService.post(
      this.savePatientAppointmentEncountersURL + queryParams,
      postData
    );
  }
  updatePatientEncounter(postData: any) {
    //////debugger;
    return this.commonService.post(this.updatePatientEncounterURL, postData);
  }

  saveNonBillableEncounter(postData: any, isAdmin: boolean) {
    const queryParams = `?isAdmin=${isAdmin}`;
    return this.commonService.post(
      this.saveNonBillableEncounterURL + queryParams,
      postData
    );
  }

  saveEncounterSignature(postData: any) {
    return this.commonService.post(this.saveEncounterSignatureURL, postData);
  }

  createClaim(encounterId: number, isAdmin: boolean) {
    const queryParams = `?patientEncounterId=${encounterId}&isAdmin=${isAdmin}`;
    return this.commonService.post(this.createClaimURL + queryParams, {});
  }

  getClientHeaderInfo(id: number) {
    return this.commonService.getById(
      this.getClientHeaderInfoURL + '?id=' + id,
      {}
    );
  }

  getTelehealthSession(appointmentId: number) {
    console.log('12 Gettelehealthsesson   called from encounter service  ');
    //const queryParams = getQueryParamsFromObject(filters);
    return this.commonService.getAll(
      `${this.getTelehealthSessionURL}${appointmentId}`,
      {}
    );
  }
  getTelehealthSessionForInvitedAppointmentId(appointmentId: number) {
    //const queryParams = getQueryParamsFromObject(filters);
    return this.commonService.getAll(
      `${this.getTelehealthSessionForInvitedAppointmentIdURL}${appointmentId}`,
      {}
    );
  }

  getMasterTemplates(appointmentId: number) {
    return this.commonService.getAll(
      `${this.getMasterTemplatesURL}?PatientAppointmentID=${appointmentId}`,
      {}
    );
  }

  GetMasterTemplateListByProvider(AppointmentId: any) {
    return this.commonService.getAll(
      `${this.GetMasterTemplateListByProviderURL}AppointmentId=${AppointmentId}`,
      {}
    );
  }

  getTemplateForm(appointmentId: number, templateId: number) {
    const queryParams = `?appointmentId=${appointmentId}&masterTemplateId=${templateId}`;
    return this.commonService.getById(
      this.GetTemplateByIdURL + queryParams,
      {}
    );
  }

  saveTemplateData(postData: any) {
    return this.commonService.post(this.SaveTemplateDataURL, postData);
  }
  getPreviousEncounters(patientId: number, fromDate: string, toDate: string) {
    let url =
      this.getPreviousEncountersURL +
      '?patientId=' +
      patientId +
      '&fromDate=' +
      fromDate +
      '&toDate=' +
      toDate;
    return this.commonService.getAll(url, {});
  }
  getPreviousEncountersData(previousEncounterId: number) {
    //////debugger;
    let url =
      this.getPreviousEncountersDataURL +
      '?previousEncounterId=' +
      previousEncounterId;
    return this.commonService.getAll(url, {});
  }

  savePatientEncounterNotes(data: PatientEncounterNotesModel) {
    return this.commonService.post(this.savePatientEncounterNotesURL, data);
  }

  savePatientEncounterCheckInNotes(data: PatientEncounterCheckInNotesModel) {
    return this.commonService.post(
      this.savePatientEncounterCheckInNotesURL,
      data
    );
  }

  GetPatientEncounterNotes(apptId: number) {
    const queryParams = `/${apptId}`;

    return this.commonService.getAll(
      this.getPatientEncounterNotesURL + queryParams,
      {}
    );
  }

  GetPatientEncounterCheckInNotes(apptId: number) {
    const queryParams = `/${apptId}`;

    return this.commonService.getAll(
      this.getPatientEncounterCheckInNotesURL + queryParams,
      {}
    );
  }

  GetPatientEncounterCheckInNotesByAppointmentId(apptId: number) {
    const queryParams = `/${apptId}`;
    return this.commonService.getAll(
      this.getPatientEncounterCheckInNotesByAppointmentId + queryParams,
      {}
    );
  }

  GetDetailsSoapNotes(apptId: number) {
    const queryParams = `/${apptId}`;

    return this.commonService.getAll(
      this.GetDetailsSoapNotesUrl + queryParams,
      {}
    );
  }
  GetSoapNotesByPatientId(patientId: number) {
    const queryParams = `/${patientId}`;

    return this.commonService.getAll(
      this.GetDetailsSoapNotesByPatientIdUrl + queryParams,
      {}
    );
  }
  GetAllSoapNotes(
    patientId: number,
    patientAppointmentId: number,
    filterModal: FilterModel
  ) {
    debugger;
    let url =
      this.GetAllSoapNotesUrl +
      '?patientId=' +
      patientId +
      '&PatientAppointmentId=' +
      patientAppointmentId +
      '&pageNumber=' +
      filterModal.pageNumber +
      '&pageSize=' +
      filterModal.pageSize +
      '&sortColumn=' +
      filterModal.sortColumn +
      '&sortOrder=' +
      filterModal.sortOrder +
      '&searchText=' +
      filterModal.searchText;
    return this.commonService.getAll(url, {});
  }
}
