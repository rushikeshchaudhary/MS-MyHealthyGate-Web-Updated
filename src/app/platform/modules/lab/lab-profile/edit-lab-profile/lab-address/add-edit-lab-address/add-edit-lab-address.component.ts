import { Component, ElementRef, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { LabService } from "../../../../lab.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: "app-add-edit-lab-address",
  templateUrl: "./add-edit-lab-address.component.html",
  styleUrls: ["./add-edit-lab-address.component.css"],
})
export class AddEditLabAddressComponent implements OnInit {
  masterCountry: any = [];
  masterState: any = [];
  labAddressForm: FormGroup;
  labAddressUpdateForm!: FormGroup;
  submitted: boolean = false;
  labId;
  userId;
  isAdd = false;
  addressData;
  selectedState:any;
  selectedPhoneCode: string = "0";
  previousCountryId!: number;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private el: ElementRef,
    private usersService: UsersService,
    public dialogPopup: MatDialogRef<AddEditLabAddressComponent>,
    private notifier: NotifierService,
    private labService: LabService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.labId = this.data.labId;
    this.userId=this.data.userId;
    this.labAddressForm = this.formBuilder.group({
      appartmentNumber: [],
      addressLine1: [],
      addressLine2: [],
      landmark: [],
      longitude: [],
      latitude: [],
      countryID: [],
      city: [],
      stateID: [],
      zip: [],
      phoneNumber: [],
    });
    if (this.data.requestType == "add") {
      this.isAdd = true;
    } else {
      this.isAdd = false;
      this.addressData = this.data.addressData;

      console.log(this.data);
      this.selectedPhoneCode =
        this.addressData && this.addressData.phone
          ? this.addressData.phone.split(" ")[0]
          : "0";
    }
  }

  ngOnInit() { 
   
    this.usersService
        .getMasterData("masterCountry,masterState", true, [])
        .subscribe((response: any) => {
          if (response != null) {
            this.masterCountry = response.masterCountry;
            this.masterState = response.masterState;
            this.createForm();
          }
        });
  }

  createForm = () => {
    console.log(this.addressData);
    this.labAddressForm.patchValue({
      appartmentNumber: this.addressData.aptNumber,
      addressLine1: this.addressData.addressLine1,
      addressLine2: this.addressData.addressLine2,
      landmark: this.addressData.others,
      longitude: this.addressData.longitude,
      latitude: this.addressData.latitude,
      countryID: this.addressData.countryID,
      city: this.addressData.cityName,
      stateID: this.addressData.stateID,
      zip: this.addressData.zipNumber,
      phoneNumber: this.removeCountryCode(this.addressData.phone)
    });
    // this.labAddressForm = this.formBuilder.group({
    //   appartmentNumber: [this.addressData.aptNumber],
    //   addressLine1: [this.addressData.addressLine1],
    //   addressLine2: [this.addressData.addressLine2],
    //   landmark: [this.addressData.others],
    //   longitude: [this.addressData.longitude],
    //   latitude: [this.addressData.latitude],
    //   countryID: [this.addressData.countryID],
    //   city: [this.addressData.cityName],
    //   stateID: [this.addressData.stateID],
    //   zip: [this.addressData.zipNumber],
    //   phoneNumber: [this.addressData.phone],
    // });

    console.log(this.labAddressForm);
  };
  removeCountryCode(phone: string): string {
    return phone.replace(/^\+\d+\s*/, '');
  }
  get addFormControls() {
    return this.labAddressForm.controls;
  }
  // get updateFormControls() {
  //   return this.labAddressUpdateForm.controls;
  // }

  handleAddressChange(addressObj: any) {
    let countryIdMaped =
      this.masterCountry.find(
        (x:any) => x.value.toUpperCase() == (addressObj.country || "").toUpperCase()
      ) == null
        ? null
        : this.masterCountry.find(
            (x:any) =>
              x.value.toUpperCase() == (addressObj.country || "").toUpperCase()
          ).id;

    if (this.previousCountryId != countryIdMaped) {
      // this.masterState=[];
    }
    console.log(addressObj);

    this.updateValue(countryIdMaped, addressObj);
  }

  updateValue(country: any, addressObj: any) {
    this.usersService.getStateByCountryId(country).subscribe((res) => {
      if (res.statusCode == 200) {
        this.masterState = res.data;
        let stateIdMapped =
          this.masterState.find(
            (y:any) =>
              (y.value || "").toUpperCase() ==
              (addressObj.state || "").toUpperCase()
          ) == null
            ? null
            : this.masterState.find(
                (y:any) =>
                  (y.value || "").toUpperCase() ==
                  (addressObj.state || "").toUpperCase()
              ).id;

        const pObJ = {
          addressLine2: addressObj.address1,
          countryID: country,
          city: addressObj.city,
          stateID: stateIdMapped,
          zip: addressObj.zip,
          latitude: addressObj.latitude,
          longitude: addressObj.longitude,
          apartmentNumber: "",
        };
        this.labAddressForm.patchValue(pObJ);
      } else {
        this.masterState = [];
        this.notifier.notify("error", res.message);
      }
    });
    /*this.masterState =this.usersService.getStateByCountryId(country).toPromise();
    return this.masterState;*/
  }

  onClose = () => {
    this.dialogPopup.close("close");
  };
  phoneCodeChange($event: any) {
    //this.labAddressForm.controls.phoneNumber.setValue(event);
    this.selectedPhoneCode=$event
  }
  phoneCodeChangeForUpdate(event: any) {
    this.labAddressUpdateForm.controls["phoneNumber"].setValue(event);
  }
  updateCountryValue(country: any) {
    console.log("Adress", country);
    this.usersService.getStateByCountryId(country).subscribe((res) => {
      console.log(res);
      if (res.statusCode == 200) {
        this.masterState = res.data;
      } else {
        this.masterState = [];
        this.notifier.notify("error", res.message);
      }
    });
  }

  onSubmit = () => {
    this.submitted = true;

    for (const key of Object.keys(this.labAddressForm.controls)) {
      if (this.labAddressForm.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]'
        );
        if (invalidControl != null) {
          invalidControl.focus();
          break;
        }
      }
    }
    let addressID:number;
    addressID = this.addressData && this.addressData.addressID!==undefined?this.addressData.addressID:0;
    const formData = {
      labId: this.labId,
      userId:this.userId,
      addressId:
        this.data.requestType == "Add" ? 0 :addressID,
      apartmentNumber: this.addFormControls["appartmentNumber"].value,
      address1: this.addFormControls["addressLine1"].value,
      address2: this.addFormControls["addressLine2"].value,
      landmark: this.addFormControls["landmark"].value,
      longitude: this.addFormControls["longitude"].value,
      latitude: this.addFormControls["latitude"].value,
      countryId: this.addFormControls["countryID"].value,
      stateId: this.addFormControls["stateID"].value,
      city: this.addFormControls["city"].value,
      zip: this.addFormControls["zip"].value,
      //phone: this.addFormControls.phoneNumber.value,
      phone: `${this.selectedPhoneCode} ${this.addFormControls["phoneNumber"].value}`, 
      requestType:this.data.requestType
    };
    console.log(formData);
    this.labService.UpdateLabAddress(formData).subscribe((res) => {
      if (res.statusCode == 200) {
        this.submitted = false;
        this.notifier.notify("success", res.message);
        this.dialogPopup.close();
      } else {
        this.submitted = false;
        this.notifier.notify("error", res.message);
        this.dialogPopup.close();
      }
    });
  };


