import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { ManagePharmacyService } from 'src/app/super-admin-portal/manage-pharmacy/manage-pharmacy.service';
import { ResponseModel } from '../../core/modals/common-model';
import { ClientsService } from '../clients.service';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-pharmacy-dialog',
  templateUrl: './pharmacy-dialog.component.html',
  styleUrls: ['./pharmacy-dialog.component.css']
})
export class PharmacyDialogComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private notifier: NotifierService, private clientService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<PharmacyDialogComponent>,private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
   }
  pharmacyForm!: FormGroup;
  pharmacyList:any;
  organizationId: number = 128;
  submitted: boolean = false;
  pharmacyId!: number;
  ngOnInit() {
    this.pharmacyForm = this.formBuilder.group({
      'pharmacyName': ['']
    });
    console.log(this.data);
    
    this.loadPharmacyData(this.organizationId);
  }
  get formControls() { return this.pharmacyForm.controls; }

  loadPharmacyData(organizationId: number) {
    this.clientService.getAllPharmacyList(organizationId).subscribe((response: ResponseModel) => {
      this.pharmacyList = response.statusCode == 200 ? response.data : [];
      this.pharmacyList = this.pharmacyList.length > 0 ? this.pharmacyList.filter((d: { pharmacyName: undefined; }) => d.pharmacyName != undefined) : [];
    });
  }
  onOkClick() {
    if (this.pharmacyForm.invalid) return;
    // let patientId = this.data.patientId;
    // let prescriptionIds = this.data.prescriptionId;
    // let pId = this.pharmacyId;
    debugger
    var postData = {
      patientId: this.data.patientId,
      prescriptionIds: this.data.prescriptionId,
      pharmacyId: this.pharmacyId
    };
    this.clientService.SaveSharePrescription(postData).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.notifier.notify('success', response.message);
      } else {
        this.notifier.notify('error', response.message);
      }
    });
    this.dialogRef.close();
  }
  onChangPharmacy(pharmacyId: number) {
    this.pharmacyId = pharmacyId;
  }
  onClose() {
    this.dialogRef.close();
  }
}
