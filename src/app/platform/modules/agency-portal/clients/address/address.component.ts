import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { ClientsService } from "../clients.service";
import { AddressModel, PhoneNumberModel } from "../address.model";
import { ResponseModel } from "../../../core/modals/common-model";
import { NotifierService } from "angular-notifier";
import { UsersService } from "../../users/users.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.css"],
})
export class AddressComponent implements OnInit {
  addressForm!: FormGroup;
  masterCountry: any = [];
  masterState: any = [];
  masterPatientLocation: any = [];
  masterPhoneType: any[] = [];
  masterPhonePreferences: any = [];
  masterAddressType!: any[];
  patientAddress: Array<AddressModel> = [];
  phoneNumber: Array<PhoneNumberModel> = [];
  existingAddress!: any[];
  existingPhoneNumber!: any[];
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  clientId!: number;
  submitted: boolean = false;
  sameAsPrimary: boolean = false;
  selectedPhoneCode: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private clientService: ClientsService,
    private translate:TranslateService,
    private notifier: NotifierService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
   }
  async ngOnInit() {
    this.addressForm = this.formBuilder.group({
      addresses: this.formBuilder.array([]),
      phoneNumbers: this.formBuilder.array([]),
    });
    this.getMasterData();
    this.getAddressesAndPhoneNumbers();
  }
  get formControls() {
    return this.addressForm.controls;
  }
  get addresses():FormArray {
    return this.addressForm.get("addresses") as FormArray;
  }

  get phoneNumbers():FormArray{
    return this.addressForm.get("phoneNumbers") as FormArray;
  }

  getAddressControl(ix: number) {
    const pAdrr = this.addresses.get([ix]) as FormGroup;
    return pAdrr.controls["address1"];
  }

  public async handleAddressChange(addressObj: any, index: number)  {
    const foundCountry = this.masterCountry.find((x: { value: any; }) => {
      if (x.value == addressObj.country) {
        return x
      }
      return {}
    })

    //this.updateValue(foundCountry.id);
    let updateStates = await this.updateValue(foundCountry.id);
    this.masterState = updateStates.data;

    console.log('this.masterState', this.masterState);
    const foundState = this.masterState.find((x: { value: any; }) => {
      if (x.value == addressObj.state) {
        return x
      }
      return {}
    })
    let pAdd = this.addresses.get([index]) as FormGroup;
    const pObJ = {
      address1: addressObj.address1,
      // countryId:
      //   this.masterCountry.find(
      //     (x) =>
      //       x.value.toUpperCase() == (addressObj.country || "").toUpperCase()
      //   ) == null
      //     ? null
      //     : this.masterCountry.find(
      //         (x) =>
      //           x.value.toUpperCase() ==
      //           (addressObj.country || "").toUpperCase()
      //       ).id,
      countryId: foundCountry.id,
      city: addressObj.city,
      // stateId:
      //   this.masterState.find(
      //     (y) =>
      //       (y.stateAbbr || "").toUpperCase() ==
      //       (addressObj.state || "").toUpperCase()
      //   ) == null
      //     ? null
      //     : this.masterState.find(
      //         (y) =>
      //           (y.stateAbbr || "").toUpperCase() ==
      //           (addressObj.state || "").toUpperCase()
      //       ).id,
      stateId: foundState.id,
      zip: addressObj.zip,
      latitude: addressObj.latitude,
      longitude: addressObj.longitude,
    };
    pAdd.patchValue(pObJ);
    // Do some stuff
    this.resetSameAsPrimaryAddress();
  }


  onSubmit(event: any) {
    if (!this.addressForm.invalid) {
      let clickType = event.currentTarget.name;
      let addressList = this.addressForm.value.addresses;
      let phoneNumberList = this.addressForm.value.phoneNumbers;
      phoneNumberList.forEach((element: { phoneNumber: string; }, index: number) => {
        element.phoneNumber = this.selectedPhoneCode[index] == '0' ? element.phoneNumber : this.selectedPhoneCode[index].trim() + " " + element.phoneNumber;
      });

      let data = {
        patientId: this.clientId,
        patientAddress: addressList,
        phoneNumbers: phoneNumberList,
      };
      let pAddressTypeId = null;
      let mAddressTypeId = null;
      if (this.masterAddressType != null && this.masterAddressType.length > 0) {
        pAddressTypeId = this.masterAddressType.find(
          (x) => x.globalCodeName == "Primary Home"
        ).id; //Manage this with key from Gobal Code Name key
        mAddressTypeId = this.masterAddressType.find(
          (x) => x.globalCodeName == "Mailing Home"
        ).id; //Manage this with key from Gobal Code Name key
      }
      addressList[0] != null
        ? (addressList[0].addressTypeId = pAddressTypeId)
        : null;
      addressList[0] != null ? (addressList[0].isPrimary = true) : false;
      addressList[0] != null
        ? (addressList[0].isMailingSame = this.sameAsPrimary)
        : false;
      addressList[1] != null
        ? (addressList[1].addressTypeId = mAddressTypeId)
        : null;
      //This should be removed from front end and should be managed in backend ---------Added by Sunny Bhardwaj
      this.patientAddress.filter((x: AddressModel) => {
        if (addressList.findIndex((y: { id: number; }) => y.id == x.id) == -1) {
          x.isDeleted = true;
          addressList.push(x);
        }
      });

      //This should be removed from front end and should be managed in backend ---------Added by Sunny Bhardwaj
      this.phoneNumber.filter((x: PhoneNumberModel) => {
        if (phoneNumberList.findIndex((y: { id: number; }) => y.id == x.id) == -1) {
          x.isDeleted = true;
          phoneNumberList.push(x);
        }
      });

      this.submitted = true;
      this.clientService
        .savePatientAddressesAndPhoneNumbers(data)
        .subscribe((response: ResponseModel) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
         //   if (clickType == "Save") this.getAddressesAndPhoneNumbers();
         
            if (clickType == "SaveContinue")
              this.handleTabChange.next({
                tab: "Insurance",
                id: this.clientId,
              });
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }

  onNext(){
    this.handleTabChange.next({
      tab: "Insurance",
      id: this.clientId,
    });
  }

  onPrevious(){
    this.handleTabChange.next({
      tab: "Guardian/Guarantor",
      id: this.clientId,
    });
  }
  // getMasterData() {
  //   let data =
  //     "ADDRESSTYPE,MASTERSTATE,MASTERCOUNTRY,MASTERPATIENTLOCATION,PHONETYPE,MASTERPHONEPREFERENCES";
  //   this.clientService.getMasterData(data).subscribe((response: any) => {
  //     if (response != null) {
  //       this.masterCountry =
  //         response.masterCountry != null ? response.masterCountry : [];
  //       this.masterState =
  //         response.masterState != null ? response.masterState : [];
  //       this.masterPatientLocation =
  //         response.masterPatientLocation != null
  //           ? response.masterPatientLocation
  //           : [];
  //       this.masterPhoneType = this.removeDuplicates(
  //         response.masterPhoneType != null ? response.masterPhoneType : [],
  //         "value"
  //       );
  //       this.masterPhonePreferences =
  //         response.masterPhonePreferences != null
  //           ? response.masterPhonePreferences
  //           : [];
  //       this.masterAddressType =
  //         response.masterAddressType != null ? response.masterAddressType : [];
  //     }
  //   });
  // }

  async getMasterData() {
    let masterData = await this.getAwaitMasterData();
    if (masterData != null) {
      this.masterCountry =
        masterData.masterCountry != null ? masterData.masterCountry : [];
      this.masterState =
        masterData.masterState != null ? masterData.masterState : [];
      this.masterPatientLocation =
        masterData.masterPatientLocation != null
          ? masterData.masterPatientLocation
          : [];
      this.masterPhoneType = this.removeDuplicates(
        masterData.masterPhoneType != null ? masterData.masterPhoneType : [],
        "value"
      );
      this.masterPhonePreferences =
        masterData.masterPhonePreferences != null
          ? masterData.masterPhonePreferences
          : [];
      this.masterAddressType =
        masterData.masterAddressType != null ? masterData.masterAddressType : [];
    }
  }

  getAwaitMasterData(): Promise<any> {
    let data = "ADDRESSTYPE,MASTERSTATE,MASTERCOUNTRY,MASTERPATIENTLOCATION,PHONETYPE,MASTERPHONEPREFERENCES";
    return this.clientService.getMasterData(data).toPromise();
  }

  removeDuplicates = (array: any[], key: string) => {
    return array.reduce((arr, item) => {
      const removed = arr.filter((i: { [x: string]: any; }) => i[key] !== item[key]);
      return [...removed, item];
    }, []);
  };

  addAddress(obj: AddressModel) {
    const control = <FormArray>this.addressForm.controls["addresses"];
    control.push(
      this.formBuilder.group({
        id: obj.id,
        address1: obj.address1,
        countryId: obj.countryId,
        city: obj.city,
        apartmentNumber: obj.apartmentNumber,
        stateId: obj.stateId,
        zip: obj.zip,
        patientLocationId: obj.patientLocationId,
        patientId: this.clientId,
        isPrimary: obj.isPrimary,
        isMailingSame: obj.isMailingSame,
        addressTypeId: obj.addressTypeId,
        latitude: obj.latitude,
        longitude: obj.longitude,
      })
    );
  }

  addPhoneNumber(obj: PhoneNumberModel) {
    const control = <FormArray>this.addressForm.controls["phoneNumbers"];
    control.push(
      this.formBuilder.group({
        id: obj.id,
        phoneNumberTypeId: obj.phoneNumberTypeId,
        phoneNumber: obj.phoneNumber,
        preferenceID: obj.preferenceID,
        otherPhoneNumberType: obj.otherPhoneNumberType,
        isDeleted: obj.isDeleted,
        patientID: this.clientId,
      })
    );

    this.selectedPhoneCode.push('0');
  }
  addAdditionalAddress() {
    this.addAddress(new AddressModel());
  }

  removeAdress(index: number) {
    this.addresses.removeAt(index);
  }
  addAdditionalPhoneNumber() {
    this.addPhoneNumber(new PhoneNumberModel());
  }

  removePhoneNumber(index: number) {
    this.phoneNumbers.removeAt(index);
    this.selectedPhoneCode.splice(index, 1);
  }
  getAddressesAndPhoneNumbers() {
    let addressArrayLength = 2;
    let phoneArrayLength = 1;
    this.clientService
      .getPatientAddressesAndPhoneNumbers(this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.data != null) {
          while (this.addresses.length !== 0) {
            this.addresses.removeAt(0);
          }
          while (this.phoneNumbers.length !== 0) {
            this.phoneNumbers.removeAt(0);
          }
          if (
            response.data.PatientAddress != null &&
            response.data.PatientAddress.length > 0
          ) {
            this.patientAddress = response.data.PatientAddress;
            addressArrayLength =
              this.patientAddress.length > 2
                ? this.patientAddress.length
                : addressArrayLength;
            for (let i = 0; i < addressArrayLength; i++) {
              if (this.patientAddress[i] != null) {
                if (i == 0)
                  this.sameAsPrimary = this.patientAddress[i].isMailingSame;
                this.addAddress(this.patientAddress[i]);
              } else this.addAddress(new AddressModel());
            }
          } else {
            this.addAddress(new AddressModel());
            this.addAddress(new AddressModel());
          }
          if (
            response.data.PhoneNumbers != null &&
            response.data.PhoneNumbers.length > 0
          ) {
            // this.phoneNumber = response.data.PhoneNumbers;
            if (response.data.PhoneNumbers.length > 0) {
              this.selectedPhoneCode = [];
            }

            this.phoneNumber = (response.data.PhoneNumbers || []
            ).map((Obj: { phoneNumber: string; }, index: any) => {
              let phoneCode = !Obj.phoneNumber ? "0" : Obj.phoneNumber.split(" ").length == 1 ? "0" : Obj.phoneNumber.split(" ")[0];
              phoneCode = phoneCode.replace("(", "").replace(")", "");
              this.selectedPhoneCode.push(phoneCode);
              Obj.phoneNumber = this.getPhoneNumber(Obj.phoneNumber, index);
              return Obj;
            });

            phoneArrayLength =
              this.phoneNumber.length > 1
                ? this.phoneNumber.length
                : phoneArrayLength;
            for (let i = 0; i < phoneArrayLength; i++) {
              if (this.phoneNumber[i] != null)
                this.addPhoneNumber(this.phoneNumber[i]);
              else this.addPhoneNumber(new PhoneNumberModel());
            }
          } else {
            this.addPhoneNumber(new PhoneNumberModel());
          }
        }
      });
  }

  sameAsPrimaryClick(event: any) {
    this.sameAsPrimary = event.checked;
    let pObJ = {};
    let pAdd = this.addresses.get([0]) as FormGroup;
    let mAdd = this.addresses.get([1]) as FormGroup;
    if (event.checked) {
      pObJ = {
        address1: pAdd.controls["address1"].value,
        countryId: pAdd.controls["countryId"].value,
        city: pAdd.controls["city"].value,
        apartmentNumber: pAdd.controls["apartmentNumber"].value,
        stateId: pAdd.controls["stateId"].value,
        zip: pAdd.controls["zip"].value,
        patientLocationId: pAdd.controls["patientLocationId"].value,
      };
    } else {
      pObJ = {
        address1: "",
        countryId: null,
        city: "",
        apartmentNumber: "",
        stateId: null,
        zip: "",
        patientLocationId: null,
      };
    }
    mAdd.patchValue(pObJ);
  }
  // updateValue(country: any) {
  //  this.usersService.getStateByCountryId(country).subscribe((res) => {
  //     console.log(res);
  //     if (res.statusCode == 200) {
  //       this.masterState = res.data;
  //     } else {
  //       this.masterState = [];
  //       this.notifier.notify("error", res.message);
  //     }
  //   });
  // }

  async updateValue(country: any): Promise<any> {
    this.resetSameAsPrimaryAddress();
    return this.usersService.getStateByCountryId(country).toPromise();
  }

  phoneCodeChange($event: any, index: any) {
    this.selectedPhoneCode[index] = $event;
  }

  getPhoneNumber(phoneNumber: string, index: any) {
    if (phoneNumber) {
      const phoneData = phoneNumber.split(" ");
      if (phoneData.length == 1) {
        phoneNumber = phoneData[0];
      } else {
        phoneNumber = phoneData[1];
      }
    } else {
      return phoneNumber;
    }
    return phoneNumber;
  }

  //reset set Primary address check box and it's values 
  resetSameAsPrimaryAddress() {
    this.sameAsPrimary = false;
    let mAdd = this.addresses.get([1]) as FormGroup;
    let pObJ = {};
    pObJ = {
      address1: "",
      countryId: null,
      city: "",
      apartmentNumber: "",
      stateId: null,
      zip: "",
      patientLocationId: null,
    };
    mAdd.patchValue(pObJ);
  }
}
