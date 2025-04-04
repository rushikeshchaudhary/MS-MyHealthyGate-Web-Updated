import {
  PaymentFilterModel,
  RefundFilterModel,
} from "./../core/modals/common-model";
import { Injectable } from "@angular/core";
import { CommonService } from "../core/services/common.service";
import { FilterModel } from "../core/modals/common-model";
import { Observable } from "rxjs";
import { UserDocumentReq } from "./client-profile.model";
import { ImmunizationModel } from "../agency-portal/clients/immunization/immunization.model";
import { MedicationModel } from "../agency-portal/clients/medication/medication.model";
import { AllergyModel } from "../agency-portal/clients/allergies/allergies.model";
import { AuthModel } from "../agency-portal/clients/authorization/authorization.model";
import { PatientMedicalFamilyHistoryModel } from "../agency-portal/clients/family-history/family-history.model";
import { PatientInsuranceModel } from "../agency-portal/clients/insurance.model";
import { TemplateModel } from "../agency-portal/template/template.model";

@Injectable({
  providedIn: "root",
})
export class ClientsService {
  private getClientByIdURL = "Patients/GetPatientById";
  private getMasterDataByNameURL = "api/MasterData/MasterDataByName";
  private getClientProfileInfoURL = "Patients/GetPatientsDetails";
  private getPatientCCDAURL = "patients/GetPatientCCDA";
  // private getAllergyListURL = "PatientsAllergy/GetAllergies";
  // private getAllAuthorizationsForPatientURL = "Authorizations/GetAllAuthorizationsForPatient";
  // private getImmunizationListURL = "PatientsImmunization/GetImmunization";
  // private getPatientMedicalFamilyHistoryListURL = "PatientMedicalFamilyHistory/GetPatientMedicalFamilyHistoryById";
  // private getPatientInsurances = "PatientsInsurance/GetPatientInsurances";
  private getPatientAppointment =
    "api/PatientAppointments/GetPatientAppointmentList";
  // private getMedicationListURL = "PatientsMedication/GetMedication";
  private GetFilterLabAppointmentUrl = "Patients/GetPatientLabAppointments";
  //chat
  private getChatHistoryURL = "Chat/GetChatHistory";
  private getPaymentUrl = "AppointmentPayment/ClientPayments";
  private getRefundUrl = "AppointmentPayment/ClientRefunds";
  //review/ratings
  private getAllReviewRatingURL = "ReviewRatings/GetAllReviewRatings";
  private getReviewRatingURL = "ReviewRatings/GetReviewRatingById";
  private saveReviewRatingURL = "ReviewRatings/SaveUpdateReviewRating";
  private getClientNetAppointmentPaymentUrl =
    "AppointmentPayment/ClientNetAppointmentPayment";
  private getPatientsDashboardDetailsURL =
    "Patients/GetPatientsDashboardDetails";

  //Patient Vitals URL
  private createVitalURL = "PatientsVitals/SaveVital";
  private getVitalListURL = "PatientsVitals/GetVitals";
  private getVitalByIdURL = "PatientsVitals/GetVitalById";

  private deleteVitalURL = "PatientsVitals/DeleteVital";

  //Patient Encounters URL
  private getPatientEncountersListURL = "patient-encounter/GetPatientEncounter";

  //Patient Prescription URL
  private getAllPharmacyURL: string = "Pharmacy/GetAllPharmacy";
  private addSharePrescriptionURL = "Patients/SaveSharePrescription";
  private addFavouritePharmacyURL: string = "Pharmacy/AddFavouritePharmacy";
  private getFavouritePharmacyListURL: string =
    "Pharmacy/GetAllFavouritePharmacy";
  private getAllProvidersURL: string = "Staffs/GetAllProviders";
  // private addPatientFavouriteProviderURL: string =
  //   "Staffs/AddPatientFavouriteProvider";
  // private getAllPatientFavouriteProviders: string =
  //   "Staffs/GetPatientFavouriteProviders";

