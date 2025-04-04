import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { SecurityQuestionModel } from '../master-securityquestions/securityquestion-model';
import { SecurityquestionmasterService } from '../master-securityquestions/securityquestionmaster.service';



@Component({
  selector: 'app-create-mastersecurityquestion',
  templateUrl: './create-mastersecurityquestion.component.html',
  styleUrls: ['./create-mastersecurityquestion.component.css']
})
export class CreateMastersecurityquestionComponent implements OnInit {
  serviceModel: SecurityQuestionModel;
  serviceForm!: FormGroup;
  submitted: boolean = false;
 // masterSpeciality:any[]=[];
  headerText: string = 'Add SecurityQuestion';
  isEdit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private serviceDialogModalRef: MatDialogRef<CreateMastersecurityquestionComponent>,
    private masterService: SecurityquestionmasterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    this.serviceModel = data;
    //header text updation
    if (this.serviceModel.id >0){
      this.headerText = 'Edit SecurityQuestion';
      this.isEdit = true;
    }
    else
      this.headerText = 'Add SecurityQuestion';
   }

  ngOnInit() {
    this.serviceForm = this.formBuilder.group({
      id: [this.serviceModel.id],
      Question: new FormControl(this.serviceModel.question, {
        validators: [Validators.required],
       // asyncValidators: [this.validateService.bind(this)],
        updateOn: "blur"
      }),
      isActive: [this.serviceModel.isActive]
    });
  }
  get formControls() {
    return this.serviceForm.controls;''
  }

  closeDialog(type?: string): void {
    this.serviceDialogModalRef.close(type);
  }
  onSubmit() {
    this.submitted = true;
    if (this.serviceForm.invalid) {
      this.submitted = false;
      return;
    }
    this.serviceModel = this.serviceForm.value;

    this.masterService.create(this.serviceModel).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode === 200) {
        if (this.isEdit)
          this.notifier.notify("success", "Master service has been updated successfully.");
        else
          this.notifier.notify("success", response.message);
        this.closeDialog("Save");
      } else {
        this.notifier.notify("error", response.message);
      }
    });
  }
}