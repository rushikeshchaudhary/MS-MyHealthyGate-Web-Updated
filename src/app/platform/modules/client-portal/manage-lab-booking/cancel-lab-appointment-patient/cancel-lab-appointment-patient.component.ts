import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { CommonService } from '../../../core/services';
import { LabService } from '../../../lab/lab.service';
import { CancelAppointmentModel } from '../../../scheduling/scheduler/scheduler.model';
import { SchedulerService } from '../../../scheduling/scheduler/scheduler.service';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-cancel-lab-appointment-patient',
  templateUrl: './cancel-lab-appointment-patient.component.html',
  styleUrls: ['./cancel-lab-appointment-patient.component.css']
})
export class CancelLabAppointmentPatientComponent implements OnInit {
  cancelAppointmentForm!: FormGroup;
  cancelAppointmentModel:any;
  appointmentId: number;
  submitted: boolean = false;
  isloadingMasterData: boolean = false;
  masterCancelType: Array<any>;
  currentLoginUserId:any;
  isAdminLogin=false;
  isClientLogin= false;

  constructor(
    private formBuilder: FormBuilder,
    private schedulerService: SchedulerService,
    public dialogPopup: MatDialogRef<CancelLabAppointmentPatientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private commonService: CommonService,
    private labService:LabService,
    private translate:TranslateService,
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.appointmentId = data;
    this.masterCancelType = [];
   }

  ngOnInit() {
    this.initializeFormFields(this.cancelAppointmentModel);
    this.fetchMasterData();
    this.checkLoggedInUser();
  }
  checkLoggedInUser() {
    this.commonService.currentLoginUserInfo.subscribe(
       (user: any) => {
         if (user) {
           this.currentLoginUserId = user.id;
           this.isAdminLogin =
             user.users3 &&
             user.users3.userRoles &&
             (user.users3.userRoles.userType || "").toUpperCase() == "ADMIN";
 
          this.isClientLogin= user.users3 &&
             user.users3.userRoles &&
             (user.users3.userRoles.userType || "").toUpperCase() == "CLIENT";
 
             
             
         }
         });
   }


   initializeFormFields(cancelModel?: CancelAppointmentModel) {
    cancelModel = cancelModel || new CancelAppointmentModel();
    const configControls = {
      'cancelId': [cancelModel.cancelTypeId, Validators.required],
      'cancelReason': [cancelModel.cancelReason, Validators.required],
    }
    this.cancelAppointmentForm = this.formBuilder.group(configControls);
    
  }
  get formControls() { return this.cancelAppointmentForm.controls; }

  onClose(): void {
    this.dialogPopup.close();
  }
  onSubmit=()=>{
    this.submitted = true;
    if (this.cancelAppointmentForm.invalid) {
      this.submitted = false;
      return;
    }
    this.cancelAppointmentModel = this.cancelAppointmentForm.value;
    this.cancelAppointmentModel.appointmentId = this.appointmentId;

    console.log(this.cancelAppointmentModel)

   
    this.labService
      .cancelLabAppointment(this.cancelAppointmentModel)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.notifier.notify("success", response.message);
          this.dialogPopup.close("SAVE");
        } else {
          this.notifier.notify("error", response.message);
        }
      });

    



  }





  fetchMasterData(): void {
    // load master data
    this.isloadingMasterData = true;
    const masterData = { masterdata: "MASTERCANCELTYPE" };
    this.schedulerService.getMasterData(masterData)
      .subscribe((response: any) => {
        this.isloadingMasterData = false;
        this.masterCancelType = response.masterCancelType || [];

        if(this.isClientLogin){
          this.masterCancelType = this.masterCancelType.filter(x => x.value == 'Cancel By Client');
           this.formControls['cancelId'].setValue(this.masterCancelType[0].id);
        }

      });
  }

}