/*******************************************/
/*******************************************/




//   masterCountry: any = [];
//   masterState: any = [];
//   labAddressAddForm: FormGroup;
//   labAddressUpdateForm: FormGroup;
//   submitted: boolean = false;
//   labId;
//   isAdd = false;
//   addressData;
//   selectedState;
//   selectedPhoneCode: string = "0";

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private formBuilder: FormBuilder,
//     private el: ElementRef,
//     private usersService: UsersService,
//     public dialogPopup: MatDialogRef<AddEditLabAddressComponent>,
//     private notifier: NotifierService,
//     private labService: LabService
//   ) {

//     console.log(this.data)
//     this.labId = this.data.labId;
//     if (this.data.requestType == "Add") {
//       this.isAdd = true;
//     } else {
//       this.isAdd = false;
//       this.addressData = this.data.addressData;
//       this.selectedState = this.data.addressData.stateID;
//       console.log(this.data);
//     }
//   }

//   ngOnInit() {



//     this.labAddressAddForm = this.formBuilder.group({
//       appartmentNumber: [],
//       addressLine1: [],
//       addressLine2: [],
//       landmark: [],
//       longitude: [],
//       latitude: [],
//       countryID: [],
//       city: [],
//       stateID: [],
//       zip: [],
//       phoneNumber: [],
//     });

