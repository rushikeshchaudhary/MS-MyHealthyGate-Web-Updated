import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-patient-modal',
  templateUrl: './add-patient-modal.component.html',
  styleUrls: ['./add-patient-modal.component.css']
})
export class AddPatientModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddPatientModalComponent>
    , @Inject(MAT_DIALOG_DATA) public data:any) { }
  // mrValue: string = 'patient';
  isPatientOrProvider: boolean = false
  isLabOrPharmacy: boolean = false;
  title: string="";
  ngOnInit() {
    this.isPatientOrProvider = this.data.isPatientOrProvider;
    this.isLabOrPharmacy = this.data.isLabOrPharmacy;
    this.title = this.data.title;
    // console.log(this.data.mrValue);
  }
  closeModal() {
    this.dialogRef.close();
  }
}
