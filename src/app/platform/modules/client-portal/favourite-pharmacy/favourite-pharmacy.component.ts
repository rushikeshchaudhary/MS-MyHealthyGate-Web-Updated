import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { FilterModel, ResponseModel } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { ClientsService } from "../clients.service";

@Component({
  selector: "app-favourite-pharmacy",
  templateUrl: "./favourite-pharmacy.component.html",
  styleUrls: ["./favourite-pharmacy.component.css"],
})
export class FavouritePharmacyComponent implements OnInit {
  pharmacyList: Array<any> = [];
  favouritePharmaForm!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  favouriteList: Array<any> = [];
  metaData: any;
  displayColumns: Array<any> = [
    {
      displayName: "pharmacy_name",
      key: "pharmacyClinicName",
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
  ) {}

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

    this.favouritePharmaForm = this.formBuilder.group({
      id: "",
      pharmacy: [Validators.required],
      isActive: true,
    });
    this.bindPharmacyList();
    this.getFavouritePharmacyList(this.filter);
  }
  get f() {
    return this.favouritePharmaForm.controls;
  }
  bindPharmacyList() {
    let organizationId = 128;
    let roleId = 326;
    this.clientService.getAllLabList(organizationId,roleId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.pharmacyList = response.data.filter((d:any) => {
            return d.fullName != null;
          });
        }
      });
  }
  onSubmit():any {
    if (
      this.favouritePharmaForm.invalid ||
      typeof this.favouritePharmaForm.value.pharmacy != "number"
    ) {
      return this.favouritePharmaForm;
    } else {
      // if (this.favouriteList) {
      //   let isValid = this.favouriteList.filter(
      //     (d) => d.pharmacyId == this.favouritePharmaForm.value.pharmacy
      //   );
      //   if (isValid && isValid.length > 0) {
      //     this.notifier.notify(
      //       "error",
      //       "Pharmacy Already added to favourites."
      //     );
      //     return;
      //   }
      // }
      // console.log(this, this.favouritePharmaForm.value);
      var postData: any = {
        PharmacyId: this.favouritePharmaForm.value.pharmacy,
        IsActive: true,
        UpdateBy: this.userId,
        Id:
          this.favouritePharmaForm.value.id == ""
            ? 0
            : this.favouritePharmaForm.value.id,
        PatientId: this.patientId,
        CreatedBy: this.userId,
      };
      this.clientService
        .addFavouritePharmacy(postData)
        .subscribe((response: ResponseModel) => {
          if (response.statusCode == 200) {
            // console.log(response.data);
            this.notifier.notify("error", response.message);
            this.favouritePharmaForm.reset();
           // this.getFavouritePharmacyList(this.filter);
          }
          if(response.statusCode==201){
            this.notifier.notify("success", response.message);
            this.favouritePharmaForm.reset();
            this.getFavouritePharmacyList(this.filter);
          }
        });
    }
    return;
  }

  getFavouritePharmacyList(filter: FilterModel) {
    this.clientService
      .getAllFavouritePharmacyList(filter, this.patientId)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.favouriteList = response.data;
          console.log("this.favouriteList ",this.favouriteList )
          this.metaData = response.meta;
        } else {
          this.favouriteList = [];
          this.metaData = null;
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  onTableActionClick(actionObj?: any) {
    const data = actionObj.data;
    console.log(actionObj);
    if (actionObj.action == "delete") {
      this.favouritePharmaForm = this.formBuilder.group({
        pharmacy: [data.pharmacyId],

        isActive: false,
        id: data.id,
      });
      var postData: any = {
        PharmacyId: data.pharmacyId,
        IsActive: false,
        UpdateBy: this.userId,
        Id: data.id,
        PatientId: this.patientId,
        CreatedBy: this.userId,
      };
      this.clientService
        .addFavouritePharmacy(postData)
        .subscribe((response: ResponseModel) => {
          if (response.statusCode == 200) {
            // console.log(response.data);
            this.notifier.notify("success", "deleted successfully");
            this.favouritePharmaForm.reset();
            this.getFavouritePharmacyList(this.filter);
          }
        });
    } else {
      this.router.navigate([
        "web/client/pharmacy/" + actionObj.data.pharmacyId,
      ]);
      console.log("vishal");
    }
  }
  updateFavouritePharmcyStatus(id: number) {}

  setPagePaginator = (event: any) => {
    console.log(event);
    debugger
    this.filter.pageSize = event.pageSize;
    this.filter.pageNumber = event.pageNumber;
    this.getFavouritePharmacyList(this.filter);
   
  };
}
