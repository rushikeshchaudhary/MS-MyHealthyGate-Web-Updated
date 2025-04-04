import { Component, OnInit } from "@angular/core";

import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TicketDialogComponent } from "./ticket-dialog/ticket-dialog.component";

import { DatePipe } from "@angular/common";
import { ImageViewerComponent } from "./image-viewer/image-viewer.component";

import { debounce, debounceTime, distinctUntilChanged, filter, switchMap, tap } from "rxjs/operators";

import { Observable, Subscription, of, timer } from "rxjs";

import { NotifierService } from "angular-notifier";

import {
  GetTicketRequestModel,
  Metadata,
} from "src/app/super-admin-portal/core/modals/common-model";
import {
  GetRaisedTicketByIdResponceModel,
  Ticket,
  UserDocumentReq,
} from "src/app/platform/modules/client-portal/client-profile.model";
import { SharedService } from "../shared.service";
import { DialogService } from "../layout/dialog/dialog.service";
import { Router } from "@angular/router";
import { CommonService } from "src/app/platform/modules/core/services/common.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-raise-ticket",
  templateUrl: "./raise-ticket.component.html",
  styleUrls: ["./raise-ticket.component.css"],
})
export class RaiseTicketComponent implements OnInit {
  ticket: Ticket = {
    id: "",
    category: "",
    priority: "",
    description: "",
    files: [],
    status: "pending",
    remarks: "",
  };
  userId!: number;

  metadata: Metadata;
  userDocRequest: UserDocumentReq;
  ticketForm!: FormGroup;

