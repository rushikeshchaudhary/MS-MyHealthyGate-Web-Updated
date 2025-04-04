import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../core/services';
import { FilterModel } from '../../clients/medication/medication.model';
import { SecurityQuestionModel } from './securityquestion-model';

@Injectable({
  providedIn: 'root'
})
export class SecurityquestionmasterService {
  getAllURL: string = "SecurityQuestions/GetSecurityQuestions";
  getByIdURL: string = "SecurityQuestions/GetSecurityQuestionsById";
 // checkServiceNameExistsURL: string = "api/SecurityQuestions/CheckServiceNameExistance?name=";
  createURL: string = "SecurityQuestions/SaveSecurityQuestions";
  deleteURL: string = "SecurityQuestions/DeleteSecurityQuestions";
  constructor(private commonService: CommonService) { }
  getAll(filterModel: FilterModel): any {
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
    return this.commonService.getAll(url, {});
  }
  getById(id: string) {
    return this.commonService.getById(this.getByIdURL + '/' +id, {});
  }
  // validate(name: string) {
  //   return this.commonService.getById(
  //     this.checkServiceNameExistsURL + name,
  //     {}
  //   );
  // }
  create(serviceModel: SecurityQuestionModel): Observable<SecurityQuestionModel> {
    return this.commonService.post(this.createURL, serviceModel);
  }
  delete(id: number) {
    return this.commonService.patch(this.deleteURL + '/' + id, {});
  }
}