  // Patient card
  private GetAllLabReferralResultDocByReverralIdUrl =
    "LabReferral/GetAllLabReferralResultDocByReverralId";
  private saveCardDetailsUrl: string = "User/SaveCardDetails";
  private getUserSavedCardUrl: string = "User/GetUserSavedCard";
  private deleteUserCardUrl: string = "User/DeleteUserCard";
  private updateUserSavedCardUrl: string = "User/UpdateUserSavedCard";
  private addPatientFavouriteProviderURL: string =
    "Staffs/AddPatientFavouriteProvider";
  private getAllPatientFavouriteProviders: string =
    "Staffs/GetPatientFavouriteProviders";

  //Template
  private getAllTemplatesURL = "Staffs/GetAllTemplates";
  private createTemplateURL = "Staffs/SaveTemplate";
  private getTemplateByIdURL = "Staffs/GetTemplateById";
  private deleteTemplateURL = "Staffs/DeleteTemplate";
  private getTemplatePdfByIdURL = "Staffs/GetTemplatePdfById";

  //Patient Documents URL
  private getFilterUserDocumentsUrl = "userDocument/GetFilterUserDocuments";
  private getDocumentURL = "userDocument/GetUserDocument";
  private deleteUserDocumentURL = "userDocument/DeleteUserDocument";
  private uploadUserDocumentURL = "userDocument/UploadUserDocuments";

  //Patient Immunization URL
  private createImmunizationURL =
    "PatientsImmunization/SavePatientImmunization";
  private getImmunizationListURL = "PatientsImmunization/GetImmunization"; //
  private getImmunizationByIdURL = "PatientsImmunization/GetImmunizationById";
  private deleteImmunizationURL = "PatientsImmunization/DeleteImmunization";

  //Patient Medication URL
  private createMedicationURL = "PatientsMedication/SaveMedication";
  private getMedicationListURL = "PatientsMedication/GetMedication";
  private getMedicationByIdURL = "PatientsMedication/GetMedicationById";
  private deleteMedicationURL = "PatientsMedication/DeleteMedication";

  //Patient Allergy URL
  private createAllergyURL = "PatientsAllergy/SaveAllergy";
  private getAllergyListURL = "PatientsAllergy/GetAllergies";
  private getAllergyByIdURL = "PatientsAllergy/GetAllergyById";
  private deleteAllergyURL = "PatientsAllergy/DeleteAllergy";
  private getPatientsByStaffIdURL = "Patients/GetPatientsByStaffId";
  private addLabReferralURL = "LabReferral/AddLabReferral";
  private updateLabReferralURL = "LabReferral/UpdateLabReferral";
  private updateLabReferralReportURL = "LabReferral/UploadLabReferralsReport";
  private getLabReferralsURL = "LabReferral/GetAllLabReferrals";
  private getLabReferralsByPatientIdURL =
    "LabReferral/GetAllLabReferralsByPatientId";
  private GetRadiologyReferralsUrl = "Radiology/GetRadiologyReferrals";
  //Patient Authorization URL
  private getAllAuthorizationsForPatientURL =
    "Authorizations/GetAllAuthorizationsForPatient";
  private getAuthorizationByIdURL = "Authorizations/GetAuthorizationById";
  private deleteAuthorizationURL = "Authorizations/DeleteAutorization";
  private getPatientPayerServiceCodesAndModifiersURL =
    "patients/GetPatientPayerServiceCodesAndModifiers";
  private createAuthorizationURL = "Authorizations/SaveAuthorization";

  private getAllLabsURL: string = "Labs/GetAllLabs";
  private getAllLabApprovedListsURL: string = "Home/LabApprovedList";
  private addFavouriteLabURL: string = "Labs/AddFavouriteLab";
  private getAllFavouriteLabsURL: string = "Labs/GetAllFavouriteLabs";
  private getAllRadiologyURL: string = "Radiology/GetAllRadiology";
  private addFavouriteRadiologyURL: string = "Radiology/AddFavouriteRadiology";
  private getAllFavouriteRadiologyURL: string =
    "Radiology/GetAllFavouriteRadiology";

