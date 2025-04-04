import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminDataFilterModel, SuperAdminDataModel } from 'src/app/platform/modules/core/modals/common-model';
import { CommonService } from '../core/services';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminnotificationService {
  private GetListOfDataURL = "api/SuperAdminNotification/GetDataForListing";
  private Getpatientbyid="Patients/GetPatientById?patientId="
  private createURL="api/SuperAdminNotification/SendEmailToTheRole"
  constructor(private commonService: CommonService) { }

  getAll(filterModel: AdminDataFilterModel):  Observable<any> {
    let url =
      this.GetListOfDataURL +
      "?SearchText=" +
      filterModel.SearchText+
      "&Email=" +
      filterModel.Email+
      "&Listof=" +
      filterModel.Listof+
      "&pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&sortColumn=" +
      filterModel.sortColumn +
      "&sortOrder=" +
      filterModel.sortOrder;


      // const headers = new HttpHeaders({
      //   businessToken: localStorage.getItem("business_token"),
      // });
      // filterModel && this.loadingStateSubject.next(true);
      // return this.http
      //   .get<any>(`${environment.api_url}/${url}`, {
      //     headers: headers,
      //   })
      //   .pipe(
      //     map((res) => {
      //       filterModel && this.loadingStateSubject.next(false);
      //       return res;
      //     })
      //   );
    return this.commonService.getAll(url, {});
  }
  getById(serviceData: SuperAdminDataModel):any {
    if(serviceData.patientID>0){
    return this.commonService.getById(this.Getpatientbyid + serviceData.patientID, {});
    }
    return
  }
  create(serviceModel: SuperAdminDataModel): Observable<SuperAdminDataModel> {
    return this.commonService.post(this.createURL, serviceModel);
  }
}
