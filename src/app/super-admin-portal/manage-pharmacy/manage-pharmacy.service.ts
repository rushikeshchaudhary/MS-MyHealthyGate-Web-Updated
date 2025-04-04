import { Injectable } from "@angular/core";
import { FilterModel } from "../core/modals/common-model";
import { CommonService } from "../core/services/common.service";
import { AdsModel } from "../manage-ads/manage-ads.component";
import { ManagePharmacy } from "./manage-pharmacy.model";

@Injectable({
  providedIn: "root",
})
export class ManagePharmacyService {
  private getPharmacyListURL = "Pharmacy/GetPharmacy";
  updateStatusURL: string = "Pharmacy/UpdatePharmacyIsApproveStatus";
  CreateAdsURL: string = "Pharmacy/CreateAds";
  private getAdsURL: string = "Pharmacy/GetAds";
  private getAllAdsURL: string = "Pharmacy/GetAdsOnHome";
  private updateAdsStatusURL: string = "Pharmacy/UpdateAdsStatus";
  private getAllRadiologistsURL: string = "Radiology/GetAllRadiologists";

  constructor(private commonService: CommonService) {}

  getAllPharmacy(filterModel: FilterModel) {
    let url = `${this.getPharmacyListURL}?pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}&searchText=${filterModel.searchText}`;
    return this.commonService.getAll(url, {});
  }
  updatePharmacyIsApproveStatus(pharmacyModel: ManagePharmacy) {
    return this.commonService.post(this.updateStatusURL, pharmacyModel);
  }
  getAds() {
    return this.commonService.getAll(this.getAdsURL, {});
  }
  createAds(adModel: AdsModel) {
    return this.commonService.post(this.CreateAdsURL, adModel);
  }
  getAllAds() {
    return this.commonService.getAll(this.getAllAdsURL, {});
  }
  updateAdsStatus(adsModel: AdsModel) {
    return this.commonService.post(this.updateAdsStatusURL, adsModel);
  }
  getAllRadiologists(filterModel: FilterModel) {
    let url = `${this.getAllRadiologistsURL}?pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}&searchText=${filterModel.searchText}`;
    return this.commonService.getAll(url, {});
  }
}