  // Patient Family History URL
  private getPatientMedicalFamilyHistoryListURL =
    "PatientMedicalFamilyHistory/GetPatientMedicalFamilyHistoryById";
  private deletePatientMedicalFamilyHistoryURL =
    "PatientMedicalFamilyHistory/DeletePatientMedicalFamilyHistory";
  private savePatientFamilyHistoryDataURL =
    "PatientMedicalFamilyHistory/SavePatientMedicalfamilyHistory";

  //Patient Insurance URL
  private getPatientInsurances = "PatientsInsurance/GetPatientInsurances";
  private getPatientInsurancesById =
    "PatientsInsurance/GetPatientInsuranceById";
  private savePatientInsurances = "PatientsInsurance/SavePatientInsurance";
  private deletePatientInsurances = "PatientsInsurance/DeletePatientInsurance";
  private getPatientInsurancePdfByIdUrl =
    "PatientsInsurance/GetPatientInsurancePdfById";
  private createOrUpdateDoctorPatientNotesURL =
    "Patients/CreateOrUpdateDoctorPatientNotes";
  private getDoctorNotesURL = "Patients/GetDoctorPatientNotes";

  private downloadLabFileURL = "LabReferral/GetUserDocument";
  private getLabReferralPdfByIdURL = "LabReferral/GetLabReferralPdfById";
  private UpdateSampleCollectionStatusUrl =
    "LabReferral/UpdateStatusForSampleCollected";
  private GetPatientLatestInsurancePdfByPatientId =
    "PatientsInsurance/GetPatientLatestInsurancePdfByPatientId";
  private GetReferalDetailsByReferalIdUrl =
    "LabReferral/GetReferalDetailsByReferalId";

  //dicom
  private addDicomImageURL = "Dicom/UploadDicomFile";
  //private addDicomImageURL = "Dicom/TestUploadUI";

  
  private getDicomFilesURL = "Dicom/GetDicomFiles/";
  private getViewerURL = "Dicom/GetImageUrlforView/";

  //RadiologyReferralUrl
  private addRadiologyUrl = "PatientRadiologyDocument/UploadRadiologyUrl";
  private getRadiologyUrl =
    "PatientRadiologyDocument/GetRadiologyDocumentAndUrl/";

  constructor(private commonService: CommonService) {}

  SaveUserCardDetails = (data:any) => {
    return this.commonService.post(this.saveCardDetailsUrl, data);
  };
  GetUserSavedCard = (filterModel: any) => {
    let url =
      this.getUserSavedCardUrl +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&SortColumn=" +
      filterModel.sortColumn +
      "&SortOrder=" +
      filterModel.sortOrder +
      "&searchCriteria=" +
      filterModel.searchText;
    return this.commonService.get(url);
  };
  DeleteUsercard = (data:any) => {
    return this.commonService.post(this.deleteUserCardUrl, data);
  };
  UpdateUserCard = (data:any) => {
    return this.commonService.post(this.updateUserSavedCardUrl, data);
  };

  GetFilterLabAppointmentByPatientId(filterModel: any) {
    let url = `?patientId=${filterModel.patientId}&status=${filterModel.status}&fromDate=${filterModel.fromDate}&toDate=${filterModel.toDate}`;
    return this.commonService.get(this.GetFilterLabAppointmentUrl + url);
  }

  downloadLabFile(labReferralMappingId: number) {
    return this.commonService.download(
      this.downloadLabFileURL + "?id=" + labReferralMappingId,
      {}
    );
  }

  getMasterData(value: string = "") {
    return this.commonService.post(this.getMasterDataByNameURL, {
      masterdata: value,
    });
  }

  getClientById(id: number) {
    return this.commonService.getById(
      this.getClientByIdURL + "?patientId=" + id,
      {}
    );
  }

