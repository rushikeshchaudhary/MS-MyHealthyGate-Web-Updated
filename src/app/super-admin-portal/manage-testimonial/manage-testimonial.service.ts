import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterModel } from '../core/modals/common-model';
import { CommonService } from '../core/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ManageTestimonialService {
  getAllTestimonialURL = 'MasterTestimonial/GetAllTestimonial';
  getByIdURL = "MasterTestimonial/GetTestimonialById";
  createURL = "MasterTestimonial/SaveTestimonial";
  uploadProfilePic = "MasterTestimonial/UploadProfilePic";
  getMasterDataURL = "api/MasterData/MasterDataByName";

  constructor(private commonService: CommonService) { }

  getAllTestimonial(filterModel: FilterModel) {
    let url = `${this.getAllTestimonialURL}?pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}&searchText=${filterModel.searchText}`;
    return this.commonService.getAll(url, {});
  }
  getById(id: number) {
    let url = `${this.getByIdURL}?id=${id}`;
    return this.commonService.getById(url,{});
  }
  save(TestimonialModel: any) {
    return this.commonService.post(this.createURL, TestimonialModel);
  }

  uploadFile(TestimonialModel: any) {
    
    return this.commonService.post(this.uploadProfilePic, TestimonialModel);
  }

  getMasterData(masterData: any): Observable<any> {
    return this.commonService.post(this.getMasterDataURL, masterData)
  }
}
