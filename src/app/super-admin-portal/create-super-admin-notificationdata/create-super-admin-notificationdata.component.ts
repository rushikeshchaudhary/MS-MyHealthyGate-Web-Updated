import { Subject } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { SuperAdminDataModel } from 'src/app/platform/modules/core/modals/common-model';
import { SuperAdminnotificationService } from '../super-admin-notification/super-adminnotification.service';

@Component({
  selector: 'app-create-super-admin-notificationdata',
  templateUrl: './create-super-admin-notificationdata.component.html',
  styleUrls: ['./create-super-admin-notificationdata.component.css']
})
export class CreateSuperAdminNotificationdataComponent implements OnInit {
  submitted: boolean = false;
  CategoryMasterForm!: FormGroup;
  MasterCategoryModel: SuperAdminDataModel;
  headerText: string = 'Add Contant';
  isEdit: boolean = false;
  constructor(private serviceDialogModalRef: MatDialogRef<CreateSuperAdminNotificationdataComponent>,private formBuilder: FormBuilder,private notifier: NotifierService,@Inject(MAT_DIALOG_DATA) public data: any,private AdminDataservice:SuperAdminnotificationService) {
    this.MasterCategoryModel=data;
    this.headerText = 'Add Contant';
   }
  ngOnInit() {
    if(this.MasterCategoryModel.patientID>0){
    this.CategoryMasterForm = this.formBuilder.group({
      patientid:[this.MasterCategoryModel.patientID],
      FullName: new FormControl(this.MasterCategoryModel.fullName,
         {
        validators: [Validators.required],
        updateOn: "blur"
      }),
      Email:new FormControl(this.MasterCategoryModel.email,
        {
       validators: [Validators.required],
       updateOn: "blur"
     }),
     Subject:new FormControl(this.MasterCategoryModel.Subject,
      {
     validators: [Validators.required],
     updateOn: "blur"
   }),
   Reason:new FormControl(this.MasterCategoryModel.Reason,
    {
   validators: [Validators.required],
   updateOn: "blur"
 }),

       });
      }
      if(this.MasterCategoryModel.staffID>0){
        this.CategoryMasterForm = this.formBuilder.group({
        Providerid:[this.MasterCategoryModel.staffID],
        FullName: new FormControl(this.MasterCategoryModel.providerFullName,
           {
          validators: [Validators.required],
          updateOn: "blur"
        }),
        Email:new FormControl(this.MasterCategoryModel.email,
          {
         validators: [Validators.required],
         updateOn: "blur"
       }),
       Subject:new FormControl(this.MasterCategoryModel.Subject,
        {
       validators: [Validators.required],
       updateOn: "blur"
     }),
     Reason:new FormControl(this.MasterCategoryModel.Reason,
      {
     validators: [Validators.required],
     updateOn: "blur"
   }),

         });
      }
      if(this.MasterCategoryModel.labID>0){
        this.CategoryMasterForm = this.formBuilder.group({
        LabId:[this.MasterCategoryModel.labID],
        FullName: new FormControl(this.MasterCategoryModel.labFullName,
           {
          validators: [Validators.required],
          updateOn: "blur"
        }),
        Email:new FormControl(this.MasterCategoryModel.labEmail,
          {
         validators: [Validators.required],
         updateOn: "blur"
       }),
       Subject:new FormControl(this.MasterCategoryModel.Subject,
        {
       validators: [Validators.required],
       updateOn: "blur"
     }),
     Reason:new FormControl(this.MasterCategoryModel.Reason,
      {
     validators: [Validators.required],
     updateOn: "blur"
   }),

         });
      }
      if(this.MasterCategoryModel.pharmacyID>0){
        this.CategoryMasterForm = this.formBuilder.group({
        pharmacyid:[this.MasterCategoryModel.pharmacyID],
        FullName: new FormControl(this.MasterCategoryModel.pharmaFullName,
           {
          validators: [Validators.required],
          updateOn: "blur"
        }),
        Email:new FormControl(this.MasterCategoryModel.pharmaEmail,
          {
         validators: [Validators.required],
         updateOn: "blur"
       }),
       Subject:new FormControl(this.MasterCategoryModel.Subject,
        {
       validators: [Validators.required],
       updateOn: "blur"
     }),
     Reason:new FormControl(this.MasterCategoryModel.Reason,
      {
     validators: [Validators.required],
     updateOn: "blur"
   }),

         });
        }
         if(this.MasterCategoryModel.radiologyID>0){
          this.CategoryMasterForm = this.formBuilder.group({
            Radiologyid:[this.MasterCategoryModel.radiologyID],
            FullName: new FormControl(this.MasterCategoryModel.radioFullName,
             {
            validators: [Validators.required],
            updateOn: "blur"
          }),
          Email:new FormControl(this.MasterCategoryModel.radioEmail,
            {
           validators: [Validators.required],
           updateOn: "blur"
         }),
         Subject:new FormControl(this.MasterCategoryModel.Subject,
          {
         validators: [Validators.required],
         updateOn: "blur"
       }),
       Reason:new FormControl(this.MasterCategoryModel.Reason,
        {
       validators: [Validators.required],
       updateOn: "blur"
     }),

           });
        }

  }

  closeDialog(type?: string): void {
    this.serviceDialogModalRef.close(type);
  }
  onSubmit() {
    this.submitted = true;
    if (this.CategoryMasterForm.invalid) {
      this.submitted = false;
      return;
    }
    this.MasterCategoryModel = this.CategoryMasterForm.value;

    this.AdminDataservice.create(this.MasterCategoryModel).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode === 200) {
        if (this.isEdit)
          this.notifier.notify("success", "Mail has been send to the respective user.");
        else
          this.notifier.notify("success", response.message);
        this.closeDialog("Save");
      } else {
        this.notifier.notify("error", response.message);
      }
    });
  }
  get formControls() {
    return this.CategoryMasterForm.controls;''
  }

}
