import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../core/services';
import { FilterModel } from '../../clients/medication/medication.model';
import { TestMasterModule } from './Test-masterModule';

@Injectable({
  providedIn: 'root'
})
export class TestmasterserviceService {
  getAllURL:string="api/MasterTest/GetTestMasterData";
  getByIdURL:string="api/MasterTest/GetTestMasterDataById?Id=";
  createURL:string="api/MasterTest/SaveUpdateMasterTestData";
  deleteURL:string="api/MasterTest/DeleteTestMasterDataById?Id=";
  constructor(private commonService: CommonService) { }
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
      filterModel.searchText +
      "&roleId=" +
      filterModel.roleId;
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
  create(serviceModel: TestMasterModule): Observable<TestMasterModule> {
    return this.commonService.post(this.createURL, serviceModel);
  }
  delete(id:any){
    return this.commonService.getById(this.deleteURL + id, {});
  }
}
