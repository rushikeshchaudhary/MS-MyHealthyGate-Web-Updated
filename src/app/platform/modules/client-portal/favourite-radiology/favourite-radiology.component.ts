import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { FilterModel, ResponseModel } from '../../core/modals/common-model';
import { CommonService } from '../../core/services';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-favourite-radiology',
  templateUrl: './favourite-radiology.component.html',
  styleUrls: ['./favourite-radiology.component.css']
})
export class FavouriteRadiologyComponent implements OnInit {
  radiologyList: Array<any> = [];
  favouriteRadiologyForm!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  favouriteList: Array<any> = [];
  metaData: any;
  displayColumns: Array<any> = [
    {
      displayName: "radiology_name",
      key: "radiologyClinicName",
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

    this.favouriteRadiologyForm = this.formBuilder.group({
      id: "",
      radiology: [Validators.required],
      isActive: true,
    });
    this.bindRadiologyList();
    this.getFavouriteRadiologyList(this.filter);
  }
  get f() {
    return this.favouriteRadiologyForm.controls;
  };
  // bindRadiologyList() {
  //   let organizationId = 128;
  //   this.clientService.getAllRadiologyList(organizationId,this.patientId)
  //     .subscribe((response: ResponseModel) => {
  //       if (response != null && response.statusCode == 200) {
  //         this.radiologyList = response.data.filter((d) => {
  //           return d.radiologyName != null;
  //         });
  //       }
  //     });

  // }
  bindRadiologyList() {
    let organizationId = 128;
    let roleId = 329;
    this.clientService.getAllLabList(organizationId,roleId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.radiologyList = response.data.filter((d:any) => {
            return d.fullName != null;
          });
        }
      });

  }
  onSubmit():any {
     console.log("dadd", this.favouriteRadiologyForm.value);
    debugger
    if (
      this.favouriteRadiologyForm.invalid ||
      typeof this.favouriteRadiologyForm.value.radiology != "number"
    ) {
      return this.favouriteRadiologyForm;
    } else {
      // if (this.favouriteList) {
      //   let isValid = this.favouriteList.filter(
      //     (d) => d.radiologyId == this.favouriteRadiologyForm.value.radiology
      //   );
      //   if (isValid && isValid.length > 0) {
      //     this.notifier.notify(
      //       "error",
      //       "Radiology Already added to favourites."
      //     );
      //     return;
      //   }
      // }
      var postData: any = {
        RadiologyId: this.favouriteRadiologyForm.value.radiology,
        IsActive: true,
        UpdateBy: this.userId,
        Id:
          this.favouriteRadiologyForm.value.id == ""
            ? 0
            : this.favouriteRadiologyForm.value.id,
        PatientId: this.patientId,
        CreatedBy: this.userId,
      };
      this.clientService.addFavouriteRadiology(postData)
        .subscribe((response: ResponseModel) => {
          if (response.statusCode == 201) {
            this.notifier.notify("success", response.message);
            this.favouriteRadiologyForm.reset();
            this.getFavouriteRadiologyList(this.filter);
            this.bindRadiologyList();
          }
          if (response.statusCode == 200) {
            this.notifier.notify("error", "Radiology Already added to favourites.");
            this.favouriteRadiologyForm.reset();
         
          }
        });

        return;
        
    }
  };

  getFavouriteRadiologyList(filter: FilterModel) {
    this.clientService.getAllFavouriteRadiologies
      (filter, this.patientId)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.favouriteList = response.data;
          this.metaData = response.meta;
        } else {
          this.favouriteList = [];
          this.metaData = null;
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  };

  onTableActionClick(actionObj?: any) {
    const data = actionObj.data;
    // console.log(actionObj);
    if (actionObj.action == "delete") {
      this.favouriteRadiologyForm = this.formBuilder.group({
        radiology: [data.radiologyId],

        isActive: false,
        id: data.id,
      });
      var postData: any = {
        RadiologyId: data.radiologyId,
        IsActive: false,
        UpdateBy: this.userId,
        Id: data.id,
        PatientId: this.patientId,
        CreatedBy: this.userId,
      };
      this.clientService
        .addFavouriteRadiology(postData)
        .subscribe((response: ResponseModel) => {
          if (response.statusCode == 200) {
            // console.log(response.data);
            this.notifier.notify("success", "deleted successfully");
            this.favouriteRadiologyForm.reset();
            this.getFavouriteRadiologyList(this.filter);
          }
        });
    } else {
      this.router.navigate([
        "web/client/radiology/" + actionObj.data.radiologyId,
      ]);
    }
  };

  setPagePaginator = (event: any) => {
    console.log(event);
    debugger
    this.filter.pageSize = event.pageSize;
    this.filter.pageNumber = event.pageNumber;
    this.getFavouriteRadiologyList(this.filter);

   
  };
}
