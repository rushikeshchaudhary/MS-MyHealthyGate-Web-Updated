import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
import {
  ClientModel,
  AddUserDocumentModel,
  SocialHistoryModel,
} from "./client.model";
import { GuardianModel } from "./guardian.model";
import { AddressModel } from "./address.model";
import { DiagnosisModel } from "./diagnosis/diagnosis.model";
import { PatientInsuranceModel } from "./insurance.model";
import { ClientCustomLabelModel } from "./clientCustomLabel.model";
import { PatientMedicalFamilyHistoryModel } from "./family-history/family-history.model";
import { ImmunizationModel } from "./immunization/immunization.model";
import {
  FilterModel,
  PatientSubscriptionPlan,
} from "../../core/modals/common-model";
import { VitalModel } from "./vitals/vitals.model";
import { AllergyModel } from "./allergies/allergies.model";
import { AuthModel } from "./authorization/authorization.model";
import { MedicationModel } from "./medication/medication.model";
import { ClientLedgerPaymentDetailsModel } from "./client-ledger/client-ledger.model";
import {
  PrescriptionModel,
  PrescriptionFaxModel,
  PrescriptionDownloadModel,
} from "./prescription/prescription.model";
import { Observable } from "rxjs/internal/Observable";
import { StringifyOptions } from "querystring";
import { UserDocumentReq } from "../../client-portal/client-profile.model";
@Injectable({
  providedIn: "root",
})
export class ClientsService {

  private getMasterDataByNameURL = "api/MasterData/MasterDataByName";
  private createURL = "Patients/CreateUpdatePatient";
  private getClientByIdURL = "Patients/GetPatientById";
  private getClientHeaderInfoURL = "Patients/GetPatientHeaderInfo";
  private getClientProfileInfoURL = "Patients/GetPatientsDetails";

  private updateClientStatusURL = "patients/UpdatePatientActiveStatus";
  private updateUserStatusURL = "user/UpdateUserStatus";
  private getPatientCCDAURL = "patients/GetPatientCCDA";
  private updatePatientPortalVisibilityURL =
    "patients/UpdatePatientPortalVisibility";

  //Eligibility Enquiry Methods
  private getPayerByPatientURL = "GetPayerByPatient";
  private getEligibilityEnquiryServiceCodesURL =
    "EligibilityCheck/GetEligibilityEnquiryServiceCodes";
  private download270URL = "EligibilityCheck/Download270";

  //Allergy URL
  private createAllergyURL = "PatientsAllergy/SaveAllergy";
  private getAllergyListURL = "PatientsAllergy/GetAllergies";
  private getAllergyByIdURL = "PatientsAllergy/GetAllergyById";
  private deleteAllergyURL = "PatientsAllergy/DeleteAllergy";

  //Authorization
  private getAllAuthorizationsForPatientURL =
    "Authorizations/GetAllAuthorizationsForPatient";
  private getAuthorizationByIdURL = "Authorizations/GetAuthorizationById";
  private deleteAuthorizationURL = "Authorizations/DeleteAutorization";
  private getPatientPayerServiceCodesAndModifiersURL =
    "patients/GetPatientPayerServiceCodesAndModifiers";
  private createAuthorizationURL = "Authorizations/SaveAuthorization";

  //Vitals URL
  private createVitalURL = "PatientsVitals/SaveVital";
  private getVitalListURL = "PatientsVitals/GetVitals";
  private getVitalByIdURL = "PatientsVitals/GetVitalById";
  private getVitalByAppointmentIdURL =
    "PatientsVitals/GetVitalsByAppointmentId";
  private deleteVitalURL = "PatientsVitals/DeleteVital";

  //Immunization URL
  private createImmunizationURL =
    "PatientsImmunization/SavePatientImmunization";
  private getImmunizationListURL = "PatientsImmunization/GetImmunization";
  private getImmunizationByAppointmentIdListURL =
    "PatientsImmunization/GetImmunizationByAppointmentId";
  private getImmunizationByIdURL = "PatientsImmunization/GetImmunizationById";
  private deleteImmunizationURL = "PatientsImmunization/DeleteImmunization";

  //Medication URL
  private createMedicationURL = "PatientsMedication/SaveMedication";
  private getMedicationListURL = "PatientsMedication/GetMedication";
  
