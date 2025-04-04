import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Router } from "@angular/router";
import { FilterModel, ResponseModel } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { ClientsService } from "../clients.service";


@Component({
  selector: 'app-favourite-lab',
  templateUrl: './favourite-lab.component.html',
  styleUrls: ['./favourite-lab.component.css']
})
export class FavouriteLabComponent implements OnInit {
  labList: Array<any> = [];
  favouriteLabForm!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  favouriteList: Array<any> = [];
  metaData: any;
  displayColumns: Array<any> = [
    {
      displayName: "lab_name",
      key: "labName",
      isSort: true,
      class: "",
    },
    //{ displayName: "IsActive", key: 'isActive', isSort: true, class: "", width: "15%" },
    {
      displayName: "Actions",
      key: "Actions",
      isSort: true,
      class: "",
    },
  ];
  actionButtons: Array<any> = [
    { displayName: "Delete", key: "delete", class: "fa fa-trash" },
  ];
  subscription: any;
  patientId!: number;
  userId!: number;
  filter!: FilterModel;

  constructor(
    private commonService: CommonService,
    private notifier: NotifierService,
    private clientService: ClientsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.filter = new FilterModel();
    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          // console.log(user);
          this.patientId = user.id;
          this.userId = user.userID;
        }
      }
    );

    this.favouriteLabForm = this.formBuilder.group({
      id: "",
      lab: [Validators.required],
      isActive: true,
    });
    this.bindLabList();
    this.getFavouriteLabList(this.filter);
  }
  get f() {
    return this.favouriteLabForm.controls;
  };

  bindLabList() {
    let roleId = 325;
    const data = {
      pageNumber: 1,
      pageSize: 100000,
      sortColumn: "",
      sortOrder: "",
      searchText: "",
      roleId: roleId
    };
    this.clientService.getAllLabApprovedListist(data)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.labList = response.data.filter((d:any) => {
            return d.fullName  != null;
          });
        }
      });
  };

  onSubmit():any{
    // console.log(this, this.favouriteLabForm.value);
    if (
      this.favouriteLabForm.invalid ||
      typeof this.favouriteLabForm.value.lab != "number"
    ) {
      return this.favouriteLabForm;
    } else {
      // if (this.favouriteList) {
      //   let isValid = this.favouriteList.filter(
      //     (d) => d.labId == this.favouriteLabForm.value.lab
      //   );
      //   if (isValid && isValid.length > 0) {
      //     this.notifier.notify(
      //       "error",
      //       "Lab Already added to favourites."
      //     );
      //     return;
      //   }
      // }
      var postData: any = {
        LabId: this.favouriteLabForm.value.lab,
        IsActive: true,
        UpdateBy: this.userId,
        Id:
          this.favouriteLabForm.value.id == ""
            ? 0
            : this.favouriteLabForm.value.id,
        PatientId: this.patientId,
        CreatedBy: this.userId,
      };
      this.clientService
        .addFavouriteLab(postData)
        .subscribe((response: ResponseModel) => {
          if (response.statusCode == 200) {
            this.notifier.notify("error", "Lab Already added to favourites.");
            this.favouriteLabForm.reset();
            this.getFavouriteLabList(this.filter);
          }
          if(response.statusCode==201){
            this.notifier.notify("success", response.message);
            this.favouriteLabForm.reset();
            this.getFavouriteLabList(this.filter);
          }
        });
    }
    return;
  };

  getFavouriteLabList(filter: FilterModel) {
    this.clientService
      .getAllFavouriteLabList(filter, this.patientId)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.favouriteList = response.data;
          this.metaData = response.meta;
          if (this.metaData) {
            this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
          }
        } else {
          this.favouriteList = [];
          this.metaData = null;
        }
        //this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  };

  onTableActionClick(actionObj?: any) {
    const data = actionObj.data;
    // console.log(actionObj);
    if (actionObj.action == "delete") {
      this.favouriteLabForm = this.formBuilder.group({
        lab: [data.labId],

        isActive: false,
        id: data.id,
      });
      var postData: any = {
        LabId: data.labId,
        IsActive: false,
        UpdateBy: this.userId,
        Id: data.id,
        PatientId: this.patientId,
        CreatedBy: this.userId,
      };
      this.clientService
        .addFavouriteLab(postData)
        .subscribe((response: ResponseModel) => {
          if (response.statusCode == 200) {
            // console.log(response.data);
            this.notifier.notify("success", "deleted successfully");
            this.favouriteLabForm.reset();
            this.getFavouriteLabList(this.filter);
          }
        });
    } else {
      this.router.navigate([
        "web/client/lab/" + actionObj.data.labId,
      ]);
    }
  };


  setPagePaginator = (event: any) => {
    console.log(event);
    debugger
    this.filter.pageSize = event.pageSize;
    this.filter.pageNumber = event.pageNumber;
    this.getFavouriteLabList(this.filter);
   
  };
}
