import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { FilterModel } from '../core/modals/common-model';
import { CommonService } from '../core/services/common.service';
import { StaticPageModel } from './manage-static-page.component';

@Injectable({
  providedIn: 'root'
})
export class ManageStaticPageService {
  private getAllURL: string = 'DynamicPage/GetAll';
  private getPageByIdURL: string = 'DynamicPage/GetPageById';
  private createOrUpdateURL: string = 'DynamicPage/AddStaticPage';

  constructor(private commonService: CommonService) { }

  getAllPages(filterModel: FilterModel) {
    var url = `${this.getAllURL}?sortOrder=${filterModel.sortOrder}&sortColumn=${filterModel.sortColumn}&pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}`;
    return this.commonService.getAll(url, {});
  }

  getPageById(id: number) {
    var url = `${this.getPageByIdURL}?id=${id}`;
    return this.commonService.getById(url, id);
  }

  createOrUpdatePage(data: StaticPageModel) {
    return this.commonService.post(this.createOrUpdateURL, data);
  }
}
