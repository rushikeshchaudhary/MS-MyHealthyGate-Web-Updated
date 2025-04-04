import { DatePipe } from "@angular/common";
import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";

import { EMPTY, merge, Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { Metadata } from "src/app/super-admin-portal/core/modals/common-model";
 
// const displayedColumns: Array<any> = [
//   { displayName: 'Service Code', key: 'serviceCode', isSort: true, class: '' },
//   { displayName: 'Description', key: 'description', isSort: true, class: '' },
//   { displayName: 'Billable', key: 'isBillable' },
//   { displayName: 'Unit Duration', key: 'unitDuration' },
//   { displayName: 'Rate Per Unit', key: 'ratePerUnit' },
//   { displayName: 'Required Authorization', key: 'isRequiredAuthorization' },
// ];
 
@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() inputSource: any[]=[];
  @Input() inputColumns: any[]=[];
  @Input() inputMeta: any;
  @Input() inputButtons: any[]=[];
  @Output() onChange = new EventEmitter();
  @Output() onTableActionClick = new EventEmitter();
  @Output() onPageOrSortChange = new EventEmitter();
  @Output() onClicks = new EventEmitter();
  @Input() stickyHeader!: boolean;
  @Input() showTooltip!: boolean;
  displayedColumns: Array<any>=[];
  extraColumns: Array<any>=[];
  columnsToDisplay!: Array<any>;
  // @Output() onToggleChange = new EventEmitter();
 
  // dataSource: MatTableDataSource<Array<any>> = new MatTableDataSource<
  //   Array<any>
  // >();
  dataSource: Array<any> = [];
  metaData!: Meta | any ;
  actionButton!: Array<any>;
  actions: any = "actions";
  noRecords!: Array<any>;
  isLoadingResults = true;
  tooltipText: any = "";
  UserRole:string="PROVIDER";
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(private translate: TranslateService) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language")|| "en");
  }
  ngOnInit() {
    //this.dataSource = new MatTableDataSource<Array<any>>();
    //let data = this.inputSource;
    this.noRecords = [{}];
    //this.metaData=new Metadata();
    // If the user changes the sort order, reset back to the first page.
    this.sort?.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    const sortChange$: Observable<Sort> = this.sort ? this.sort.sortChange.asObservable() : EMPTY;
    const pageChange$: Observable<PageEvent> = this.paginator ? this.paginator.page.asObservable() : EMPTY;
    merge(sortChange$, pageChange$).subscribe(() => {
      console.log(this.paginator);
      this.isLoadingResults = true;
      const changeState = {
        sort: this.sort?.active || "",
        order: this.sort?.direction || "",
        pageNumber: this.paginator.pageIndex + 1,
        pageSize: this.paginator.pageSize,
      };
      this.onChange.emit(changeState);
    });
  }
 
  checkDate(startDateTime: any) {
    if (new Date(startDateTime) > new Date()) {
      return true;
    } else {
      return false;
    }
  }
 
  isInvited(obj: any) {
    if (obj == "Invited") {
      return true;
    } else {
      return false;
    }
  }
  setColorToPendingStatusReplaceInvited(obj: any) {
    if (obj == "Invited") {
      return "#ff0000";
    } else {
      return null;
    }
  }
  replaceInvitedtoPeding(obj: any) {
    if (obj == "Invited") {
      //return "Invited/Pending";
      return "Pending";
    } else {
      return obj.value;
    }
  }
 
  makeDisable(row: any) {
    if (row.status == "Invited") {
      return true;
    } else {
      return false;
    }
  }
 
  getTootltip(row: any): any {
    if (row.statusName == "Approved") {
      return "Go to waiting room";
    } else if (row.statusName == "Pending") {
      return "Approve/Reject Appointment";
    }
    else if (row.statusName == "Completed") {
      return "Go to Past Appointment";
    }
  }
 
  convertDate(date: any) {
    if (date == "Invalid Date") {
      return "";
    } else {
      return new DatePipe("en-US").transform(date, "dd/MM/yyyy");
    }
  }
  getTootltipPatient(row: any): any {
    if (row.status == "Approved" || row.status == "Invited") {
      return "Go to waiting room";
    } else if (row.status == "Pending") {
      return "Approve/Reject Appointment";
    } else if (row.status == "Completed" || row.status == "Cancelled") {
      return "Review/Rating";
    }
   
  }
 
  getDoctorProfileTootltipPatient(row: any): string {    
   if (row.status == "Completed" || row.status == "Cancelled") {
     return "Go to doctor profile";
   }  
   else{
    return '';
   }
 }
 
 
 
  ngOnChanges(value: any) {
    this.tooltipText = this.showTooltip ? "Click to view options" : " ";
    if (value.inputColumns) {
      this.displayedColumns = (value.inputColumns.currentValue || []).filter(
        (x:any) => x.key != "Actions"
      );
      let changedColumns = (this.displayedColumns || []).map((obj) => obj.key);
      if (
        value.inputButtons != null &&
        value.inputButtons.currentValue.length > 0
      )
        changedColumns.push("Actions");
      this.columnsToDisplay = changedColumns;
      this.extraColumns = (value.inputColumns.currentValue || []).filter(
        (x:any) => x.key == "Actions"
      );
    }
    if (value.inputSource) {
      this.isLoadingResults = false;
      this.dataSource = value.inputSource.currentValue;
    }
    if (value.inputMeta) {
      this.metaData = value.inputMeta.currentValue || new Meta();
    }
    if (value.inputButtons) {
      this.actionButton = value.inputButtons.currentValue || [];
    }
  }
  onToggleClick(action: string, data: any, column: string) {
    const actionObj = {
      action,
      data,
      column,
    };
    this.onTableActionClick.emit(actionObj);
    this.onClicks.emit(data);
  }
  onActionClick(action: string, data: any) {
    console.log("000",action,data);
    const actionObj = {
      action,
      data,
    };
    this.onTableActionClick.emit(actionObj);
    this.onClicks.emit(data);
  }
  onActionClicks(action: string, data: any,navigate:any) {
    //console.log("000",action,data,navigate);
    const actionObj = {
      action,
      data,
      navigate,
    };
    this.onTableActionClick.emit(actionObj);
    this.onClicks.emit(data);
  }
  onCellClick(action: any, data: any) {
    const actionObj = {
      action,
      data,
    };
    this.onTableActionClick.emit(actionObj);
    this.onClicks.emit(data);
  }
  onToggleChange(event: any, data: any, action: string) {
    const actionObj = {
      state: event.checked,
      data,
      action,
    };
    this.onTableActionClick.emit(actionObj);
    this.onClicks.emit(data);
  }
 
  setColorToPendingStatus(obj: any) {
    if (obj == "Pending") {
      return "#ff0000";
    } else {
      return null;
    }
  }
  setColorToLabuploadStatus(obj: any) {
    if (obj == "Request Raised") {
      return "#FFA500";
    } else {
      return "#008000";
    }
  }
  setToolTip(obj: any):any {
    if (obj.mrn && obj.isBlock) {
      return "The Patient is block";
    } else if (obj.roleID == 156 && obj.isBlock) {
      return "The Provider is block";
    } else if (obj.labId && obj.isBlock) {
      return "The Lab is block";
    } else if (obj.pharmacyId && obj.isBlock) {
      return "The Pharmacy is block";
    } else if (obj.radiologyID && obj.isBlock) {
      return "The Radiology is block";
    }
  }
 
  disabledtoggle(obj: any) {
    if (obj.statusName == "Completed") return true;
    return false;
  }
  checkblockorapproved(obj: any): any {
    if (obj.roleID == 156 && obj.isBlock) {
      return "red";
    } else if (obj.roleID == 156 && obj.isApprove) {
      return "#198754";
    } else if (obj.mrn && obj.isBlock) {
      return "red";
    } else if (obj.labId && obj.isBlock) {
      return "red";
    } else if (obj.labId && obj.isApprove) {
      return "#198754";
    } else if (obj.pharmacyId && obj.isBlock) {
      return "red";
    } else if (obj.pharmacyId && obj.isApprove) {
      return "#198754";
    } else if (obj.radiologyID && obj.isBlock) {
      return "red";
    } else if (obj.radiologyID && obj.isApprove) {
      return "#198754";
    }
  }
  onPageOrSortChangePagination(event: any) {
    console.log("called paginatot", event)
    this.onPageOrSortChange.emit(event);
  }
}
 
class Meta {
  //////debugger;
  totalPages?: number = 0;
  pageSize?: number = 5;
  currentPage?: number = 1;
  defaultPageSize?: number = 5;
  totalRecords?: number = 0;
  pageSizeOptions?: number[] = [];
}
 