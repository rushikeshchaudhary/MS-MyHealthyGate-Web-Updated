import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { RegisterService } from "src/app/front/register/register.service";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { CommonService } from "src/app/platform/modules/core/services";
import { LabService } from "../../../lab.service";
import { AddEditLabAddressComponent } from "./add-edit-lab-address/add-edit-lab-address.component";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-lab-address",
  templateUrl: "./lab-address.component.html",
  styleUrls: ["./lab-address.component.css"],
})
export class LabAddressComponent implements OnInit {
  labInfo: any ;
  labAddress: Array<any> = [];
  loginData: any;
  submitted: boolean = false;
  masterCountry: any = [];
  masterState: any = [];
  pharmacyAddressForm!: FormGroup;
  labId:any;
  constructor(
    private commonService: CommonService,
    private labService: LabService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private route: Router,
    private el: ElementRef,
    private usersService: UsersService,
    private matDialog: MatDialog,
    private dialogService: DialogService,
    private translate:TranslateService,
    private activatedRoute:ActivatedRoute
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
   }

  ngOnInit() { 
     this.labId=this.activatedRoute.snapshot.paramMap.get('id');
    this.pharmacyAddressForm = this.formBuilder.group({
      appartmentNumber: [
        this.labAddress.length > 0
          ? this.labAddress[0].aptNumber
          : "",
      ],
      countryID: [
        this.labAddress.length > 0
          ? this.labAddress[0].countryName
          : "",
      ],
      city: [
        this.labAddress.length > 0 ? this.labAddress[0].cityName : "",
      ],
      stateID: [
        this.labAddress.length > 0
          ? this.labAddress[0].stateName
          : "",
      ],
      zip: [
        this.labAddress.length > 0
          ? this.labAddress[0].zipNumber
          : "",
      ],
      phoneNumber: [
        this.labAddress.length > 0 ? this.labAddress[0].phone : "",
        [Validators.required, Validators.minLength(14)],
      ],
    });

    this.usersService
      .getMasterData("masterCountry,masterState", true, [])
      .subscribe((response: any) => {
        if (response != null) {
          this.masterCountry = response.masterCountry;
          this.masterState = response.masterState;
        }
      });

    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
//         console.log(user.data);
        this.loginData = user.data;
        //this.getPharmacyData();
      }
    });
    this.getPharmacyData();
  }

  addEditAddressHandler=()=>{
    let dbModal;
    dbModal = this.matDialog.open(AddEditLabAddressComponent, {
      hasBackdrop: true,
      width: "70%",
      data: {
        labId:this.labId,
        userId:this.labInfo.labInfo[0].userID,
        requestType: "add",
      },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "close") {
        // console.log(result);
      } else {
        this.getPharmacyData();
      }
    });
  }

  editAddress = (item:any) => {
    // console.log(item);
    let dbModal;
    dbModal = this.matDialog.open(AddEditLabAddressComponent, {
      hasBackdrop: true,
      width: "70%",
      data: {
        labId: this.labId,
        addressData: item,
        userId:this.labInfo.labInfo[0].userID,
        requestType: "Update",
      },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "close") {
        // console.log(result);
      } else {
        this.getPharmacyData();
      }
    });
  };
  deleteAddress = (item:any) => {
    console.log(item);
    this.dialogService
    .confirm("Are you sure you want to delete this Address?")
    .subscribe((result: any) => {
      if (result == true) {
        const deletereq={
          labId:item.labId,
          LabAddressId:item.addressID
        }
        this.labService.deleteLabAddress(deletereq).subscribe(res=>{
          if (res!= null) {
                  this.notifier.notify("success", res.message);
                  this.getPharmacyData();
                } else {
                  this.notifier.notify("error", res.message);
                }
        });

      }
    });
  };

  getPharmacyData = () => {
    this.labService.GetLabById(this.labId).subscribe((res) => {
      console.log(res);
      
      this.labInfo = res.data.labInfo;
      this.labInfo = res.data;
      this.labInfo.dob = format(this.labInfo.dob, 'MM/dd/yyyy');
      this.labInfo.doj = format(this.labInfo.doj, 'MM/dd/yyyy');
      
      this.labAddress = res.data.labAddressesModel;
    });
  };

}
