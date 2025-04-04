import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'app-sign-dialog',
  templateUrl: './sign-dialog.component.html',
  styleUrls: ['./sign-dialog.component.css']
})
export class SignDialogComponent implements OnInit {
  signForm!: FormGroup;
  SignatoryLists: Array<any>;
  StaffLists: Array<any>;
  clientDetails: any;
  signDataUrl : string;
  submitted: boolean;
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;
 
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'dotSize': parseFloat('0.1'),
    'minWidth': 5,
    'canvasWidth': 600,
    'canvasHeight': 300
  };

  constructor(
    private formBuilder: FormBuilder,
    public dialogPopup: MatDialogRef<SignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.signDataUrl = '';
    this.submitted =false;
    this.SignatoryLists = data.SignatoryLists;
    this.StaffLists = data.staffsList || [];
    this.clientDetails = data.clientDetails || null;
   }

  ngOnInit() {
    this.signForm = this.formBuilder.group({
      'Signatory': [''],
      'StaffID': [''],
      'Client': [this.clientDetails && this.clientDetails.value],
      'Guardian': ['']
    })
  }

  get formControls() {
    return this.signForm.controls;
  }

  onSubmit():any {
    if (this.signForm.invalid || !this.signDataUrl) {
      return null;
    }

    const { StaffID, Signatory, Guardian } = this.signForm.value;

    let clientName = this.clientDetails && this.clientDetails.value,
        staffName = this.StaffLists.find(obj => obj.id == StaffID) && this.StaffLists.find(obj => obj.id == StaffID).value,
        guardianName = Guardian;

    const result = {
      'Signatory': Signatory,
      'name': Signatory == this.SignatoryLists[0] ? staffName : Signatory == this.SignatoryLists[1] ? clientName : guardianName,
      'bytes': this.signDataUrl,
    }
    this.dialogPopup.close(result);
    return
  }

  onClose() {
    this.dialogPopup.close();
  }

  onClear() {
    this.signaturePad.clear();
    this.signDataUrl = '';
  }

  // sign pad
  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }
 
  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    // console.log(this.signaturePad.toDataURL());
    this.signDataUrl = this.signaturePad.toDataURL();
  }
 
}
