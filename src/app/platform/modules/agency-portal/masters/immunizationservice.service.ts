import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImmunizationFilterModel } from '../../core/modals/common-model';
import { CommonService } from '../../core/services';
import { ImmunizationModel } from './immunization-details/ImmunizationModule';



@Injectable({
  providedIn: 'root'
})
export class ImmunizationserviceService {
  createURL: string = "MasterImmunzation/SaveMasterImmunzationData";
  getAllURL: string = "MasterImmunzation/GetMasterImmunzation";
  getByIdURL:string= "MasterImmunzation/GetMasterImmunizationById"
  deleteURL: string = "MasterImmunzation/DeleteMasterImmunizationCodes";
  constructor(private commonService: CommonService,private http: HttpClient) { }
  getAll(filterModel: ImmunizationFilterModel):  Observable<any> {
    let url =
      this.getAllURL +
      "?SearchText=" +
      filterModel.SearchText+
      "&VaccineStatus=" +
      filterModel.VaccineStatus+
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
  getById(id: number) {
    return this.commonService.getById(this.getByIdURL + '/' + id, {});
}
delete(id: number) {
  return this.commonService.patch(this.deleteURL + '/' + id, {});
}
create(serviceModel: ImmunizationModel): Observable<ImmunizationModel> {
  return this.commonService.post(this.createURL, serviceModel);
}
}
