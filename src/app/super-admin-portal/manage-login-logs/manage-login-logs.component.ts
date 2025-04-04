import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FilterModel } from "src/app/platform/modules/core/modals/common-model";
import { ResponseModel } from "../core/modals/common-model";
import { ManageLogsService } from "./manage-logs.service";

@Component({
  selector: "app-manag-login-logs",
  templateUrl: "./manage-login-logs.component.html",
  styleUrls: ["./manage-login-logs.component.css"],
})
export class ManageLoginLogsComponent implements OnInit {
  displayColumns: Array<any> = [
    {
      displayName: "Username",
      key: "userName",
      isSort: true,
      class: "",
      width: "15%",
    },
    {
      displayName: "Role",
      key: "roleName",
      isSort: true,
      class: "",
      width: "15%",
    },
    {
      displayName: "LoginAt",
      key: "loginDate",
      isSort: true,
      class: "",
      width: "15%",
    },
    {
      displayName: "IsActive",
      key: "active",
      isSort: true,
      class: "",
      width: "15%",
    },
  ];
  logs: Array<any> = [];
  metaData: any;
  searchText: string = "";
  filterModel!: FilterModel;
  constructor(
    private logService: ManageLogsService,
    private datepipe: DatePipe
  ) {}

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getAllLogs();
  }

  getAllLogs() {
    this.logService
      .getAllLogs(this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.logs = response.data;
          this.logs.forEach((d) => {
            d.active = d.isActive ? "Yes" : "No";
            d.loginDate = this.datepipe.transform(
              d.loginDate,
              "MMM d, y, h:mm:ss a"
            );
          });
          this.metaData = response.meta;
        } else {
          this.logs = [];
          this.metaData = null;
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      ""
    );
    this.getAllLogs();
  }

  clearFilters() {
    this.searchText = "";
    this.filterModel.searchText = "";
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.filterModel.searchText
    );
    this.getAllLogs();
  }
  applyFilter(searchText: string = "") {
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.searchText
    );
    if (this.searchText.trim() == "" || this.searchText.trim().length >= 3)
      this.getAllLogs();
  }
  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    searchText: string
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder != undefined ? sortOrder : "";
    this.filterModel.sortColumn = sortColumn != undefined ? sortColumn : "";
    this.filterModel.searchText = searchText != undefined ? searchText : "";
  }
}
