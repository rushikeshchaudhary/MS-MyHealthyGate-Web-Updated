import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { ClientsService } from '../../clients.service';
import { NotifierService } from 'angular-notifier';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { VitalModel } from '../vitals.model';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { reject } from 'lodash';

@Component({
  selector: 'app-vital-modal',

  templateUrl: './vital-modal.component.html',
  styleUrls: ['./vital-modal.component.css'],
})
export class VitalModalComponent implements OnInit {
  maxDate = new Date();
  patientId: number;
  vitalModel: VitalModel;
  vitalForm!: FormGroup;
  submitted: boolean = false;
  headerText: string = 'Add Client Vital';
  error: string = 'Please fill atleast one more vital other than date';
  appointmentId: number = 0;
  //////////////////
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private vitalDialogModalRef: MatDialogRef<VitalModalComponent>,
    private clientService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    translate.setDefaultLang(localStorage.getItem('language') || 'en');
    translate.use(localStorage.getItem('language') || 'en');
    //assign data
    this.vitalModel = data.vital;
    this.refreshGrid.subscribe(data.refreshGrid);
    this.patientId = this.vitalModel.patientID;
    this.appointmentId = this.vitalModel.appointmentId ?? 0;
    //update header text
    if (this.vitalModel.id != null && this.vitalModel.id > 0)
      this.headerText = 'Edit Client Vital';
    else this.headerText = 'Add Client Vital';
  }

  ngOnInit() {
    this.vitalForm = this.formBuilder.group({
      id: [this.vitalModel.id],
      patientID: [this.vitalModel.patientID],
      bmi: [this.vitalModel.bmi],
      bpDiastolic: [
        this.vitalModel.bpDiastolic,
        {
          asyncValidators: [this.validateBpdystolic.bind(this)],
        },
      ],
      bpSystolic: [
        this.vitalModel.bpSystolic,
        {
          asyncValidators: [this.validateBpsystolic.bind(this)],
        },
      ],
      heartRate: [
        this.vitalModel.heartRate,
        {
          asyncValidators: [this.validateHeartRate.bind(this)],
        },
      ],
      heightIn: [
        this.vitalModel.heightIn,
        {
          asyncValidators: [this.validateHeight.bind(this)],
        },
      ],
      pulse: [
        this.vitalModel.pulse,
        {
          asyncValidators: [this.validatePulse.bind(this)],
        },
      ],
      respiration: [
        this.vitalModel.respiration,
        {
          asyncValidators: [this.validateRespiration.bind(this)],
        },
      ],
      temperature: [
        this.vitalModel.temperature,
        {
          asyncValidators: [this.validateTemperature.bind(this)],
        },
      ],
      vitalDate: [this.vitalModel.vitalDate],
      weightLbs: [
        this.vitalModel.weightLbs,
        {
          asyncValidators: [this.validateWeight.bind(this)],
        },
      ],
    });
  }

  //get the form controls on html page
  get formControls() {
    return this.vitalForm.controls;
  }

  //submit for create update of vitals
  onSubmit(event: any) {
    if (!this.vitalForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.vitalModel = this.vitalForm.value;
      this.vitalModel.patientID = this.patientId;
      this.vitalModel.appointmentId = this.appointmentId;
      this.clientService
        .createVital(this.vitalModel)
        .subscribe((response: any) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifier.notify('success', response.message);
            if (clickType == 'Save') this.closeDialog('save');
            else if (clickType == 'SaveAddMore') {
              this.refreshGrid.next('');
              this.vitalForm.reset();
            }
          } else {
            this.notifier.notify('error', response.message);
          }
        });
    }
  }
  get vitalValidation() {
    return (
      !this.formControls['heightIn'].value &&
      !this.formControls['weightLbs'].value &&
      !this.formControls['heartRate'].value &&
      !this.formControls['bpSystolic'].value &&
      !this.formControls['bpDiastolic'].value &&
      !this.formControls['pulse'].value &&
      !this.formControls['respiration'].value &&
      !this.formControls['temperature'].value
    );
  }
  //close popup
  closeDialog(action: string): void {
    this.vitalDialogModalRef.close(action);
  }

  validateHeight(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var height = ctrl.value;

        if (height >= 256) resolve({ height: true });
        else resolve(null);
      }
    });
  }

  validateWeight(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var weight = ctrl.value;

        if (weight >= 1000)
          //this.submitted=false,
          resolve({ weight: true });
        else resolve(null);
      }
    });
  }

  validateHeartRate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var heartrate = ctrl.value;

        if (heartrate >= 201) resolve({ heartrate: true });
        else resolve(null);
      }
    });
  }
  validateBpsystolic(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var bpsytolic = ctrl.value;

        if (bpsytolic >= 281) resolve({ bpsytolic: true });
        else resolve(null);
      }
    });
  }
  validateBpdystolic(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var dystolic = ctrl.value;

        if (dystolic >= 141) resolve({ dystolic: true });
        else resolve(null);
      }
    });
  }
  validatePulse(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var pulse = ctrl.value;

        if (pulse >= 101) resolve({ pulse: true });
        else resolve(null);
      }
    });
  }
  validateRespiration(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var respiration = ctrl.value;

        if (respiration >= 101) resolve({ respiration: true });
        else resolve(null);
      }
    });
  }
  validateTemperature(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var temperature = ctrl.value;

        if (temperature >= 116) resolve({ temperature: true });
        else resolve(null);
      }
    });
  }
}