  subscription!: Subscription;
  filterTicketList: GetRaisedTicketByIdResponceModel[] = [];
  getTicketRequestModel: GetTicketRequestModel;
  testFormGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private notifier: NotifierService,
    private dialogService: DialogService,
    private router: Router,
    private commonServiceCore: CommonService,
    private translate: TranslateService,

  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.metadata = new Metadata();
    this.getTicketRequestModel = new GetTicketRequestModel();
    this.userDocRequest = new UserDocumentReq();
    this.getTicketRequestModel.sortColumn = "ticketid";
    this.getTicketRequestModel.sortOrder = "desc";
  }
  displayColumns: Array<any> = [
    {
      displayName: "Ticket Id",
      key: "ticketId",
      isSort: true,
      class: "",
    },
    {
      displayName: "category",
      key: "category",
      isSort: true,
      class: "",
    },
    {
      displayName: "Priority",
      key: "priority",
      isSort: true,
      class: "",
    },

    {
      displayName: "description",
      key: "description",
      class: "",
    },
    {
      displayName: "status",
      key: "status",
      isSort: true,
      class: "",
    },
    {
      displayName: "remarks",
      key: "remarks",
      // isSort: true,
      class: "",
    },
    {
      displayName: "actions",
      key: "Actions",
      class: "",
    },
  ];

  actionButtons: Array<any> = [
    //{ displayName: "Download", key: "download", class: "fa fa-download" },
    { displayName: "View", key: "view", class: "fa fa-eye" },
    { displayName: "Delete", key: "delete", class: "fa fa-trash" },
    // { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
  ];

  ngOnInit(): void {
    this.testFormGroup = this.formBuilder.group({
      searchKey: "",
      rangeStartDate: null,
      rangeEndDate: null,
    });

    // this.testFormGroup
    //   .get("searchKey")!
    //   .valueChanges.pipe(
    //     filter((value: string) => value.length === 0 || value.length >= 3),
    //     tap(() => {
    //       this.getAllUserTickets();
    //     })
    //   )
    //   .subscribe();
    this.testFormGroup.get("searchKey")!.valueChanges.pipe(
      distinctUntilChanged(),
      debounce(input => input.length <= 3 ? timer(3000):timer(0)),
      switchMap(searchTerm => this.searchapi(searchTerm))
    ).subscribe();


    this.setIntialValues();
    this.getAllUserTickets();
  }


  searchapi(searchterm?: string): Observable<any> {
    this.getAllUserTickets();
    return of(null);
  }


  get f() {
    return this.testFormGroup.controls;
  }

  setIntialValues() {
    var date = new Date();

    this.f['rangeStartDate'].setValue(null);
    this.f['rangeEndDate'].setValue(null);
  }

  applyEndDateFilter(event: MatDatepickerInputEvent<Date>) {
    const endDate = event.value;
    this.f['rangeEndDate'].setValue(event.value ? new Date (event.value) : null);
    this.getAllUserTickets();
  }

  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    const startDate = event.value;
    this.f['rangeStartDate'].setValue(event.value ? new Date (event.value) : null);
    this.getAllUserTickets();
  }

  formatDate(date: Date): string {
    if (!date) {
      return "";
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    return formattedDate;
  }

  getAllUserTickets(): void {
    this.getTicketRequestModel.fromDate = this.formatDate(
      this.f['rangeStartDate'].value
    );
    this.getTicketRequestModel.toDate = this.formatDate(
      this.f['rangeEndDate'].value
    );
    this.getTicketRequestModel.searchText =
      this.f['searchKey'].value == null ? "" : this.f['searchKey'].value;
    this.subscription = this.sharedService
      .GetAllUserRaisedTickets(this.getTicketRequestModel)
      .subscribe(
        (res) => {
          console.log("get res", res);
          if (res.statusCode === 200 && res.data) {
            this.filterTicketList = res.data.map((data: { ticketId: any; categoryName: any; status: any; priority: any; description: any; remarks: any; creatorName: any; createdDate: any; files: { map: (arg0: (file: { fileName: any; base64: any; fileId: any; ticketId: any; }) => { fileName: any; base64: any; fileId: any; ticketId: any; }) => never[]; }; }) => {
              const ticketData:any = {
                ticketId: data.ticketId,
                category: data.categoryName,
                status: data.status,
                priority: data.priority,
                description: data.description,
                remarks: data.remarks || "",

                creatorName: data.creatorName,
                createdDate: data.createdDate,
                files: [],
              };

              if (data.files && Array.isArray(data.files)) {
                ticketData.files = data.files.map((file: { fileName: any; base64: any; fileId: any; ticketId: any; }) => ({
                  fileName: file.fileName,
                  base64: file.base64,
                  fileId: file.fileId,
                  ticketId: file.ticketId,
                }));
              }

              return ticketData;
            });

            this.mapMetadata(res.meta);
            this.metadata.pageSizeOptions = [5, 10, 25, 50, 100];
          } else {
            this.filterTicketList = [];
            this.metadata.totalRecords = 0;
            this.metadata.pageSize = 5;
            this.metadata.currentPage = 1;
            this.metadata.totalPages = 0;
            this.metadata.defaultPageSize = 5;
            console.error("Error loading user tickets. Response:", res);

            console.log("filtered list", this.filterTicketList);
          }
        },
        (error) => {
          console.error("Error loading user tickets", error);
        }
      );
  }

  clearFilters(): void {
    this.testFormGroup.reset({
      searchKey: "",
      rangeStartDate: null,
      rangeEndDate: null,
    });
    this.getAllUserTickets();
  }

  mapMetadata(apiMetadata: any): Metadata {
    this.metadata.totalRecords = apiMetadata.totalRecords;
    this.metadata.pageSize = apiMetadata.pageSize;
    this.metadata.currentPage = apiMetadata.currentPage;
    this.metadata.totalPages = apiMetadata.totalPages;
    this.metadata.defaultPageSize = apiMetadata.defaultPageSize;
    this.metadata.pageSizeOptions = apiMetadata.pageSizeOptions || [
      5, 10, 25, 50, 100,
    ];
    return this.metadata;
  }

  // setTicketList(arr: GetRaisedTicketByIdResponceModel[]) {
  //   this.filterTicketList = [...arr];

  // }

  openTicketForm() {
    const dialogRef = this.dialog.open(TicketDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.getAllUserTickets();
      console.log("1:", this.filterTicketList);
    });
  }
  onTableActionClick(actionObj?: any) {
    switch (actionObj.action) {
      case "view":
        console.log(actionObj);
        this.openImageViewerDialog(actionObj.data.files);
        break;
      case "delete":
        this.deleteRaisedTicket(actionObj);
        break;
      default:
        this.router.navigate(["web/ticket"], {
          queryParams: {
            ticketid: this.commonServiceCore.encryptValue(
              actionObj.data.ticketId,
              true
            ),
          },
        });
        break;
    }
  }
  openImageViewerDialog(files: File[]): void {
    const dialogRef = this.dialog.open(ImageViewerComponent, {
      data: { Files: files },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  onPageOrSortChange = (e: { pageIndex: number; pageSize: number; sort: string; order: string; }) => {
    console.log("onsortpage", e);
    this.getTicketRequestModel.pageNumber = e.pageIndex + 1;
    this.getTicketRequestModel.pageSize = e.pageSize;
    this.getTicketRequestModel.sortColumn = e.sort;
    this.getTicketRequestModel.sortOrder = e.order;
    this.getAllUserTickets();
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deleteRaisedTicket = (actionObj: { data: { ticketId: number; }; }) => {
    this.dialogService
      .confirm("Are you sure you want to delete this ticket?")
      .subscribe((result: any) => {
        if (result == true) {
          this.sharedService
            .DeleteUserRaisedTicketById(actionObj.data.ticketId)
            .subscribe((res) => {
              if (res.statusCode === 200 && res.data) {
                this.notifier.notify("success", res.message);
                this.getAllUserTickets();
              } else {
                this.notifier.notify("error", res.message);
              }
            });
        }
      });
  };
}