  private getMedicationByIdURL = "PatientsMedication/GetMedicationById";
  private getMedicationByAppointmentIdURL =
    "PatientsMedication/GetMedicationByAppointmentId";
  private deleteMedicationURL = "PatientsMedication/DeleteMedication";

  //Guardian URL
  private createGuardianURL = "PatientsGuardian/CreateUpdatePatientGuardian";
  private getGuardianListURL = "PatientsGuardian/GetPatientGuardian";
  private getGuardianByIdURL = "PatientsGuardian/GetPatientGuardianById";
  private deleteGuardianURL = "PatientsGuardian/DeletePatientGuardian";

  //Address URL
  private getAddressAndPhoneNumbersURL =
    "PatientsAddress/GetPatientPhoneAddress";
  private saveAddressAndPhoneNumbersURL = "PatientsAddress/SavePhoneAddress";

  // social history
  private getPatientSocialHistoryURL =
    "PatientsSocialHistory/GetPatientSocialHistory";
  private savePatientSocialHistoryURL =
    "PatientsSocialHistory/SavePatientSocialHistory";

  //Diagnosis URL
  private getDiagnosisListURL = "PatientsDiagnosis/GetDiagnosis";
  private getSoapNotePatientDiagnosisListURL =
    "patient-encounter/GetPatientDiagnosisDetails/";
  private getDiagnosisByIdURL = "PatientsDiagnosis/GetDiagnosisById";
  private createDiagnosisURL = "PatientsDiagnosis/SavePatientDiagnosis";
  private deleteDiagnosisURL = "PatientsDiagnosis/DeleteDiagnosis";
  //Patient Insurance URL
  private getPatientInsurances = "PatientsInsurance/GetPatientInsurances";
  private savePatientInsurances = "PatientsInsurance/SavePatientInsurance";
  // Patient Custom Label
  private getPatientCustomLabels = "PatientsCustomLabel/GetPatientCustomLabels";
  private savePatientCustomLabels =
    "PatientsCustomLabel/SavePatientCustomLabels";
  private getAllPatientsForDDL = "Patients/GetAllPatientList";
  // Patient Family History URL
  private getPatientMedicalFamilyHistoryListURL =
    "PatientMedicalFamilyHistory/GetPatientMedicalFamilyHistoryById";
  private deletePatientMedicalFamilyHistoryURL =
    "PatientMedicalFamilyHistory/DeletePatientMedicalFamilyHistory";
  private savePatientFamilyHistoryDataURL =
    "PatientMedicalFamilyHistory/SavePatientMedicalfamilyHistory";

  //Patient Encounters
  private getPatientEncountersListURL = "patient-encounter/GetPatientEncounter";

  //Ledger URL
  private getClaimsForLedgerURL = "Claim/GetClaimsForPatientLedger";
  private getClaimServiceLineForPatientLedgerURL =
    "Claim/GetClaimServiceLinesForPatientLedger";
  private getPatientGuarantorURL = "patients/GetPatientGuarantor";
  private getPaymentDetailByIdURL = "api/Payment/GetPaymentDetailsById";
  private saveServiceLinePaymentURL = "api/Payment/SaveServiceLinePayment";
  private deleteServiceLinePaymentURL = "api/Payment/DeleteServiceLinePayment";

  //dpcuments
  private getUserDocumentsURL = "userDocument/GetUserDocuments";

  private getFilterUserDocumentsUrl = "userDocument/GetFilterUserDocuments";
  private getAllDocumentsForSuperAdminUrl =
    "userDocument/GetAllDocumentsForSuperAdmin";
  private getAllDocumentsURL = "userDocument/GetAllDocumentsForSuperAdmin";
  private getUserByLocationURL =
    "api/PatientAppointments/GetStaffAndPatientByLocation";
  private getUserDocumentURL = "userDocument/GetUserDocument";
  private deleteUserDocumentURL = "userDocument/DeleteUserDocument";
  private uploadUserDocumentURL = "userDocument/UploadUserDocuments";
  private updateUserDocumnetURL = "userDocument/UpdateUserDocumnet";

  private getPateintApptDocumentsURL =
    "userDocument/GetPateintAppointmenttDocuments";
  //chat
  private getChatHistoryURL = "Chat/GetChatHistory";

