import { Injectable } from '@angular/core';
import { FilterModel, SuperAdminGetPatientsRequest } from '../core/modals/common-model';
import { CommonService } from '../core/services';

@Injectable({
  providedIn: 'root'
})
export class ManagePatientService {

  getAllURL: string = "Patients/GetPatientList";
  constructor(private commonService: CommonService) { }

  getAll(filterModel: SuperAdminGetPatientsRequest, isActive:any, isBlock:any) {
    var url: string = `${this.getAllURL}?pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}&searchText=${filterModel.searchText}&isBlock=${isBlock}&isActive=${isActive}`;
    return this.commonService.getAll(url, {});
  }
}
