import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';
import { FilterModel, InsurancecompanyModel } from '../../../core/modals/common-model';
import { CommonService } from '../../../core/services';
//import { InsurancecompanyModel } from './insurancecompany-model';

@Injectable({
  providedIn: 'root'
})
export class CompanyInsuranceService {
  private loadingStateSubject = new Subject<boolean>();
  createURL: string = "api/MasterInsuranceCompany/SaveMasterService";
  getAllURL: string = "api/MasterInsuranceCompany/GetInsuranceCompany";
  getByIdURL: string = "api/MasterInsuranceCompany/GetInsuranceCompanyDataById?Id=";
  deleteURL: string = "api/MasterInsuranceCompany/DeleteCompanyInsurance?Id=";
  constructor(private commonService: CommonService,private http: HttpClient) { }
  create(serviceModel: InsurancecompanyModel): Observable<InsurancecompanyModel> {
    return this.commonService.post(this.createURL, serviceModel);
  }
  getAll(filterModel: FilterModel):  Observable<any> {
    let url =
      this.getAllURL +
      "?pageNumber=" +
      filterModel.pageNumber +
      "&pageSize=" +
      filterModel.pageSize +
      "&sortColumn=" +
      filterModel.sortColumn +
      "&sortOrder=" +
      filterModel.sortOrder +
      "&searchText=" +
      filterModel.searchText;
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
  getById(id: string) {
    return this.commonService.getById(this.getByIdURL + id, {});
  }
  delete(id: number) {
    return this.commonService.patch(this.deleteURL + id, {});
  }
}