  private importCCDAURL = "patients/ImportPatientCCDA";

  //Prescription
  private getPrescriptionlistURL =
    "PatientsPrescription/GetprescriptionDrugList";
  private createPrescriptionURL = "PatientsPrescription/SavePrescription";
  private getPrescriptionListURL = "PatientsPrescription/GetPrescriptions";
  private getPrescriptionByAppointmentIdListURL =
    "PatientsPrescription/GetPrescriptionsByAppointmentId";
  private getSharedPrescriptionListURL =
    "PatientsPrescription/GetSharedPrescriptions";
  private GetSharedPrescriptionsClientsUrl =
    "PatientsPrescription/GetSharedPrescriptionsClients";
  private getPrescriptionByIdURL = "PatientsPrescription/GetPrescriptionById";
  private deletePrescriptionURL = "PatientsPrescription/DeletePrescriptionByID";
  private deleteByPrescriptionNoURL="PatientsPrescription/DeletePrescription"
  private downloadPrescription = "PatientsPrescription/GetPrescriptionPdf";
  private downloadSharePrescription =
    "PatientsPrescription/GetSharePrescriptionPdf";
  private sendfax = "PatientsPrescription/SendFax";
  private searchMasterPrescriptionDrugsURL =
    "PatientsPrescription/GetMasterprescriptionDrugs";
  private searchMasterPharmacyURL = "PatientsPrescription/GetMasterPharmacy";
  private getSentPrescriptionListURL =
    "PatientsPrescription/GetSentPrescriptions";

  // LAB
  private getAllPatientByUrl = "Labs/GetALLActivePatient";
  private changeStatusOfSharedPrescriptionUrl =
    "PatientsPrescription/ChangeStatusSharedPrescriptions";
  private getLabDocumentUrl = "Labs/GetLabDocument";
  //staff
  private UploadStaffVideo = "Staffs/UploadStaffVideo";
  private GetProviderVideo = "Staffs/GetProviderVideo";
  // Misc
  private getPatientWithAppointmentIdURL =
    "api/PatientAppointments/getPatientWithAppointmentId";
  //Patient Subscription Plan
  private getPatientSubscriptionURL: string = "Patients/GetPatientSubscription";

  private GetLastPatientIdUrl = "patients/GetLastPatientId";
  private updateLabReferralURL = "LabReferral/UpdateLabReferral";
  private uploadRadiologyReport = "LabReferral/UploadLabReferralsReport";
  private getLabReferralsURL = "LabReferral/GetAllLabReferrals";
  private getLabReferralsByAppointmentIdURL =
    "LabReferral/GetAllLabReferralsByAppointmentIdList";
  private getassesmentQueAnsByApptIdURL =
    "Questionnaire/GetAssesmentQuestionAnswersByAppId";

  //Template
  private getCheckInTemplatePdfByIdURL = "Staffs/GetCheckInTemplatePdfById";
  private AddEditpatientMedicalhistoryURL =
    "Patients/AddEditpatientMedicalhistory";
  private GetPatientMedicalhistoryUrl = "Patients/GetpatientMedicalhistory";
  private DeletePatientMedicalhistoryUrl =
    "Patients/DeletePatientMedicalhistory";

  private GetMedicalHistoryDropdownURL = "Patients/GetMedicalHistoryDropdown";


  constructor(private commonService: CommonService) {}
  create(data: ClientModel) {
    return this.commonService.post(this.createURL, data);
  }
  getMasterData(value: string = "") {
    return this.commonService.post(this.getMasterDataByNameURL, {
      masterdata: value,
    });
  }
  
  getlastIdOfPatient() {
    return this.commonService.get(this.GetLastPatientIdUrl);
  }
  updateClientNavigations(id: number, userId: number) {
    this.commonService.updateClientNaviagations(id, userId);
  }
  getClientById(id: number) {
    return this.commonService.getById(
      this.getClientByIdURL + "?patientId=" + id,
      {}
    );
  }

  getAllLabReferrals(
    providerId: number,
    roleId: number,
    appointmentId: number
  ) {
    return this.commonService.get(
      `${this.getLabReferralsURL}?providerId=${providerId}&roleId=${roleId}&AppointmentId=${appointmentId}`
    );
  }

