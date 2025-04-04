import {
  PaymentFilterModel,
  PaymentFilterModelForAdmin,
  RefundFilterModel,
  RefundFilterModelForAdmin
} from "./../../core/modals/common-model";

import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { CommonService } from "src/app/platform/modules/core/services";
import { ManageFeesRefundsModel } from "./payment.models";

@Injectable({
  providedIn: "root"
})
export class PaymentService {
  private getPaymentUrl = "AppointmentPayment/Payments";
  private getPaymentUrlForAdmin = "AppointmentPayment/GetAppointementPaymentListForAdmin";
  private getRefundUrl = "AppointmentPayment/Refunds";
  private getRefundUrlForAdmin = "AppointmentPayment/AppointmentRefundsForAdmin";
  private getMasterDataURL = 'api/MasterData/MasterDataByName';
  private exportPaymentPdfURL = "AppointmentPayment/GetPaymentPdf";
  private getProvidersUrl = "Staffs/GetProviders";
  private getProvidersFeesAndRefundsSettingsUrl = 'api/Payment/GetProvidersFeesAndRefundsSettings';
  private updateProvidersFeesAndRefundsSettingsUrl = 'api/Payment/UpdateProvidersFeesAndRefundsSettings';
  private getLoggedinUserUrl = 'Staffs/GetLoggedinUserDetail';
  constructor(private commonService: CommonService) { }

  getAppointmentPayments(postData: PaymentFilterModel): Observable<any> {
    return this.commonService.post(this.getPaymentUrl, postData, true);
  }
  getAppointmentPaymentsForAdmin(postData: PaymentFilterModelForAdmin): Observable<any> {
    return this.commonService.post(this.getPaymentUrlForAdmin, postData, true);
  }
  getAppointmentRefunds(postData: RefundFilterModel): Observable<any> {
    return this.commonService.post(this.getRefundUrl, postData, true);
  }
  getAppointmentRefundsForAdmin(postData: RefundFilterModelForAdmin): Observable<any> {
    return this.commonService.post(this.getRefundUrlForAdmin, postData, true);
  }
  exportPaymentPdf(dataModel: PaymentFilterModel) {
    const queryParams = `?PatientName=${dataModel.PatientName}&AppDate=${dataModel.AppDate}&PayDate=${dataModel.PayDate}&Status=${dataModel.Status}&RangeStartDate=${dataModel.RangeStartDate}&RangeEndDate=${dataModel.RangeEndDate}`;
    return this.commonService.download(this.exportPaymentPdfURL + queryParams, {});
  }

  downLoadFile(blob: Blob, filetype: string, filename: string) {
    var newBlob = new Blob([blob], { type: filetype });
    const nav = (window.navigator as any)
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(newBlob);
      return;
    }

    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    document.body.appendChild(link);
    link.href = data;
    link.download = filename;
    link.click();
    setTimeout(function () {

      document.body.removeChild(link);
      window.URL.revokeObjectURL(data);
    }, 100);
  }


  getMasterData(value: string = '') {
    return this.commonService.post(this.getMasterDataURL, { masterdata: value });
  }

  getProviders() {
    return this.commonService.get(this.getProvidersUrl, true);
  }

  getProvidersFeesAndRefundsSettings(providerIds: number[]) {
    return this.commonService.post(this.getProvidersFeesAndRefundsSettingsUrl, providerIds, true);
  }

  updateProvidersFeesAndRefundsSettings(model: ManageFeesRefundsModel) {
    return this.commonService.post(this.updateProvidersFeesAndRefundsSettingsUrl, model, true);
  }

  getUserRole() {
    return this.commonService.get(this.getLoggedinUserUrl, true);
  }
}