  getPatientAppointmentList(locationId: number, id: number) {
    let url = `?locationIds=${locationId}&patientIds=${id}`;
    return this.commonService.getById(this.getPatientAppointment + url, {});
  }
  getClientProfileInfo(id: number) {
    return this.commonService.getById(
      this.getClientProfileInfoURL + "?id=" + id,
      {}
    );
  }
  getClientProfileDashboardInfo(id: number) {
    return this.commonService.getById(
      this.getPatientsDashboardDetailsURL + "?id=" + id,
      {}
    );
  }
  getPatientCCDA(patientId: number) {
    return this.commonService.download(
      this.getPatientCCDAURL + "?id=" + patientId,
      {}
    );
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
  //chat
  getChatHistory(fromUserId: number, toUserId: any) {
    return this.commonService.getAll(
      `${this.getChatHistoryURL}?FromUserId=${fromUserId}&ToUserId=${toUserId}`,
      {}
    );
  }
  getAppointmentPayments(postData: PaymentFilterModel): Observable<any> {
    return this.commonService.post(this.getPaymentUrl, postData, true);
  }
  getClientNetAppointmentPayment(clientId: any): Observable<any> {
    return this.commonService.getAll(
      `${this.getClientNetAppointmentPaymentUrl}?clientId=${clientId}`,
      {}
    );
  }
  getAppointmentRefunds(postData: RefundFilterModel): Observable<any> {
    return this.commonService.post(this.getRefundUrl, postData, true);
  }
  getReviewRatingById(id: number) {
    return this.commonService.getById(
      this.getReviewRatingURL + "?id=" + id,
      {}
    );
  }
  saveUpdateReviewRating(data: any) {
    return this.commonService.post(this.saveReviewRatingURL, data);
  }
  getReviewRatings() {
    return this.commonService.getAll(this.getAllReviewRatingURL, {});
  }
  getVitalList(clientId: number, filterModel: FilterModel) {
    let url =
      this.getVitalListURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&PatientId=" +
      clientId +
      "&SortColumn=" +
      filterModel.sortColumn +
      "&SortOrder=" +
      filterModel.sortOrder;
    return this.commonService.getAll(url, {});
  }

  //client encounter Methods
  getClientEncounters(
    filterModel: any,
    clientId: number,
    appointmentType: string,
    staffName: string,
    status: string,
    fromDate: string,
    toDate: string
  ) {
    let url =
      this.getPatientEncountersListURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&patientId=" +
      clientId +
      "&SortColumn=" +
      filterModel.sortColumn +
      "&SortOrder=" +
      filterModel.sortOrder;
    if (appointmentType && appointmentType.length > 0)
      url = url + "&appointmentType=" + appointmentType;
    if (staffName && staffName != "") url = url + "&staffName=" + staffName;
    if (status && status != "") url = url + "&status=" + status;
    if (fromDate && fromDate != "") url = url + "&fromDate=" + fromDate;
    if (toDate && toDate != "") url = url + "&toDate=" + toDate;
    return this.commonService.getAll(url, {});
  }

  getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    return this.commonService.getUserScreenActionPermissions(
      moduleName,
      screenName
    );
  }
  getAllPharmacyList(organizationId: number) {
    return this.commonService.getAll(
      `${this.getAllPharmacyURL}?organizationId=${organizationId}`,
      {}
    );
  }
  SaveSharePrescription(postData: any): Observable<any> {
    return this.commonService.post(
      this.addSharePrescriptionURL,
      postData,
      true
    );
  }
  addFavouritePharmacy(postData: any) {
    return this.commonService.post(
      this.addFavouritePharmacyURL,
      postData,
      true
    );
  }
  addFavouriteLab(postData: any) {
    return this.commonService.post(this.addFavouriteLabURL, postData, true);
  }
  getAllFavouritePharmacyList(filter: FilterModel, patientId: Number) {
    return this.commonService.getAll(
      `${this.getFavouritePharmacyListURL}?sortColumn=${filter.sortColumn}&sortOrder=${filter.sortOrder}&pageNumber=${filter.pageNumber}&pageSize=${filter.pageSize}&patientId=${patientId}`,
      {}
    );
  }
  getAllFavouriteLabList(filter: FilterModel, patientId: Number) {
    return this.commonService.getAll(
      `${this.getAllFavouriteLabsURL}?sortColumn=${filter.sortColumn}&sortOrder=${filter.sortOrder}&pageNumber=${filter.pageNumber}&pageSize=${filter.pageSize}&patientId=${patientId}`,
      {}
    );
  }
  addPatientFavouriteProvider(postData: any) {
    return this.commonService.post(
      this.addPatientFavouriteProviderURL,
      postData,
      true
    );
  }
  getAllFavouriteProviderList(filter: FilterModel, patientId: Number) {
    return this.commonService.getAll(
      `${this.getAllPatientFavouriteProviders}?patientId=${patientId}&sortColumn=${filter.sortColumn}&sortOrder=${filter.sortOrder}&pageNumber=${filter.pageNumber}&pageSize=${filter.pageSize}`,
      {}
    );
  }
  /*getAllProviders(organizationId: Number) {
    return this.commonService.getAll(
      `${this.getAllProvidersURL}?organizationId=${organizationId}`,
      {}
    );
  }*/
  getFilterUserDocuments(userDocRequest: UserDocumentReq) {
    return this.commonService.getAll(
      this.getFilterUserDocumentsUrl +
        "?userId=" +
        userDocRequest.userId +
        "&FromDate=" +
        userDocRequest.fromDate +
        "&ToDate=" +
        userDocRequest.toDate +
        "&CreatedBy=" +
        userDocRequest.CreatedBy +
        "&pageNumber=" +
        userDocRequest.pageNumber +
        "&pageSize=" +
        userDocRequest.pageSize +
        "&sortColumn=" +
        userDocRequest.sortColumn +
        "&sortOrder=" +
        userDocRequest.sortOrder +
        "&searchCriteria=" +
        userDocRequest.searchCriteria +
        "&DocumentType=" +
        userDocRequest.documentType +
        "&FirstCall=" +
        userDocRequest.FirstCall,
      {}
    );
  }
  getDocument(id: number, key: any = "userdoc") {
    return this.commonService.download(
      this.getDocumentURL + "?id=" + id + "&key=" + key,
      {}
    );
  }
  getDocumentForDownlod(id: number, key: any = "userdoc") {
    return this.commonService.get(
      this.getDocumentURL + "?id=" + id + "&key=" + key
    );
  }
  deleteUserDocument(id: number, key = "userdoc") {
    return this.commonService.patch(
      this.deleteUserDocumentURL + "?id=" + id + "&key=" + key,
      {}
    );
  }
  //Immunization Method
  createImmunization(data: ImmunizationModel) {
    return this.commonService.post(this.createImmunizationURL, data);
  }
  getImmunizationList(clientId: number, filterModel: FilterModel) {
    let url =
      this.getImmunizationListURL +
      "?patientId=" +
      clientId +
      "&searchText=" +
      filterModel.searchText +
      "&pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize;
    return this.commonService.getAll(url, {});
  }
  getImmunizationById(id: number) {
    return this.commonService.getById(
      this.getImmunizationByIdURL + "?id=" + id,
      {}
    );
  }
  deleteImmunization(id: number, clientId: number) {
    return this.commonService.patch(
      this.deleteImmunizationURL + "?id=" + id + "&patientId=" + clientId,
      {}
    );
  }

