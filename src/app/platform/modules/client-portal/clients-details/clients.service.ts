import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
import { ClientModel } from "./client.model";
import { FilterLabReferralModel } from "../../core/modals/common-model";

@Injectable({
  providedIn: "root",
})
export class ClientsService {
  private getMasterDataByNameURL = "api/MasterData/MasterDataByName";
  private createURL = "Patients/CreateUpdateClient";
  //private createURL = "Patients/Client";
  private getClientByIdURL = "Patients/GetPatientById";
  private getClientHeaderInfoURL = "Patients/GetPatientHeaderInfo";
  private getClientProfileInfoURL = "Patients/GetPatientsDetails";

  private updateClientStatusURL = "patients/UpdatePatientActiveStatus";
  private updateUserStatusURL = "user/UpdateUserStatus";
  private getPatientCCDAURL = "patients/GetPatientCCDA";
  private updatePatientPortalVisibilityURL =
    "patients/UpdatePatientPortalVisibility";

  private updateLabReferralURL = "LabReferral/UpdateLabReferral";
  //Address URL
  private getAddressAndPhoneNumbersURL =
    "PatientsAddress/GetPatientPhoneAddress";
  private saveAddressAndPhoneNumbersURL = "PatientsAddress/SavePhoneAddress";
  private getAllLabReferralsURL = "LabReferral/GetAllLabReferralsByLabId";
  private getAllFilterLabReferralsByLabIdURL =
    "LabReferral/GetAllFilterLabReferralsByLabId";
  private downloadLabFileURL = "LabReferral/GetUserDocument";
  private getLabReferralPdfByIdURL = "LabReferral/GetLabReferralPdfById";
  private GetAllLabReferralResultDocByReverralIdUrl =
    "LabReferral/GetAllLabReferralResultDocByReverralId";
  private UpdateSampleCollectionStatusUrl =
    "LabReferral/UpdateStatusForSampleCollected";

  private GetPatientLatestInsurancePdfByPatientId =
    "PatientsInsurance/GetPatientLatestInsurancePdfByPatientId";

    private LabRefferalStatusChangeURL = "LabReferral/LabRefferalStatusChange"

  constructor(private commonService: CommonService) {}
  create(data: ClientModel) {
    return this.commonService.post(this.createURL, data);
  }
  getMasterData(value: string = "") {
    return this.commonService.post(this.getMasterDataByNameURL, {
      masterdata: value,
    });
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

  //Address Method  -- Remove all if not needed
  getPatientAddressesAndPhoneNumbers(clientId: number) {
    return this.commonService.getById(
      this.getAddressAndPhoneNumbersURL + "?patientId=" + clientId,
      {}
    );
  }

  savePatientAddressesAndPhoneNumbers(data: any) {
    return this.commonService.post(this.saveAddressAndPhoneNumbersURL, data);
  }

  downloadFile(blob: Blob, filetype: string, filename: string) {
    var newBlob = new Blob([blob], { type: filetype });
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //   window.navigator.msSaveOrOpenBlob(newBlob);
    //   return;
    // }
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

  getAllLabReferralList(
    labId: number,
    role: string,
    searchText: string,
    fromDate: any,
    toDate: any,
    pageSize: any,
    pageNumber: any,
    dob?:any
  ) {
    debugger
    return this.commonService.get(
      `${this.getAllLabReferralsURL}?labId=${labId}&referTo=${role}&searchText=${searchText}&fromDate=${fromDate}&toDate=${toDate}&pageSize=${pageSize}&pageNumber=${pageNumber}&Dob=${dob}`
    );
  }
  getAllFilterLabReferralsByLabId(data: FilterLabReferralModel) {
    return this.commonService.post(
      `${this.getAllFilterLabReferralsByLabIdURL}`,
      data
    );
  }
  downloadLabFile(labReferralMappingId: number) {
    return this.commonService.download(
      this.downloadLabFileURL + "?id=" + labReferralMappingId,
      {}
    );
  }

  getLabReferralPdfById(id: number) {
    return this.commonService.getById(
      this.getLabReferralPdfByIdURL + "?id=" + id,
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
  UpdateSampleCollectionStatus(referralId: any, date: any, status: boolean) {
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
  updateLabReferral(data: any) {
    return this.commonService.post(this.updateLabReferralURL, data);
    //return this.commonService.post(this.updateLabReferralReportURL, data);
  }
  PatientInsurancePdfByPatientId(patientId: any) {
    return this.commonService.getById(
      this.GetPatientLatestInsurancePdfByPatientId + "?patientId=" + patientId,
      {}
    );
  }


  updateLabReferralStatus(data: any) {
    return this.commonService.post(this.LabRefferalStatusChangeURL, data);
    //return this.commonService.post(this.updateLabReferralReportURL, data);
  }



}
