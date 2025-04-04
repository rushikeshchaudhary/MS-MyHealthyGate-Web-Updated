import { Injectable } from '@angular/core';
import { FilterModel } from '../core/modals/common-model';
import { CommonService } from '../core/services/common.service';
import { ManageLabs } from './manage-labs.model';

@Injectable({
  providedIn: 'root'
})
export class ManageLabsService { 
  getLabsListURL ="Labs/GetLabs";
  updateStatusURL: string = "Labs/UpdateLabIsApproveStatus";

  constructor(private commonService: CommonService) { }

  getAllLabs(filterModel: FilterModel){    
  let url = `${this.getLabsListURL}?pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}&searchText=${filterModel.searchText}`;
    return this.commonService.getAll(url, {});
  }
  updateLabIsApproveStatus(labModel: ManageLabs) {
    return this.commonService.post(this.updateStatusURL, labModel);
  }
}
