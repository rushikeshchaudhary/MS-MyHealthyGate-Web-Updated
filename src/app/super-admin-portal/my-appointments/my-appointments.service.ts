import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { FilterModel } from '../core/modals/common-model';
import { CommonService } from '../core/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class MyAppointmentsService {
  getByIdURL = "MasterLocations/GetLocationById";
  getAllPatientsForDDL = "Patients/GetAllPatientList";
  getAllProvidersForDDL = "Staffs/GetAllProvidersForDDL";
  getAllURL = "api/PatientAppointments/GetAllPatientAppointmentList";

  constructor(private commonService: CommonService) { }
  getQueryParamsFromObject = (filterModal: any): string => {
    let queryParams = "";
    let index = 0;
    for (const key of Object.keys(filterModal)) {
      if (index === 0) queryParams += `?${key}=${filterModal[key]}`;
      else queryParams += `&${key}=${filterModal[key]}`;
  
      index++;
    }
    return queryParams;
  }

  getListData(filterModal: any): Observable<any> {
    // ?locationIds=1&fromDate=2018-11-11&toDate=2018-11-17&staffIds=3
    const queryParams = this.getQueryParamsFromObject(filterModal);
    
    return this.commonService.getAll(this.getAllURL + queryParams, {});
  }

  getAllProviders(): Observable<any> {
    
    return this.commonService.getAll(this.getAllProvidersForDDL, {});
  }

  getAllPatients(): Observable<any> {
    
    return this.commonService.getAll(this.getAllPatientsForDDL, {});
  }
}
