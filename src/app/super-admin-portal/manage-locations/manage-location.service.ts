import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterModel } from '../core/modals/common-model';
import { CommonService } from '../core/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ManageLocationService {
  getAllLocationsURL = 'MasterLocations/GetAllLocations';
  getByIdURL = "MasterLocations/GetLocationById";
  createURL = "MasterLocations/SaveLocation";
  getMasterDataURL = "api/MasterData/MasterDataByName";

  constructor(private commonService: CommonService) { }

  getAllLocations(filterModel: FilterModel) {
    let url = `${this.getAllLocationsURL}?pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}&searchText=${filterModel.searchText}`;
    return this.commonService.getAll(url, {});
  }
  getById(id: number) {
    let url = `${this.getByIdURL}?id=${id}`;
    return this.commonService.getById(url, id);
  }
  save(locationModel: any) {
    return this.commonService.post(this.createURL, locationModel);
  }
  getMasterData(masterData: any): Observable<any> {
    return this.commonService.post(this.getMasterDataURL, masterData)
  }
}
