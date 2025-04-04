import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../core/services';
import { FilterModel } from '../../clients/medication/medication.model';
import { MasterAllergiesModel } from './MasterAllergies-Model';

@Injectable({
  providedIn: 'root'
})
export class MasterAllergiesServiceService {
  createURL: string = "MasterAllergies/SaveMasterAllergiesData";
  getAllURL: string = "MasterAllergies/GetMasterAllergiesData";
  getByIdURL:string= "MasterAllergies/GetMasterAllergiesById"
  deleteURL: string = "MasterAllergies/DeleteMasterAllergiesCodes";
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
  getById(id: number) {
    return this.commonService.getById(this.getByIdURL + '/' + id, {});
}
delete(id: number) {
  return this.commonService.patch(this.deleteURL + '/' + id, {});
}
create(serviceModel: MasterAllergiesModel): Observable<MasterAllergiesModel> {
  return this.commonService.post(this.createURL, serviceModel);
}
}
