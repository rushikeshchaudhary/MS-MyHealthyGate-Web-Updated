import { Injectable } from "@angular/core";
import { FilterModel } from "../core/modals/common-model";
import { CommonService } from "../core/services/common.service";
import { ProviderModel } from "./provider-model.model";

@Injectable({
  providedIn: "root",
})
export class ManageProvidersService {
  getAllURL: string = "Staffs/GetAllProviders";
  getTopProviderURL: string = "Staffs/GetTopProviders";
  updateStatusURL: string = "Staffs/UpdateProviderIsApproveStatus";
  updateProviderURL: string = "Staffs/UpdateTopProvider";
  SuperAdminActionURL: string = "Staffs/SuperAdminAction";
  constructor(private commonService: CommonService) {}
  getAllProviders(filterModel: FilterModel,isApprove:any, isBlock:any,isActive:any) {
    let url: string = `${this.getAllURL}?pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}&searchText=${filterModel.searchText}&isAprove=${isApprove}&isBlock=${isBlock}&isActive=${isActive}`;
    return this.commonService.getAll(url, {});
  }
  getTopProviders(filterModel: FilterModel) {
    let url: string = `${this.getTopProviderURL}?pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}&searchText=${filterModel.searchText}`;
    return this.commonService.getAll(url, {});
  }
  updateProviderIsApproveStatus(providerModel: ProviderModel) {
    return this.commonService.post(this.updateStatusURL, providerModel);
  }
  updateTopProviders(providerModel: any) {
    return this.commonService.post(this.updateProviderURL, providerModel);
  }

  superAdminActionOnUser=(data:any)=>{
    return this.commonService.post(this.SuperAdminActionURL,data);
  }
}
