import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../core/services';
import { FilterModel } from '../../clients/medication/medication.model';
import { drugprscriptionmodel } from './Drugprescription-model';

@Injectable({
  providedIn: 'root'
})
export class DrugPrescriptionServiceService {
  getAllURL: string = "api/PrescriptionDrugs/GetPrescriptionDrug";
  getByIdURL: string = "api/PrescriptionDrugs/GetPrescriptionDrugsDataById?Id=";
  createURL: string = "api/PrescriptionDrugs/SavePrescriptionDrug";
  deleteURL: string = "api/PrescriptionDrugs/DetelePrescriptionDrugs?id=";
  constructor(private commonService: CommonService) { }
  getAll(filterModel: FilterModel,isActive:boolean):  Observable<any> {
    let url =`${this.getAllURL}?pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}&searchText=${filterModel.searchText}&isActive=${isActive}`;
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
    return this.commonService.getById(this.getByIdURL  + id, {});
  }
  create(serviceModel: drugprscriptionmodel): Observable<drugprscriptionmodel> {
    return this.commonService.post(this.createURL, serviceModel);
  }
  delete(id:any){
    return this.commonService.post(this.deleteURL + id, {});
  }
}
