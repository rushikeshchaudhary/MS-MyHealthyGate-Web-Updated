import { Component, ElementRef, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { LabService } from "src/app/platform/modules/lab/lab.service";
import { PharmacyService } from "src/app/platform/modules/pharmacy-portal/pharmacy.service";

@Component({
  selector: "app-add-edit-radiology-address",
  templateUrl: "./add-edit-radiology-address.component.html",
  styleUrls: ["./add-edit-radiology-address.component.css"],
})
export class AddEditRadiologyAddressComponent implements OnInit {
  masterCountry: any = [];
  masterState: any = [];
  pharmacyAddressForm: FormGroup;
  pharmacyAddressUpdateForm!: FormGroup;
  submitted: boolean = false;
  pharmacyId;
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
    public dialogPopup: MatDialogRef<AddEditRadiologyAddressComponent>,
    private notifier: NotifierService,
    private labService: LabService
  ) {
    this.pharmacyId = this.data.radiologyId;
    this.pharmacyAddressForm = this.formBuilder.group({
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
        .getMasterData("masterCountry,masterState", true, null)
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
    this.pharmacyAddressForm.patchValue({
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
      phoneNumber: this.addressData.phone,
    });
    // this.pharmacyAddressForm = this.formBuilder.group({
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

    console.log(this.pharmacyAddressForm);
  };

  get addFormControls() {
    return this.pharmacyAddressForm.controls;
  }
  // get updateFormControls() {
  //   return this.pharmacyAddressUpdateForm.controls;
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
        this.pharmacyAddressForm.patchValue(pObJ);
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
  phoneCodeChange(event: any) {
    this.pharmacyAddressForm.controls["phoneNumber"].setValue(event);
  }
  phoneCodeChangeForUpdate(event: any) {
    this.pharmacyAddressUpdateForm.controls["phoneNumber"].setValue(event);
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
    let addressID:number;
    addressID = this.addressData && this.addressData.addressID!==undefined?this.addressData.addressID:0;
    const formData = {
      radiologyId: this.pharmacyId,
      addressId:
        this.data.requestType == "add" ? 0 : addressID,
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
      phone: this.addFormControls["phoneNumber"].value,
    };
    console.log(formData);
    this.labService.UpdateRadiologyAddress(formData).subscribe((res) => {
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
}