  getAllLabReferralsByAppointmentId(roleId: number, appointmentId: number) {
    return this.commonService.get(
      `${this.getLabReferralsByAppointmentIdURL}?roleId=${roleId}&AppointmentId=${appointmentId}`
    );
  }

  getAllDocumentSuperAdmin(userReq:any) {
    return this.commonService.getAll(
      this.getAllDocumentsForSuperAdminUrl +
        "?roleId=" +
        userReq.roleId +
        "&FromDate=" +
        userReq.fromDate +
        "&ToDate=" +
        userReq.toDate +
        "&pageNumber=" +
        userReq.pageNumber +
        "&pageSize=" +
        userReq.pageSize +
        "&sortColumn=" +
        userReq.sortColumn +
        "&sortOrder=" +
        userReq.sortOrder +
        "&searchText=" +
        userReq.searchText,
      {}
    );
  }

  getFilterUserDocuments(userDocRequest:any) {
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
        "&FirstCall="+
        userDocRequest.FirstCall,
      {}
    );
  }

  uploadStaffVideo(data:any) {
    return this.commonService.post(this.UploadStaffVideo, data);
  }
  getAllPatient() {
    return this.commonService.get(this.getAllPatientByUrl);
  }
  getProviderVideo(Id: number) {
    return this.commonService.getById(
      this.GetProviderVideo + "?staffId=" + Id,
      {}
    );
  }
  getClientHeaderInfo(id: number) {
    return this.commonService.getById(
      this.getClientHeaderInfoURL + "?id=" + id,
      {}
    );
  }
  getClientProfileInfo(id: number) {
    return this.commonService.getById(
      this.getClientProfileInfoURL + "?id=" + id,
      {}
    );
  }
  updateClientStatus(patientId: number, isActive: boolean) {
    return this.commonService.patch(
      this.updateClientStatusURL +
        "?patientID=" +
        patientId +
        "&isActive=" +
        isActive,
      {}
    );
  }

  updateUserStatus(patientId: number, isActive: boolean) {
    return this.commonService.patch(
      this.updateUserStatusURL + "/" + patientId + "/" + isActive,
      {}
    );
  }
  getPatientCCDA(patientId: number) {
    return this.commonService.download(
      this.getPatientCCDAURL + "?id=" + patientId,
      {}
    );
  }
  updatePatientPortalVisibility(
    patientId: number,
    userId: number,
    value: boolean
  ) {
    let url =
      this.updatePatientPortalVisibilityURL +
      "?patientID=" +
      patientId +
      "&userID=" +
      userId +
      "&isPortalActive=" +
      value;
    return this.commonService.patch(url, {});
  }

  //Eligibility Enquiry Method
  getPayerByPatient(patientID: number, key: string) {
    return this.commonService.getAll(
      this.getPayerByPatientURL + "?PatientID=" + patientID + "&Key=" + key,
      {}
    );
  }

  getEligibilityEnquiryServiceCodes() {
    return this.commonService.getAll(
      this.getEligibilityEnquiryServiceCodesURL,
      {}
    );
  }
  download270(
    patientId: number,
    patientInsuranceId: number,
    serviceTypeCodeIds: string,
    serviceCodeIds: string
  ) {
    let url =
      this.download270URL +
      "?patientId=" +
      patientId +
      "&patientInsuranceId=" +
      patientInsuranceId +
      "&serviceTypeCodeIds=" +
      serviceTypeCodeIds +
      "&serviceCodeIds=" +
      serviceCodeIds;
    return this.commonService.download(url, {});
  }

  //Guardian Method  -- Remove all if not needed
  createGuardian(data: GuardianModel) {
    return this.commonService.post(this.createGuardianURL, data);
  }
  getGuardianList(clientId: number, pageNumber: number, pageSize: number) {
    let url =
      this.getGuardianListURL +
      "?pageNumber=" +
      pageNumber +
      "&pageSize=" +
      pageSize +
      "&PatientId=" +
      clientId;
    return this.commonService.getAll(url, {});
  }
  getGuardianById(id: number) {
    return this.commonService.getById(
      this.getGuardianByIdURL + "?id=" + id,
      {}
    );
  }
  deleteGuardian(id: number) {
    return this.commonService.post(this.deleteGuardianURL + "?id=" + id, {});
  }
  //Address Method  -- Remove all if not needed
  getPatientAddressesAndPhoneNumbers(clientId: number) {
    return this.commonService.getById(
      this.getAddressAndPhoneNumbersURL + "?patientId=" + clientId,
      {}
    );
  }
  //Patient Inurance
  getPatientInsurance(clientId: number) {
    return this.commonService.getById(
      this.getPatientInsurances + "?patientId=" + clientId,
      {}
    );
  }

  savePatientAddressesAndPhoneNumbers(data: any) {
    return this.commonService.post(this.saveAddressAndPhoneNumbersURL, data);
  }

  // social history
  getPatientSocialHistory(patientId: number) {
    return this.commonService.getById(
      this.getPatientSocialHistoryURL + "?patientId=" + patientId,
      {}
    );
  }
  createSocialHistory(data: SocialHistoryModel) {
    return this.commonService.post(this.savePatientSocialHistoryURL, data);
  }

  //Diagnosis
  getDiagnosisList(clientId: number) {
    // let url=this.getDiagnosisListURL+"?PatientId="+clientId;
    return this.commonService.getAll(
      this.getDiagnosisListURL + "?PatientId=" + clientId,
      {}
    );
  }
  getSoapNoteDiagnosisList(clientId: number) {
    // let url=this.getDiagnosisListURL+"?PatientId="+clientId;
    return this.commonService.getAll(
      this.getSoapNotePatientDiagnosisListURL + clientId,
      {}
    );
  }
  getDiagnosisById(id: number) {
    return this.commonService.getById(
      this.getDiagnosisByIdURL + "?id=" + id,
      {}
    );
  }
  createDiagnosis(data: DiagnosisModel) {
    return this.commonService.post(this.createDiagnosisURL, data);
  }
  deleteDiagnosis(id: number) {
    return this.commonService.patch(this.deleteDiagnosisURL + "?id=" + id, {});
  }
  savePatientInsurance(data: Array<PatientInsuranceModel>) {
    return this.commonService.post(this.savePatientInsurances, data);
  }
  //Patient Custom Label
  getPatientCustomLabel(clientId: number) {
    return this.commonService.getById(
      this.getPatientCustomLabels + "?patientId=" + clientId,
      {}
    );
  }

  savePatientCustomLabel(data: Array<ClientCustomLabelModel>) {
    return this.commonService.post(this.savePatientCustomLabels, data);
  }

  //Patient Medical Family History
  getPatientMedicalFamilyHistoryList(clientId: number) {
    return this.commonService.getAll(
      this.getPatientMedicalFamilyHistoryListURL + "?patientid=" + clientId,
      {}
    );
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
  //Immunization Method
  createImmunization(data: ImmunizationModel) {
    return this.commonService.post(this.createImmunizationURL, data);
  }
  getImmunizationList(
    filterModel: FilterModel,
    clientId: number,
    appointmentId: number,
    searchText: string,
    fromDate: any,
    toDate: any
  ) {
    let url =
      this.getImmunizationListURL +
      "?patientId=" +
      clientId +
      "&appointmentId=" +
      appointmentId +
      "&searchText=" +
      searchText +
      "&fromDate=" +
      fromDate +
      "&toDate=" +
      toDate +
      "&pageSize=" +
      filterModel.pageSize;
    return this.commonService.getAll(url, {});
  }
  getImmunizationByAppointmentIdList(clientId: number, appointmentId: number) {
    let url =
      this.getImmunizationByAppointmentIdListURL +
      "?patientId=" +
      clientId +
      "&appointmentId=" +
      appointmentId;
    return this.commonService.getAll(url, {});
  }
  getImmunizationById(id: number) {
    return this.commonService.getById(
      this.getImmunizationByIdURL + "?id=" + id,
      {}
    );
  }
  deleteImmunization(id: number) {
    return this.commonService.patch(
      this.deleteImmunizationURL + "?id=" + id,
      {}
    );
  }

  //Medication Method
  createMedication(data: MedicationModel) {
    return this.commonService.post(this.createMedicationURL, data);
  }

  getMedicationList(clientId: number,filterModel:FilterModel) {
   // let url = this.getMedicationListURL + "?patientId=" + clientId;
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
    //return this.commonService.getAll(url, {});
    return this.commonService.getAll(url, {});
  }
  getmedicationById(id: number) {
    return this.commonService.getById(
      this.getMedicationByIdURL + "?id=" + id,
      {}
    );
  }

  getmedicationByAppointmentId(id: number) {
    return this.commonService.getById(
      this.getMedicationByAppointmentIdURL + "?id=" + id,
      {}
    );
  }
  deleteMedication(id: number, patientId: number) {
    return this.commonService.patch(
      this.deleteMedicationURL + "?id=" + id + "&patientId=" + patientId,
      {}
    );
  }

  //Vitals Method
  createVital(data: VitalModel) {
    return this.commonService.post(this.createVitalURL, data);
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
  getVitalById(id: number) {
    return this.commonService.getById(this.getVitalByIdURL + "?id=" + id, {});
  }

  getVitalByAppointmentId(id: number) {
    return this.commonService.getById(
      this.getVitalByAppointmentIdURL + "?id=" + id,
      {}
    );
  }
  deleteVital(id: number) {
    return this.commonService.patch(this.deleteVitalURL + "?id=" + id, {});
  }

  //Allergy Method
  createAllergy(data: AllergyModel) {
    return this.commonService.post(this.createAllergyURL, data);
  }
  getAllergyLists(clientId: number) {
    let url = this.getAllergyListURL + "?patientid=" + clientId;
    return this.commonService.getAll(url, {});
  }
  getAllergyList(clientId: number, filterModel: FilterModel, aptId: number) {
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
      filterModel.sortOrder +
      "&appointmentId=" +
      aptId;
    return this.commonService.getAll(url, {});
  }
  getAllergyById(id: number) {
    return this.commonService.getById(this.getAllergyByIdURL + "?id=" + id, {});
  }
  deleteAllergy(id: number) {
    return this.commonService.patch(this.deleteAllergyURL + "?id=" + id, {});
  }

  getAssessmentQueAnsByApptId(appointmentId: number) {
    return this.commonService.get(
      `${this.getassesmentQueAnsByApptIdURL}?appointmentId=${appointmentId}`
    );
  }

  //authorization Methods
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
    if (appointmentType && appointmentType.length > 0) {
      url = url + "&appointmentType=" + appointmentType;
    }
    if (staffName && staffName != "") {
      url = url + "&staffName=" + staffName;
    }
    if (status && status != "") {
      url = url + "&status=" + status;
    }
    if (fromDate && fromDate != "") {
      url = url + "&fromDate=" + fromDate;
    }
    if (toDate && toDate != "") {
      url = url + "&toDate=" + toDate;
    }
    return this.commonService.getAll(url, {});
  }

  getClaimsForClientLegder(clientId: number, filterModel: FilterModel) {
    let url =
      this.getClaimsForLedgerURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&patientId=" +
      clientId +
      "&sortColumn=" +
      filterModel.sortColumn +
      "&sortOrder=" +
      filterModel.sortOrder;
    return this.commonService.getAll(url, {});
  }
  getClaimServiceLinesForPatient(claimId: number) {
    return this.commonService.getById(
      this.getClaimServiceLineForPatientLedgerURL + "?claimId=" + claimId,
      {}
    );
  }
  getPaymentDetailById(paymentDetailId: number) {
    return this.commonService.getById(
      this.getPaymentDetailByIdURL + "?paymentDetailId=" + paymentDetailId,
      {}
    );
  }
  getPatientGuarantor(patientId: number) {
    return this.commonService.getById(
      this.getPatientGuarantorURL + "?patientId=" + patientId,
      {}
    );
  }

  getAllPatients() {
    return this.commonService.getAll(this.getAllPatientsForDDL, {});
  }
  saveServiceLinePayment(paymentModel: ClientLedgerPaymentDetailsModel) {
    return this.commonService.post(
      this.saveServiceLinePaymentURL,
      paymentModel
    );
  }
  deleteServiceLinePaymentDetail(id: number) {
    return this.commonService.patch(
      this.deleteServiceLinePaymentURL + "/" + id,
      {}
    );
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
  getAllDocuments(
    pageSize: number,
    pageNumber: number,
    from: string,
    toDate: string
  ) {
    return this.commonService.getAll(
      this.getAllDocumentsURL +
        "?pageSize=" +
        pageSize +
        "&pageNumber=" +
        pageNumber +
        "&from=" +
        from +
        "&to=" +
        toDate,
      {}
    );
  }
  getLabDocuments(userId: number) {
    return this.commonService.getById(
      this.getLabDocumentUrl + "?userId=" + userId,
      {}
    );
  }

  getPateintApptDocuments(apptId: number) {
    return this.commonService.getAll(
      this.getPateintApptDocumentsURL + "?apptId=" + apptId,
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

  getUserDocument(id: number,key:any="userdoc") {
    return this.commonService.download(
      this.getUserDocumentURL + "?id=" + id+ "&key="+key,
      {}
    );
  }

  getDocumentForDownlod(id: number, key: any = "userdoc") {
    return this.commonService.get(
      this.getUserDocumentURL + "?id=" + id + "&key=" + key
    );
  }


  deleteUserDocument(id: number,key:string="userdoc") {
    return this.commonService.patch(
      this.deleteUserDocumentURL + "?id=" + id+ "&key="+key,
      {}
    );
  }

  uploadUserDocuments(data: any) {
    return this.commonService.post(this.uploadUserDocumentURL, data);
  }
  updateUserDocuments(data:any) {
    return this.commonService.post(this.updateUserDocumnetURL, data);
  }

  getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    return this.commonService.getUserScreenActionPermissions(
      moduleName,
      screenName
    );
  }
  //chat
  getChatHistory(fromUserId: number, toUserId: number) {
    return this.commonService.getAll(
      `${this.getChatHistoryURL}?FromUserId=${fromUserId}&ToUserId=${toUserId}`,
      {}
    );
  }
  importCCDA(data: any) {
    return this.commonService.post(this.importCCDAURL, { file: data });
  }

  //Medication Method
  createPrescription(data: PrescriptionModel[]) {
    return this.commonService.post(this.createPrescriptionURL, data);
  }

  getPrescriptionDrugList(id: number) {
    return this.commonService.getById(
      this.getPrescriptionlistURL + "?id=" + id,
      {}
    );
  }

  getPrescriptionList(
    clientId: number,
    filterModel: FilterModel,
    appointmentId: number
  ) {
    let url =
      this.getPrescriptionListURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&appointmentId=" +
      appointmentId +
      "&PatientId=" +
      clientId +
      "&SortColumn=" +
      filterModel.sortColumn +
      "&SortOrder=" +
      filterModel.sortOrder +
      "&SearchText=" +
      filterModel.searchText +
      "&toDate=" +
      filterModel.toDate +
      "&fromDate="+
      filterModel.fromDate
    return this.commonService.getAll(url, {});
  }

  getPrescriptionByAppointmentIdList(
    clientId: number,
    filterModel: FilterModel,
    appointmentId: number
  ) {
    let url =
      this.getPrescriptionByAppointmentIdListURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&appointmentId=" +
      appointmentId +
      "&PatientId=" +
      clientId +
      "&SortColumn=" +
      filterModel.sortColumn +
      "&SortOrder=" +
      filterModel.sortOrder;
    return this.commonService.getAll(url, {});
  }

  getSharedPrescriptionList(
    clientId: number,
    PatientId: number | null,
    filterModel: FilterModel
  ) {
    let url =
      this.getSharedPrescriptionListURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&PharmacyId=" +
      clientId +
      "&patientID=" +
      PatientId +
      "&sortColumn=" +
      filterModel.sortColumn +
      "&sortOrder=" +
      filterModel.sortOrder +
      "&searchText=" +
      filterModel.searchText;
    return this.commonService.getAll(url, {});
  }
  getSharedPrescriptionsClients(data:any) {
    let url =
      this.GetSharedPrescriptionsClientsUrl +
      "?PharmacyId=" +
      data.pharmacyId +
      "&SearchText=" +
      data.searchText +
      "&pageNumber=" +
      data.pageNumber +
      "&pageSize=" +
      data.pageSize +
      "&SortColumn=" +
      data.sortColumn +
      "&SortOrder=" +
      data.sortOrder;
    return this.commonService.getAll(url, {});
  }

  changeStatusOfSharedPrescription(data:any) {
    return this.commonService.post(
      this.changeStatusOfSharedPrescriptionUrl,
      data
    );
  }

  getPrescriptionById(id: number) {
    return this.commonService.getById(
      this.getPrescriptionByIdURL + "?id=" + id,
      {}
    );
  }

  deletePrescription(prescriptionNo: string, clientId: number) {
    return this.commonService.patch(
      this.deleteByPrescriptionNoURL + "?id=" + prescriptionNo + "&patientId=" + clientId,
      {}
    );
  }

  deletePrescriptionById(id: number, clientId: number) {
    return this.commonService.patch(
      this.deletePrescriptionURL + "?id=" + id + "&patientId=" + clientId,
      {}
    );
  }


  DownloadPrescription(dataModel: PrescriptionDownloadModel) {
    const queryParams = `?PrescriptionId=${dataModel.PrescriptionId}&patientId=${dataModel.patientId}&Issentprescription=${dataModel.Issentprescription}&IsMedicationDownload=${dataModel.IsMedicationDownload}`;
    return this.commonService.get(
      this.downloadPrescription + queryParams,
    );
  }

  
  DownloadSharePrescription(dataModel: PrescriptionDownloadModel) {
    const queryParams = `?PharmacyId=${dataModel.pharmacyId}&PrescriptionId=${dataModel.PrescriptionId}&patientId=${dataModel.patientId}&Issentprescription=${dataModel.Issentprescription}&IsMedicationDownload=${dataModel.IsMedicationDownload}`;
    return this.commonService.get(
      this.downloadSharePrescription + queryParams,
    
    );
  }
  //
  downLoadFile(blob: Blob, filetype: string, filename: string) {
    var newBlob = new Blob([blob], { type: filetype });
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    var nav = window.navigator as any;
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

  sendFax(data: PrescriptionFaxModel) {
    return this.commonService.post(this.sendfax, data);
  }

  getMasterPrescriptionDrugsByFilter(searchText: string) {
    const params = `?searchText=${searchText}&pageNumber=1&pageSize=10`;
    return this.commonService.getAll(
      this.searchMasterPrescriptionDrugsURL + params,
      {},
      false
    );
  }

  getMasterPharmacyByFilter(searchText: string) {
    const params = `?searchText=${searchText}&pageNumber=1&pageSize=10`;
    return this.commonService.getAll(
      this.searchMasterPharmacyURL + params,
      {},
      false
    );
  }
  getSentPrescriptionList(clientId: number, filterModel: FilterModel) {
    let url =
      this.getSentPrescriptionListURL +
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
  getPatientWithAppointmentId(appointmentId: number): Observable<any> {
    return this.commonService.getById(
      this.getPatientWithAppointmentIdURL + "?appointmentId=" + appointmentId,
      {}
    );
  }
  getPatientSubscriptionPlan(patientId: number) {
    return this.commonService.getById(
      this.getPatientSubscriptionURL + "?patientId=" + patientId,
      {}
    );
  }
  updateLabReferral(data: any) {
    return this.commonService.videoPost(this.updateLabReferralURL, data);
    //return this.commonService.post(this.uploadRadiologyReport,data);
  }

  getCheckInTemplatePdfById(appointmentId: number, encounterId: number) {
    return this.commonService.getById(
      this.getCheckInTemplatePdfByIdURL +
        `?appointmentId=${appointmentId}&encounterId=${encounterId}`,
      {}
    );
  }

  addEditPatientMedicalhistory(data: any) {
    return this.commonService.post(this.AddEditpatientMedicalhistoryURL, data);
  }

  GetPatientMedicalhistory(
    patientId: any,
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    let url =
      this.GetPatientMedicalhistoryUrl +
      "?PatientId=" +
      patientId +
      "&pageNumber=" +
      pageNumber +
      "&pageSize=" +
      pageSize +
      "&SortColumn=" +
      sortColumn +
      "&SortOrder=" +
      sortOrder;
    return this.commonService.getAll(url, {});
  }

  DeletePatientMedicalhistory(medicalHistoryId: any) {
    let url =
      this.DeletePatientMedicalhistoryUrl +
      "?medicalHistoryId=" +
      medicalHistoryId;

    return this.commonService.getById(url, {});
  }

  GetMedicalHistoryDropdownApi() {
    return this.commonService.getAll(this.GetMedicalHistoryDropdownURL, {});
  }
}