  //Medication Method
  createMedication(data: MedicationModel) {
    return this.commonService.post(this.createMedicationURL, data);
  }
  getMedicationList(clientId: number, filterModel: FilterModel) {
    debugger
    let url =
      this.getMedicationListURL +
      "?patientId=" +
      clientId +
      "&pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&SortColumn=" +
      filterModel.sortColumn +
      "&SortOrder=" +
      filterModel.sortOrder+
      "&SearchText=" +
      filterModel.searchText;
    return this.commonService.getAll(url, {});
  }
  
  getmedicationById(id: number) {
    return this.commonService.getById(
      this.getMedicationByIdURL + "?id=" + id,
      {}
    );
  }
  deleteMedication(id: number, clientId: number) {
    return this.commonService.patch(
      this.deleteMedicationURL + "?id=" + id + "&patientId=" + clientId,
      {}
    );
  }

  //Allergy Method
  createAllergy(data: AllergyModel) {
    return this.commonService.post(this.createAllergyURL, data);
  }
  getAllergyLists(clientId: number) {
    let url = this.getAllergyListURL + "?patientid=" + clientId;
    return this.commonService.getAll(url, {});
  }

  // getAllergyList(clientId: number) {
  //   let url = this.getAllergyListURL + "?patientid=" + clientId;
  //   return this.commonService.getAll(url, {});
  // }
  getAllergyList(clientId: number, filterModel: FilterModel) {
    let url =
      this.getAllergyListURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&PatientId=" +
      clientId +
      "&SortColumn=" +
      filterModel.sortColumn +
      "&SortOrder=" +
      filterModel.sortOrder;
    return this.commonService.getAll(url, {});
  }
  getAllergyById(id: number) {
    return this.commonService.getById(this.getAllergyByIdURL + "?id=" + id, {});
  }
  deleteAllergy(id: number, clientId: number) {
    return this.commonService.patch(
      this.deleteAllergyURL + "?id=" + id + "&patientId=" + clientId,
      {}
    );
  }

