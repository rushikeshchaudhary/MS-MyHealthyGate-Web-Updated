import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { UsersService } from 'src/app/platform/modules/agency-portal/users/users.service';
import { PharmacyService } from '../../../../pharmacy.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-edit-pharmacy-address',
  templateUrl: './add-edit-pharmacy-address.component.html',
  styleUrls: ['./add-edit-pharmacy-address.component.css'],
})
export class AddEditPharmacyAddressComponent implements OnInit {
  masterCountry: any = [];
  masterState: any = [];
  pharmacyAddressForm!: FormGroup;
  pharmacyAddressUpdateForm!: FormGroup;
  submitted: boolean = false;
  pharmacyId;
  isAdd = false;
  addressData: any;
  selectedState;
  selectedPhoneCode: string = '0';
  previousCountryId!: number;
  userId: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private el: ElementRef,
    private usersService: UsersService,
    public dialogPopup: MatDialogRef<AddEditPharmacyAddressComponent>,
    private pharmacyService: PharmacyService,
    private notifier: NotifierService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem('language') || 'en' || 'en');
    translate.use(localStorage.getItem('language') || 'en' || 'en');
    this.pharmacyId = this.data.pharmacyId;
    this.userId = this.data.userId;
    if (this.data.requestType == 'Add') {
      this.isAdd = true;

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
    } else {
      this.isAdd = false;
      this.addressData = this.data.addressData;
      this.selectedState = this.data.addressData.stateID;
      //      console.log(this.data)
      this.selectedPhoneCode =
        this.addressData && this.addressData.phone
          ? this.addressData.phone.split(' ')[0]
          : '0';
    }
  }

  ngOnInit() {
    this.pharmacyAddressUpdateForm = this.formBuilder.group({
      appartmentNumber: [
        this.addressData && this.addressData.aptNumber
          ? this.addressData.aptNumber
          : '',
      ],
      addressLine1: [
        this.addressData && this.addressData.addressLine1
          ? this.addressData.addressLine1
          : '',
      ],
      addressLine2: [
        this.addressData && this.addressData.addressLine2
          ? this.addressData.addressLine2
          : '',
      ],
      landmark: [
        this.addressData && this.addressData.others
          ? this.addressData.others
          : '',
      ],
      longitude: [
        this.addressData && this.addressData.longitude
          ? this.addressData.longitude
          : '',
      ],
      latitude: [
        this.addressData && this.addressData.latitude
          ? this.addressData.latitude
          : '',
      ],
      country: [
        this.addressData && this.addressData.countryName
          ? this.addressData.countryName
          : '',
      ],
      city: [
        this.addressData && this.addressData.cityName
          ? this.addressData.cityName
          : '',
      ],
      state: [
        this.addressData && this.addressData.stateName
          ? this.addressData.stateName
          : '',
      ],
      zip: [
        this.addressData && this.addressData.zipNumber
          ? this.addressData.zipNumber
          : '',
      ],
      //phoneNumber: [this.addressData && this.addressData.phone ? this.addressData.phone : ""],
      phoneNumber: this.removeCountryCode(
        this.addressData && this.addressData.phone ? this.addressData.phone : ''
      ),
    });

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
    this.usersService
      .getMasterData('masterCountry,masterState', true, null)
      .subscribe((response: any) => {
        if (response != null) {
          this.masterCountry = response.masterCountry;
          this.masterState = response.masterState;
        }
      });
  }
  removeCountryCode(phone: any): any {
    if (phone != null) {
      return phone.replace(/^\+\d+\s*/, '');
    }
    return '';
  }
  get addFormControls() {
    return this.pharmacyAddressForm.controls;
    /*if (this.pharmacyAddressForm) {
      return this.pharmacyAddressForm.controls;
    } else {
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
      return this.pharmacyAddressForm.controls;
    }*/
  }
  get updateFormControls() {
    return this.pharmacyAddressUpdateForm.controls;
  }

  handleAddressChange(addressObj: any) {
    let countryIdMaped =
      this.masterCountry.find(
        (x: any) =>
          x.value.toUpperCase() == (addressObj.country || '').toUpperCase()
      ) == null
        ? null
        : this.masterCountry.find(
            (x: any) =>
              x.value.toUpperCase() == (addressObj.country || '').toUpperCase()
          ).id;

    if (this.previousCountryId != countryIdMaped) {
      // this.masterState=[];
    }
    this.updateValue(countryIdMaped, addressObj);
  }

  updateValue(country: any, addressObj: any) {
    this.usersService.getStateByCountryId(country).subscribe((res) => {
      if (res.statusCode == 200) {
        this.masterState = res.data;
        let stateIdMapped =
          this.masterState.find(
            (y: any) =>
              (y.value || '').toUpperCase() ==
              (addressObj.state || '').toUpperCase()
          ) == null
            ? null
            : this.masterState.find(
                (y: any) =>
                  (y.value || '').toUpperCase() ==
                  (addressObj.state || '').toUpperCase()
              ).id;

        const pObJ = {
          addressLine2: addressObj.address1,
          countryID: country,
          city: addressObj.city,
          stateID: stateIdMapped,
          zip: addressObj.zip,
          latitude: addressObj.latitude,
          longitude: addressObj.longitude,
          apartmentNumber: '',
          phone: this.removeCountryCode(addressObj.phone),
          //phoneNumber: this.removeCountryCode(addressObj.phone)
        };
        this.pharmacyAddressForm.patchValue(pObJ);
      } else {
        this.masterState = [];
        this.notifier.notify('error', res.message);
      }
    });
    /*this.masterState =this.usersService.getStateByCountryId(country).toPromise();
    return this.masterState;*/
  }

  onUpdateSubmit = () => {
    this.submitted = true;

    for (const key of Object.keys(this.pharmacyAddressUpdateForm.controls)) {
      if (this.pharmacyAddressUpdateForm.controls[key].invalid) {
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
      requestType: 'Update',
      pharmacyId: this.pharmacyId,
      userId: this.userId,
      apartmentNumber: this.updateFormControls['appartmentNumber'].value,
      address1: this.updateFormControls['addressLine1'].value,
      address2: this.updateFormControls['addressLine2'].value,
      landmark: this.updateFormControls['landmark'].value,
      longitude: this.updateFormControls['longitude'].value,
      latitude: this.updateFormControls['latitude'].value,
      city: this.updateFormControls['city'].value,
      zip: this.updateFormControls['zip'].value,
      //phone: this.updateFormControls.phoneNumber.value,
      phone: `${this.selectedPhoneCode} ${this.updateFormControls['phoneNumber'].value}`,
    };
    // console.log(formData);
    this.pharmacyService.UpdatePharmacyAddress(formData).subscribe((res) => {
      if (res.statusCode == 200) {
        this.submitted = false;
        this.notifier.notify('success', 'Address Update Successful');
        this.dialogPopup.close();
      } else {
        this.submitted = false;
        this.notifier.notify('error', res.message);
        this.dialogPopup.close();
      }
    });
  };

  onSubmit = (event: any) => {
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
      requestType: 'Add',
      pharmacyId: this.pharmacyId,
      userId: this.userId,
      apartmentNumber: this.addFormControls['appartmentNumber'].value,
      address1: this.addFormControls['addressLine1'].value,
      address2: this.addFormControls['addressLine2'].value,
      landmark: this.addFormControls['landmark'].value,
      longitude: this.addFormControls['longitude'].value,
      latitude: this.addFormControls['latitude'].value,
      countryId: this.addFormControls['countryID'].value,
      stateId: this.addFormControls['stateID'].value,
      city: this.addFormControls['city'].value,
      zip: this.addFormControls['zip'].value,
      //phone: this.addFormControls.phoneNumber.value,
      phone: `${this.selectedPhoneCode} ${this.addFormControls['phoneNumber'].value}`,
    };
    // console.log(formData);
    this.pharmacyService.UpdatePharmacyAddress(formData).subscribe((res) => {
      if (res.statusCode == 200) {
        this.submitted = false;
        this.notifier.notify('success', 'Address Add Successful');
        this.dialogPopup.close();
      } else {
        this.submitted = false;
        this.notifier.notify('error', res.message);
        this.dialogPopup.close();
      }
    });
  };
  onClose = () => {
    this.dialogPopup.close('close');
  };
  phoneCodeChange($event: any) {
    //this.pharmacyAddressForm.controls.phoneNumber.setValue(event);
    this.selectedPhoneCode = $event;
  }
  phoneCodeChangeForUpdate(event: any) {
    this.pharmacyAddressUpdateForm.controls['phoneNumber'].setValue(event);
  }
  updateCountryValue(country: any) {
    console.log('Adress', country);
    this.usersService.getStateByCountryId(country).subscribe((res) => {
      console.log(res);
      if (res.statusCode == 200) {
        this.masterState = res.data;
      } else {
        this.masterState = [];
        this.notifier.notify('error', res.message);
      }
    });
  }
  useLanguage(language: string): void {
    localStorage.setItem('language', language);
    this.translate.use(language);
  }
}
