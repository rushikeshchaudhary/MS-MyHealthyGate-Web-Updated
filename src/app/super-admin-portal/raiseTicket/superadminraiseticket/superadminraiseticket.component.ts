import { Component, OnInit } from "@angular/core";

import {
  GetRaisedTicketByIdResponceModel,
  Metadata,
  Ticket,
  UserDocumentReq,
} from "src/app/platform/modules/client-portal/client-profile.model";
import { NotifierService } from "angular-notifier";
import { CommonService } from "src/app/platform/modules/core/services/common.service";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Observable, Subscription, of, timer } from "rxjs";
import { SuperadminupdateraiseticketComponent } from "./superadminupdateraiseticket/superadminupdateraiseticket.component";
import { SuperadminImageviewerComponent } from "./superadmin-imageviewer/superadmin-imageviewer.component";
import { SuperadminRaiseticketService } from "./superadmin-raiseticket.service";
import {
  FilterModel,
  GetTicketRequestModel,
} from "../../core/modals/common-model";
import { SharedService } from "src/app/shared/shared.service";
import { debounce, debounceTime, distinctUntilChanged, filter, switchMap, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";

@Component({
  selector: "app-superadminraiseticket",
  templateUrl: "./superadminraiseticket.component.html",
  styleUrls: ["./superadminraiseticket.component.css"],
})
export class SuperadminraiseticketComponent implements OnInit {
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
  filterModel!: FilterModel;
  subscription!: Subscription;
  filterTicketList: GetRaisedTicketByIdResponceModel[] = [];
  getTicketRequestModel: GetTicketRequestModel;
  testFormGroup!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private notifier: NotifierService,
    private ticketRaiseService: SuperadminRaiseticketService,
    private datePipe: DatePipe,
    private router: Router,
    private dialogService: DialogService,
    private commonServiceCore: CommonService
  ) {
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
      displayName: "Raised By",
      key: "creatorName",
      isSort: true,
      class: "",
    },
    {
      displayName: "Category",
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
      displayName: "Description",
      key: "description",
      class: "",
    },
    {
      displayName: "Status",
      key: "status",
      isSort: true,
      class: "",
    },
    {
      displayName: "remarks",
      key: "remarks",
      //isSort: true,
      class: "",
    },
    {
      displayName: "Created Date",
      key: "createdDate",
      isSort: true,
      class: "",
    },
    {
      displayName: "Actions",
      key: "Actions",
      class: "",
    },
  ];

  actionButtons: Array<any> = [
    //{ displayName: "Download", key: "download", class: "fa fa-download" },
    { displayName: "View document", key: "view", class: "fa fa-eye" },
    { displayName: "Delete", key: "delete", class: "fa fa-trash" },
    { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
  ];

  ngOnInit(): void {
    this.testFormGroup = this.fb.group({
      searchKey: "",
      rangeStartDate: null,
      rangeEndDate: null,
    });

    // this.testFormGroup
    // .get("searchKey")!
    // .valueChanges.pipe(
    //   filter((value: string) => value.length === 0 || value.length >= 3),
    //   tap(() => {
    //     this.getAllUserTickets();
    //   })
    // )
    // .subscribe();

    this.testFormGroup.get("searchKey")!.valueChanges.pipe(
      distinctUntilChanged(),
      debounce(input => input.length <= 3 ? timer(3000) : timer(0)),
      switchMap(searchTerm => this.searchapi(searchTerm))
    ).subscribe();

    // this.getAllUserTickets();
    this.setIntialValues();
  }


  searchapi(searchterm?: string): Observable<any> {
    this.getAllUserTickets();
    return of(null);
  }

  get f() {
    return this.testFormGroup.controls;
  }

  setIntialValues() {
    // var date = new Date();
    // this.f.rangeStartDate.setValue(
    //   new Date(date.getFullYear(), date.getMonth() - 0, 1)
    // );
    // this.f.rangeEndDate.setValue(
    //  // new Date(date.getFullYear(), date.getMonth() + 1, 0)
    //  new Date()
    // );
    this.f['rangeStartDate'].setValue(null);
    this.f['rangeEndDate'].setValue(null);
    this.getAllUserTickets();
  }

  applyEndDateFilter(event: MatDatepickerInputEvent<Date>) {
    const endDate = event.value;
    this.f['rangeEndDate'].setValue(event.value ? new Date(event.value) : null);
    this.getAllUserTickets();
  }

  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    const startDate = event.value;
    this.f['rangeStartDate'].setValue(event.value ? new Date(event.value) : null);
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
            this.filterTicketList = res.data.map((data:any) => {
              const ticketData:any = {
                ticketId: data.ticketId,
                category: data.categoryName,
                status: data.status,
                priority: data.priority,
                description: data.description,
                remarks: data.remarks || "",

                creatorName: data.creatorName,
                //  createdDate: data.createdDate,
                createdDate: this.datePipe.transform(
                  data.createdDate,
                  "dd-MM-yyyy"
                ),
                files: [],
              };

              if (data.files && Array.isArray(data.files)) {
                ticketData.files = data.files.map((file:any) => ({
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

  setTicketList(arr: GetRaisedTicketByIdResponceModel[]) {
    this.filterTicketList = [...arr];
  }

  onTableActionClick(actionObj?: any) {
    console.log(actionObj);
    switch (actionObj.action) {
      //  case "DOWNLOAD":
      // //   //  this.getUserDocument(actionObj);
      // console.log(actionObj);
      //    break;
      case "view":
        console.log(actionObj);
        this.openImageViewerDialog(actionObj.data.files);
        break;
      case "delete":
        // this.sharedService.DeleteUserRaisedTicketById(actionObj.data.ticketId).subscribe((res) => {
        //   if (res.statusCode === 200 && res.data) {
        //     this.notifier.notify("success", res.message);
        //     this.filterTicketList = this.filterTicketList.filter(ticket => ticket.ticketId !== actionObj.data.ticketId);
        //     this.getAllUserTickets();
        //   }
        //   else {
        //     this.notifier.notify("error", res.message);
        //   }
        // },
        //   (error) => {
        //     console.error('Error loading user tickets', error);
        //   });

        // this.setTicketList(this.filterTicketList);
        this.deleteRaisedTicket(actionObj);
        break;
      case "edit":
        console.log(actionObj);
        this.openUpdateTicketDialog(actionObj.data);
        break;
      default:
        this.router.navigate(["webadmin/ticket"], {
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

  deleteRaisedTicket = (actionObj:any) => {
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

  openImageViewerDialog(files: File[]): void {
    // console.log("openImageViewerDialog",files);
    const dialogRef = this.dialog.open(SuperadminImageviewerComponent, {
      data: { Files: files },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  openUpdateTicketDialog(ticket: Ticket): void {
    const dialogRef = this.dialog.open(SuperadminupdateraiseticketComponent, {
      data: { Ticket: ticket },
    });

    dialogRef
      .afterClosed()
      .subscribe((updatedTicket: GetRaisedTicketByIdResponceModel) => {
        if (updatedTicket) {
          this.sharedService
            .OnUpdateTicket({
              userId: 1,
              ticketId: updatedTicket.ticketId,
              status: updatedTicket.status,
              remarks: updatedTicket.remarks,
            })
            .subscribe(
              (response) => {
                if (response.statusCode === 200 && response.data) {
                  const index = this.filterTicketList.findIndex(
                    (doc) => doc.ticketId === updatedTicket.ticketId
                  );

                  this.filterTicketList[index] = updatedTicket;
                  this.notifier.notify("success", response.message);
                  this.setTicketList(this.filterTicketList);
                } else {
                  this.notifier.notify("error", response.message);
                }
              },
              (error) => {
                console.error("Error:", error);
              }
            );
        }
      });
  }

  // setTablePageList() {
  //   const startIndex = (this.metadata.currentPage - 1) * this.metadata.pageSize;
  //   const endIndex = startIndex + this.metadata.pageSize;
  //   this.dummyTickets = this.filterTicketList.slice(startIndex, endIndex);
  // }

  onPageOrSortChange = (e:any) => {
    console.log("onsortpage", e);
    this.getTicketRequestModel.pageNumber = e.pageIndex + 1;
    this.getTicketRequestModel.pageSize = e.pageSize;
    this.getTicketRequestModel.sortColumn = e.sort;
    this.getTicketRequestModel.sortOrder = e.order;
    this.getAllUserTickets();
  };

  clearFilters(): void {
    this.testFormGroup.reset({
      searchKey: "",
      rangeStartDate: null,
      rangeEndDate: null,
    });
    this.getAllUserTickets();
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }
}