  //Authorization Methods
  // getAllAuthorization(clientId: number) {
  //   let url = this.getAllAuthorizationsForPatientURL + "?patientId=" + clientId;
  //   return this.commonService.getAll(url, {});
  // }
  getAllAuthorization(clientId: number, filterModel: any) {
    let url =
      this.getAllAuthorizationsForPatientURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&patientId=" +
      clientId +
      "&SortColumn=" +
      filterModel.sortColumn +
      "&SortOrder=" +
      filterModel.sortOrder +
      "&authType=" +
      filterModel.authType;
    return this.commonService.getAll(url, {});
  }
  getAuthorizationById(authorizationId: number) {
    return this.commonService.getById(
      this.getAuthorizationByIdURL + "?authorizationId=" + authorizationId,
      {}
    );
  }
  deleteAuthorization(id: number) {
    return this.commonService.patch(
      this.deleteAuthorizationURL + "?id=" + id,
      {}
    );
  }
  getPatientPayerServiceCodesAndModifiers(
    clientId: number,
    payerId: number,
    patientInsuranceId: number
  ) {
    let url =
      this.getPatientPayerServiceCodesAndModifiersURL +
      "?patientId=" +
      clientId +
      "&PayerPreference=" +
      "Primary" +
      "&date=" +
      new Date() +
      "&payerId=" +
      payerId +
      "&patientInsuranceId=" +
      patientInsuranceId;
    return this.commonService.getAll(url, {});
  }
  createAuthorization(data: AuthModel) {
    return this.commonService.post(this.createAuthorizationURL, data);
  }

  //Patient Medical Family History
  getPatientMedicalFamilyHistoryList(clientId: number) {
    let url =
      this.getPatientMedicalFamilyHistoryListURL + "?patientid=" + clientId;
    return this.commonService.getAll(url, {});
  }
  getPatientMedicalFamilyHistoryById(id: number) {
    return this.commonService.getById(
      this.getPatientMedicalFamilyHistoryListURL + "?id=" + id,
      {}
    );
  }
  deletePatientMedicalFamilyHistory(id: number) {
    return this.commonService.patch(
      this.deletePatientMedicalFamilyHistoryURL + "?id=" + id,
      {}
    );
  }
  savePatientFamilyHistoryData(data: PatientMedicalFamilyHistoryModel) {
    return this.commonService.post(this.savePatientFamilyHistoryDataURL, data);
  }
  getAllProviders(organizationId: Number, filter: FilterModel) {
    return this.commonService.getAll(
      `${this.getAllProvidersURL}?organizationId=${organizationId}&sortColumn=${filter.sortColumn}&sortOrder=${filter.sortOrder}&pageNumber=${filter.pageNumber}&pageSize=${filter.pageSize}`,
      {}
    );
  }
  getAllLabList(organizationId: Number, roleId: Number, patientId:number=0) {
    return this.commonService.getAll(
      `${this.getAllLabsURL}?organizationId=${organizationId}&roleId=${roleId}&patientId=${patientId}`,
      {}
    );
  }

