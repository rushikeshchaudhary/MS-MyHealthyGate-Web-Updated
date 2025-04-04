import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterModel } from '../../../core/modals/common-model';
import { CommonService } from '../../../core/services';
import { MasterCategoryModel } from './category-model';

@Injectable({
  providedIn: 'root'
})
export class CategoryMasterServiceService {
  getAllURL: string = "api/MasterGlobleCodeCategory/GetGlobleCategorymasterdata";
  getByIdURL: string = "api/MasterGlobleCodeCategory/GetCategoryMasterDataById?Id=";
  deleteURL: string = "api/MasterGlobleCodeCategory/DeleteCareCategory?Id=";
  createURL:string = "api/MasterGlobleCodeCategory/SaveUpdateGlobleCatogeryData";
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
  getById(id: string) {
    return this.commonService.getById(this.getByIdURL + id, {});
  }
  delete(id: number) {
    return this.commonService.patch(this.deleteURL + id, {});
  }
  create(serviceModel: MasterCategoryModel): Observable<MasterCategoryModel> {
    return this.commonService.post(this.createURL, serviceModel);
  }
}
