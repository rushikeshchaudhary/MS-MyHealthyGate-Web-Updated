import { Component, Input, OnInit, Output, EventEmitter, ViewChild, AfterViewInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { CommonService } from "src/app/platform/modules/core/services";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-phone-number",
  templateUrl: "./phone-number.component.html",
  styleUrls: ["./phone-number.component.css"],
})
export class PhoneNumberComponent implements OnInit {
  allCountries: Array<any> = [];
  filterCountry: Array<any> = [];
  inputSearch:any;
  @Input() countryId: number=0;
  @Input() selectedCountryPhoneCode: any;
  @Input() index: number = -1;
  @Output() phoneCodeChangeEvent = new EventEmitter<string>();
  setCountryCode: string='';
  myFormGroup!: FormGroup;
  @ViewChild('someRef') someRef:any;

  constructor(private userservice: UsersService,private translate:TranslateService) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
   }
  ngOnInit() {
    this.bindCountryList();
  }

  public selectedDataValue(event: any) {
    if (this.someRef) this.someRef.nativeElement.focus();

  }
  bindCountryList() {
    this.userservice
      .getCountriesPhoneCode(this.countryId)
      .subscribe((response) => {
        if (response.statusCode == 302) {
          this.allCountries = response.data;
          this.filterCountry = response.data;
          console.log(response.data);
          if (this.selectedCountryPhoneCode!=undefined) {         
          if (this.selectedCountryPhoneCode != "0") {
            this.setCountryCode = this.selectedCountryPhoneCode.includes("+")
              ? this.selectedCountryPhoneCode
              : "+" + this.selectedCountryPhoneCode;
            this.setCountryCode = this.setCountryCode
              .replace("(", "")
              .replace(")", "");
          }
        }
        } else {
          this.allCountries = [];
        }
      });
  }
  onSelect(event: any) {
    this.setCountryCode = event;
    console.log(event);
    if (this.index == -1) {
      this.phoneCodeChangeEvent.emit(event + " ");
    } else {
      this.phoneCodeChangeEvent.emit(event + " _" + this.index);
    }
  }
  bindCountryCode(phoneCode: string) {
    this.setCountryCode = "";
    this.setCountryCode = phoneCode.includes("+") ? phoneCode : "+" + phoneCode;
    this.setCountryCode = this.setCountryCode.replace("(", "").replace(")", "");
  }

  onKey = (e: any) => {
    this.filterCountry = this.allCountries.filter((country) => {
      return country.text.toLowerCase().indexOf(e) != -1;
    });
  };
}