  getAllLabApprovedListist(data: any) {
    return this.commonService.post(`${this.getAllLabApprovedListsURL}`, data);
  }

  getAllRadiologyList(organizationId: Number, patientId: Number) {
    return this.commonService.getAll(
      `${this.getAllRadiologyURL}?organizationId=${organizationId}&patientId=${patientId}`,
      {}
    );
  }
  getAllFavouriteRadiologies(filter: FilterModel, patientId: Number) {
    return this.commonService.getAll(
      `${this.getAllFavouriteRadiologyURL}?sortColumn=${filter.sortColumn}&sortOrder=${filter.sortOrder}&pageNumber=${filter.pageNumber}&pageSize=${filter.pageSize}&patientId=${patientId}`,
      {}
    );
  }
  addFavouriteRadiology(postData: any) {
    return this.commonService.post(
      this.addFavouriteRadiologyURL,
      postData,
      true
    );
  }

  //Patient Inurance
  getPatientInsurance(clientId: number, filter: FilterModel) {
    return this.commonService.getById(
      this.getPatientInsurances +
        "?patientId=" +
        clientId +
        "&searchText=" +
        filter.searchText +
        "&pageNumber=" +
        filter.pageNumber +
        "&pageSize=" +
        filter.pageSize,
      {}
    );
  }
  getPatientInsuranceById(id: number, clientId: number) {
    return this.commonService.getById(
      this.getPatientInsurancesById + "?id=" + id + "&patientId=" + clientId,
      {}
    );
  }
  getPatientInsurancePdf(id: number, patientId: number) {
    return this.commonService.getById(
      this.getPatientInsurancePdfByIdUrl +
        "?id=" +
        id +
        "&patientId=" +
        patientId,
      {}
    );
  }
  savePatientInsurance(data: Array<PatientInsuranceModel>) {
    return this.commonService.post(this.savePatientInsurances, data);
  }
  deletePatientInsurance(id:any, clientId: number) {
    return this.commonService.patch(
      this.deletePatientInsurances + "?id=" + id + "&patientId=" + clientId,
      {}
    );
  }
  getPatientsByStaffId(staffId: number) {
    return this.commonService.get(
      `${this.getPatientsByStaffIdURL}?staffId=${staffId}`
    );
  }
  addLabReferral(data: any) {
    return this.commonService.post(this.addLabReferralURL, data);
  }
  updateLabReferral(data: any) {
    return this.commonService.post(this.updateLabReferralURL, data);
    //return this.commonService.post(this.updateLabReferralReportURL, data);
  }
  getAllLabReferrals(
    providerId: number,
    patientId: number,
    role: string,
    appointmentId: number,
    searchText: string,
    fromDate: any,
    toDate: any,
    pageSize: any,
    pageNumber: any
  ) {
    return this.commonService.get(
      `${this.getLabReferralsURL}?providerId=${providerId}&patientId=${patientId}&referTo=${role}&AppointmentId=${appointmentId}&searchText=${searchText}&fromDate=${fromDate}&toDate=${toDate}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    );
  }
  getAllReferralsByPatientId(
    patientId: number,
    roleId: number,
    searchText: string,
    fromDate: any,
    toDate: any
  ) {
    return this.commonService.get(
      `${this.getLabReferralsByPatientIdURL}?patientId=${patientId}&roleId=${roleId}&searchText=${searchText}&fromDate=${fromDate}&toDate=${toDate}`
    );
  }
  getRadiologyReferrals(
    patientId: number,
    providerId: number,
    radiologyId: number,
    searchText: string,
    fromDate: any,
    toDate: any
  ) {
    return this.commonService.get(
      `${this.GetRadiologyReferralsUrl}?patientId=${patientId}&providerId=${providerId}&radiologyId=${radiologyId}&searchText=${searchText}&fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  createOrUpdateDoctorPatientNotes(data: any) {
    return this.commonService.post(
      this.createOrUpdateDoctorPatientNotesURL,
      data
    );
  }
  getDoctorNotes(patientId: number, staffId: number) {
    return this.commonService.get(
      `${this.getDoctorNotesURL}?patientId=${patientId}&providerId=${staffId}`
    );
  }
  getAllTemplates(
    providerId: number,
    searchText: string,
    fromDate: any,
    toDate: any
  ) {
    return this.commonService.get(
      `${this.getAllTemplatesURL}?providerId=${providerId}&searchText=${searchText}&fromDate=${fromDate}&toDate=${toDate}`
    );
  }
  createTemplate(data: TemplateModel) {
    return this.commonService.post(this.createTemplateURL, data);
  }
  getTemplateById(id: number) {
    return this.commonService.getById(
      this.getTemplateByIdURL + "?id=" + id,
      {}
    );
  }
  deleteTemplate(id: number) {
    return this.commonService.patch(this.deleteTemplateURL + "?id=" + id, {});
  }
  getTemplatePdfById(id: number) {
    return this.commonService.getById(
      this.getTemplatePdfByIdURL + "?id=" + id,
      {}
    );
  }

  GetAllLabReferralResultDocByReverralId(referralId: number) {
    return this.commonService.get(
      this.GetAllLabReferralResultDocByReverralIdUrl +
        "?labReferralId=" +
        referralId
    );
  }
  getLabReferralPdfById(id: number) {
    return this.commonService.getById(
      this.getLabReferralPdfByIdURL + "?id=" + id,
      {}
    );
  }
  // UpdateSampleCollectionStatus(referralId, status) {
  //   var data = {
  //     LabReferralId: referralId,
  //     IsSampleCollectedStatus: status,
  //   };
  //   return this.commonService.post(
  //     `${this.UpdateSampleCollectionStatusUrl}`,
  //     data
  //   );
  // }
  UpdateSampleCollectionStatus(referralId:any, date:any, status:any) {
    var data = {
      LabReferralId: referralId,
      SampleCollectionDate: date,
      IsSampleCollectedStatus: status,
    };
    return this.commonService.post(
      `${this.UpdateSampleCollectionStatusUrl}`,
      data
    );
  }
  PatientInsurancePdfByPatientId(patientId:any) {
    return this.commonService.getById(
      this.GetPatientLatestInsurancePdfByPatientId + "?patientId=" + patientId,
      {}
    );
  }

  GetReferalDetailsByReferalIdAPi(referalId:any) {
    return this.commonService.get(
      this.GetReferalDetailsByReferalIdUrl + "?labReferralId=" + referalId
    );
  }

  uploadDicomfile(formData: any) {
    return this.commonService.post(this.addDicomImageURL, formData);
  }

  getUploadedDicomFiles(labReferralId:any) {
    return this.commonService.get(this.getDicomFilesURL + labReferralId);
  }

  getUrlForViewer(fileId: any) {
    return this.commonService.get(this.getViewerURL + fileId);
  }

  //RadiologyReferralUrl
  uploadRadiologyUrl = (data: any) => {
    return this.commonService.post(this.addRadiologyUrl, data);
  };

  getUploadedRadiologyUrl = (labReferralId:any) => {
    return this.commonService.get(this.getRadiologyUrl + labReferralId);
  };
}
