import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";

@Injectable({
  providedIn: "root",
})
export class ClientListService {
  private getPatientsURL = "Patients/GetPatients";
  private GetStaffAllClientsUrl = "Staffs/GetStaffAllClients";
  constructor(private commonService: CommonService) {}
  getPatients(searchKey: string, locationId: number, isActive: boolean) {
    let url =
      this.getPatientsURL +
      "?LocationIDs=" +
      locationId +
      "&searchKey=" +
      searchKey +
      (isActive == undefined ? "" : "&isActive=" + isActive);
    return this.commonService.getAll(url, {}, true);
  }

  getStaffClient = (data:any) => {
    let url = `?staffId=${data.staffId}&searchText=${data.searchText}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}&sortColumn=${data.sortColumn}&sortOrder=${data.sortOrder}`;
    return this.commonService.get(this.GetStaffAllClientsUrl + url);
  };
}