//     this.usersService
//       .getMasterData("masterCountry,masterState", true, null)
//       .subscribe((response: any) => {
//         if (response != null) {
//           this.masterCountry = response.masterCountry;
//           this.masterState = response.masterState;
//         }
//       });
// if(this.addressData  && this.addressData.phone){
//   this.selectedPhoneCode =    this.addressData.phone.split(' ')[0] ;
//     this.selectedPhoneCode = this.selectedPhoneCode.replace('(', '').replace(')', '');
// }
//     this.labAddressUpdateForm = this.formBuilder.group({
//       appartmentNumber: [
//         this.addressData && this.addressData.aptNumber ? this.addressData.aptNumber : "",
//       ],
//       addressLine1: [
//         this.addressData && this.addressData.addressLine1 ? this.addressData.addressLine1 : "",
//       ],
//       addressLine2: [
//         this.addressData && this.addressData.addressLine2 ? this.addressData.addressLine2 : "",
//       ],
//       landmark: [this.addressData && this.addressData.others ? this.addressData.others : ""],
//       longitude: [this.addressData && this.addressData.longitude ? this.addressData.longitude : ""],
//       latitude: [this.addressData && this.addressData.latitude ? this.addressData.latitude : ""],
//       country: [
//         this.addressData && this.addressData.countryName ? this.addressData.countryName : "",
//       ],
//       city: [this.addressData && this.addressData.cityName ? this.addressData.cityName : ""],
//       state: [this.addressData && this.addressData.stateName ? this.addressData.stateName : ""],
//       zip: [this.addressData && this.addressData.zipNumber ? this.addressData.zipNumber : ""],
//       phoneNumber: [this.addressData && this.addressData.phone ? this.addressData.phone : ""],
//     });



//   }

//   get addFormControls() {
//     return this.labAddressAddForm.controls;
//   }
//   get updateFormControls() {
//     return this.labAddressUpdateForm.controls;
//   }
//   onClose = () => {
//     this.dialogPopup.close("close");
//   };

//   onSubmit = (event) => {
//     this.submitted = true;

//     for (const key of Object.keys(this.labAddressAddForm.controls)) {
//       if (this.labAddressAddForm.controls[key].invalid) {
//         const invalidControl = this.el.nativeElement.querySelector(
//           '[formcontrolname="' + key + '"]'
//         );
//         if (invalidControl != null) {
//           invalidControl.focus();
//           break;
//         }
//       }

//     }
//     const formData = {
//       requestType: "Add",
//       labId: this.labId,
//       apartmentNumber: this.addFormControls.appartmentNumber.value,
//       address1: this.addFormControls.addressLine1.value,
//       address2: this.addFormControls.addressLine2.value,
//       landmark: this.addFormControls.landmark.value,
//       longitude: this.addFormControls.longitude.value,
//       latitude: this.addFormControls.latitude.value,
//       countryId: this.addFormControls.countryID.value,
//       stateId: this.addFormControls.stateID.value,
//       city: this.addFormControls.city.value,
//       zip: this.addFormControls.zip.value,
//       phone: this.addFormControls.phoneNumber.value,
//     };
//     console.log(formData);
//     this.labService.UpdateLabAddress(formData).subscribe((res) => {
//       if (res.statusCode == 200) {
//         this.submitted = false;
//         this.notifier.notify("success", "Address Add Successful");
//         this.dialogPopup.close();
//       } else {
//         this.submitted = false;
//         this.notifier.notify("error", res.message);
//         this.dialogPopup.close();
//       }
//     });
//   };
//   onUpdateSubmit = () => {
//     this.submitted = true;

//     for (const key of Object.keys(this.labAddressUpdateForm.controls)) {
//       if (this.labAddressUpdateForm.controls[key].invalid) {
//         const invalidControl = this.el.nativeElement.querySelector(
//           '[formcontrolname="' + key + '"]'
//         );
//         if (invalidControl != null) {
//           invalidControl.focus();
//           break;
//         }
//       }

//     }
//     const formData = {
//       requestType: "Update",
//       labId: this.labId,
//       apartmentNumber: this.updateFormControls.appartmentNumber.value,
//       address1: this.updateFormControls.addressLine1.value,
//       address2: this.updateFormControls.addressLine2.value,
//       landmark: this.updateFormControls.landmark.value,
//       longitude: this.updateFormControls.longitude.value,
//       latitude: this.updateFormControls.latitude.value,
//       city: this.updateFormControls.city.value,
//       zip: this.updateFormControls.zip.value,
//       phone: this.updateFormControls.phoneNumber.value,
//     };
//     console.log(formData);
//     this.labService.UpdateLabAddress(formData).subscribe((res) => {
//       if (res.statusCode == 200) {
//         this.submitted = false;
//         this.notifier.notify("success", "Address Update Successful");
//         this.dialogPopup.close();
//       } else {
//         this.submitted = false;
//         this.notifier.notify("error", res.message);
//         this.dialogPopup.close();
//       }
//     });
//   }
//   phoneCodeChange(event: any) {
//     this.labAddressAddForm.controls.phoneNumber.setValue(event);
//   }
//   phoneCodeChangeForUpdate(event: any) {
//     this.labAddressUpdateForm.controls.phoneNumber.setValue(event);
//   }

//   updateValue(country:any){
//     console.log('Adress',country);
//     this.usersService.getStateByCountryId(country).subscribe(res=>{
//       console.log(res);
//       if(res.statusCode == 200){
//         this.masterState = res.data;
//       }
//     else{
//       this.masterState = [];
//       this.notifier.notify("error", res.message);
//     }
//     });
//   }
}
