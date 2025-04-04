import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  @Output() change!: EventEmitter<MatRadioChange>;
  tempURL: string = "";
  hide: boolean = true;
  mrValue: string = "patient";
  stringType!: MatRadioChange;
  isLabOrPharmacy!: boolean;//= true;
  showLoader!: boolean;
  // isPatientOrProvider: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.isLabOrPharmacy = false;
    console.log(this.mrValue);
  }

  onChange(mrChange: MatRadioChange) {
    ////debugger
    console.log(mrChange);
    this.mrValue = mrChange.value;
    // window.location.reload();
    switch (this.mrValue.toUpperCase()) {
      case 'PATIENT':
        this.isLabOrPharmacy = false;
        this.tempURL = '/web/sign-up';
        break;
      case 'PROVIDER':
        this.isLabOrPharmacy = false;
        this.tempURL = '/web/sign-up';
        break;
      case 'PHARMACY':
        this.isLabOrPharmacy = true;
        this.tempURL = '/web/sign-up';
        break;
      case 'LAB':
        this.isLabOrPharmacy = true;
        this.tempURL = '/web/sign-up';
        break;
      case 'RADIOLOGY':
        this.isLabOrPharmacy = true;
        this.tempURL = '/web/sign-up';
        break;
      default:
        break;
    }
  }
  redirect(path:any) {
    this.router.navigate([path]);
  }

}
