import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";
import { CommonService } from "src/app/platform/modules/core/services";
import { PharmacyService } from "../../../pharmacy.service";
import { AddEditPharmacyAddressComponent } from "./add-edit-pharmacy-address/add-edit-pharmacy-address.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-pharmacy-address",
  templateUrl: "./pharmacy-address.component.html",
  styleUrls: ["./pharmacy-address.component.css"],
})
export class PharmacyAddressComponent implements OnInit {
  PharmacyInfo: Array<any> = [];
  PharmacyAddress: Array<any> = [];
  loginData: any;
  submitted: boolean = false;
  masterCountry: any = [];
  masterState: any = [];
  pharmacyAddressForm!: FormGroup;
 pharmacyId:any;
  constructor(
    private commonService: CommonService,
    private pharmacyService: PharmacyService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private route: Router,
    private el: ElementRef,
    private usersService: UsersService,
    private matDialog: MatDialog,
    private translate:TranslateService,
    private activatedRoute:ActivatedRoute
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en"|| "en");
    translate.use(localStorage.getItem("language") || "en"|| "en");
  }

  ngOnInit() {
    this.pharmacyId=this.activatedRoute.snapshot.paramMap.get('id');
    this.pharmacyAddressForm = this.formBuilder.group({
      appartmentNumber: [
        this.PharmacyAddress.length > 0
          ? this.PharmacyAddress[0].aptNumber
          : "",
      ],
      countryID: [
        this.PharmacyAddress.length > 0
          ? this.PharmacyAddress[0].countryName
          : "",
      ],
      city: [
        this.PharmacyAddress.length > 0 ? this.PharmacyAddress[0].cityName : "",
      ],
      stateID: [
        this.PharmacyAddress.length > 0
          ? this.PharmacyAddress[0].stateName
          : "",
      ],
      zip: [
        this.PharmacyAddress.length > 0
          ? this.PharmacyAddress[0].zipNumber
          : "",
      ],
      phoneNumber: [
        this.PharmacyAddress.length > 0 ? this.PharmacyAddress[0].phone : "",
        [Validators.required, Validators.minLength(14)],
      ],
    });

    this.usersService
      .getMasterData("masterCountry,masterState", true, null)
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
      }
    });
    this.getPharmacyData();
  }
  get formControls() {
    return this.pharmacyAddressForm.controls;
  }

  getPharmacyData = () => {
    this.pharmacyService.GetPharmacyById(this.pharmacyId).subscribe((res) => {
      this.PharmacyInfo = res.data.pharmacyInfo;
      console.log(this.PharmacyInfo)
      this.PharmacyInfo = this.PharmacyInfo.map((x) => {
        x.dob = format(x.dob, 'MM/dd/yyyy');
        return x;
      });
      this.PharmacyInfo = this.PharmacyInfo.map((x) => {
        x.registerDate = format(x.registerDate, 'MM/dd/yyyy');
        return x;
      });

      this.PharmacyAddress = res.data.pharmacyAddressInfo;
    });
  };
  onSubmit = (event:any) => {
    this.submitted = true;

    for (const key of Object.keys(this.pharmacyAddressForm.controls)) {
      if (this.pharmacyAddressForm.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]'
        );
        if (invalidControl != null) {
          invalidControl.focus();
          break;
        }
      }
    }

    const formData = {
      pharmacyId: this.loginData.id,
      apartmentNumber:
        this.formControls["appartmentNumber"].value == ""
          ? this.PharmacyAddress[0].aptNumber
          : this.formControls["appartmentNumber"].value,
      countryId:
        this.formControls["countryID"].value == ""
          ? this.PharmacyAddress[0].countryName
          : this.formControls["countryID"].value,
      stateId:
        this.formControls["stateID"].value == ""
          ? this.PharmacyAddress[0].stateID
          : this.formControls["stateID"].value,
      city:
        this.formControls["city"].value == ""
          ? this.PharmacyAddress[0].cityName
          : this.formControls["city"].value,
      zip:
        this.formControls["zip"].value == ""
          ? this.PharmacyAddress[0].zipNumber
          : this.formControls["zip"].value,
      phone:
        this.formControls["phoneNumber"].value == ""
          ? this.PharmacyAddress[0].phone
          : this.formControls["phoneNumber"].value,
    };
    // console.log(formData);
    this.pharmacyService.UpdatePharmacyAddress(formData).subscribe((res) => {
      if (res.statusCode == 200) {
        this.submitted = false;
        this.notifier.notify("success", "Address Update Successful");
        location.reload();
      } else {
        this.submitted = false;
        this.notifier.notify("error", res.message);
      }
    });
  };
  addEditAddressHandler = (formType:any) => {
    let dbModal;
    dbModal = this.matDialog.open(AddEditPharmacyAddressComponent, {
      hasBackdrop: true,
      width: "70%",
      data: {
        pharmacyId:this.pharmacyId,
        userId:this.PharmacyInfo[0].userID,
        addressData: null,
        requestType: "Add",
      },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "close") {
       //  console.log(result);
      } else {
        this.getPharmacyData();
      }
    });
  };
  editAddress = (item:any) => {
    // console.log(item);
    let dbModal;
    dbModal = this.matDialog.open(AddEditPharmacyAddressComponent, {
      hasBackdrop: true,
      width: "70%",
      data: {
        pharmacyId: this.pharmacyId,
        userId:this.PharmacyInfo[0].userID,
        addressData: item,
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
    let data = {
      pharmacyId: item.pharmacyId,
      PharmacyAddressId: item.addressID,
    };
    this.pharmacyService.deletePharmacyAddress(data).subscribe((res) => {
     //  console.log(res);
      if (res.statusCode == 200) {
        this.notifier.notify("success", res.message);
        this.getPharmacyData();
      } else {
        this.notifier.notify("error", res.message);
        this.getPharmacyData();
      }
    });
  };
  useLanguage(language: string): void {
    localStorage.setItem("language", language);
    this.translate.use(language);
  }
}
