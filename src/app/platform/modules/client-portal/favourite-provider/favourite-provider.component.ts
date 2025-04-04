import { Component, OnInit} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { FilterModel, ResponseModel } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { ClientsService } from "../clients.service";

@Component({
  selector: "app-favourite-provider",
  templateUrl: "./favourite-provider.component.html",
  styleUrls: ["./favourite-provider.component.css"],
})
export class FavouriteProviderComponent implements OnInit {
  loading: boolean = false;
  submitted: boolean = false;
  providerList: Array<any> = [];
  favouriteProviderForm!: FormGroup;
  
  displayColumns: Array<any> = [
    {
      displayName: "provider_name",
      key: "providerName",
      isSort: true,
      class: "",
      //width: "30%",
    },
    // { displayName: "IsActive", key: "isActive", isSort: true, class: "", width: "30%" },
    {
      displayName: "Actions",
      key: "Actions",
      isSort: false,
      class: "",
     // width: "40%",
    },
  ];
  favouriteList: Array<any> = [];
  actionButtons: Array<any> = [
    { displayName: "Delete", key: "delete", class: "fa fa-trash" },
  ];
  filter!: FilterModel;
  filterModel!: FilterModel;
  currentLoginUserId!: number;
  userId!: number;
  patientId!: number;
  metaData: any;
  allProviderList: Array<any> = [];
  favouriteRadiologyForm!: FormGroup;
  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private clientService: ClientsService,
    private notifier: NotifierService,
    private router: Router,

  ) {

   
  }

  ngOnInit() {
    this.filter = new FilterModel();
    this.filterModel = new FilterModel();
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      this.patientId = user.id;
      this.currentLoginUserId = user.userID;
      this.userId = user.userID;
    });
    this.favouriteRadiologyForm = this.formBuilder.group({
      id: "",
      provider: [Validators.required],
      isActive: true,
    });
    this.bindProviderList();
    this.getFavouriteProviderList(this.filter);
  }
  get f() {
    return this.favouriteRadiologyForm.controls;
  };
  bindProviderList():any {
    let organizationId = 128;
    //let filterModel:FilterModel;
    this.filterModel.pageNumber=1;
    this.filterModel.pageSize=1000;
    this.clientService.getAllProviders(organizationId,this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.allProviderList = response.data;
        }
      });
    }

    onSubmit():any {
      // console.log(this, this.favouriteLabForm.value);
      if (
        this.favouriteRadiologyForm.invalid ||
        typeof this.favouriteRadiologyForm.value.provider != "number"
      ) {
        return this.favouriteRadiologyForm;
      } else {
        // if (this.favouriteList) {
        //   let isValid = this.favouriteList.filter(
        //     (d) => d.providerId == this.favouriteRadiologyForm.value.provider
        //   );
        //   if (isValid && isValid.length > 0) {
        //     this.notifier.notify(
        //       "error",
        //       "Provider Already added to favourites."
        //     );
        //     return;
        //   }
        // }
        var postData: any = {
          ProviderId: this.favouriteRadiologyForm.value.provider,
          // IsActive: this.favouriteRadiologyForm.value.isActive,
          IsActive:true,
          UpdateBy: this.userId,
          Id:
            this.favouriteRadiologyForm.value.id == ""
              ? 0
              : this.favouriteRadiologyForm.value.id,
          PatientId: this.patientId,
          CreatedBy: this.userId,
        };
        this.clientService.addPatientFavouriteProvider(postData)
          .subscribe((response: ResponseModel) => {
            if (response.statusCode == 201) {
              this.notifier.notify("success", response.message);
              this.favouriteRadiologyForm.reset();
              this.getFavouriteProviderList(this.filter);
              //this.bindRadiologyList();
            }
            if(response.statusCode==200){
            this.notifier.notify("error", response.message);
            this.favouriteRadiologyForm.reset();
           
          }
          });
      }
      return;
    };
  getFavouriteProviderList(filterModel: FilterModel) {
    this.clientService
      .getAllFavouriteProviderList(filterModel, this.patientId)
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
  }
  

  onTableActionClick(actionObj?: any) {
    const data = actionObj.data;
    console.log(actionObj);
    if (actionObj.action == "delete") {
      var postData: any = {
        PatientId: data.patientId,
        CreatedBy: data.createdBy,
        ProviderId: data.providerId,
        IsActive: false,
        UpdatedBy: this.currentLoginUserId,
        Id: data.id,
      };
      this.clientService
        .addPatientFavouriteProvider(postData)
        .subscribe((response: ResponseModel) => {
          if (response.statusCode == 200) {
            this.notifier.notify("success", "Deleted Successfully");
            this.getFavouriteProviderList(this.filter);
          } else {
            this.notifier.notify("error", "Error occurred!");
            this.getFavouriteProviderList(this.filter);
          }
        });
    } else {
      this.router.navigate(['web/client/doctor/'+actionObj.data.providerId])
      console.log('vishalll')
    }
  }

  setPagePaginator = (event: any) => {
    console.log(event);
    debugger
    this.filter.pageSize = event.pageSize;
    this.filter.pageNumber = event.pageNumber;
    this.getFavouriteProviderList(this.filter);

   
  };
}
