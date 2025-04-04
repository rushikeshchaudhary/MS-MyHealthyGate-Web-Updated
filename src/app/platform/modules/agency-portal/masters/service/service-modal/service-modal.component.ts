import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, OnInit, Inject } from "@angular/core";
import {
  AbstractControl,
  ValidationErrors,
  FormControl,
  Validators,
  FormBuilder,
  FormGroup
} from "@angular/forms";
import { Observable } from "rxjs";
import { MasterService } from "src/app/platform/modules/agency-portal/masters/service/service.service";
import { NotifierService } from "angular-notifier";
import { ServiceModel } from "src/app/platform/modules/agency-portal/masters/service/service.model";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-service-modal",
  templateUrl: "./service-modal.component.html",
  styleUrls: ["./service-modal.component.css"]
})
export class ServiceModalComponent implements OnInit {
  serviceModel: ServiceModel;
  serviceForm!: FormGroup;
  submitted: boolean = false;
  masterSpeciality:any[]=[];
  headerText: string = 'Add Service';
  isEdit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private serviceDialogModalRef: MatDialogRef<ServiceModalComponent>,
    private masterService: MasterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate:TranslateService,
    private notifier: NotifierService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.serviceModel = data;
    //header text updation
    if (this.serviceModel.id != null && this.serviceModel.id !=""){
      this.headerText = 'Edit Service';
      this.isEdit = true;
    }
    else
      this.headerText = 'Add Service';
  }

  ngOnInit() {
    this.serviceForm = this.formBuilder.group({
      id: [this.serviceModel.id],
      serviceName: new FormControl(this.serviceModel.serviceName, {
        validators: [Validators.required],
        asyncValidators: [this.validateService.bind(this)],
        updateOn: "blur"
      }),
      globalCodeId: new FormControl(this.serviceModel.globalCodeId, {
        validators: [Validators.required],
        asyncValidators: [this.validateService.bind(this)],
        updateOn: "blur"
      }),
      isActive: [this.serviceModel.isActive]
    });
    this.getSpecialities();
  }
  getSpecialities()
  {
     
    let data = "MASTERSPECIALITY"
    this.masterService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterSpeciality = response.masterSpeciality != null ? response.masterSpeciality : [];
      }
    });
  }   
  
  get formControls() {
    return this.serviceForm.controls;''
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
  closeDialog(type?: string): void {
    this.serviceDialogModalRef.close(type);
  }

  validateService(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise(resolve => {
      if (!ctrl.dirty) {
       resolve(null);;
      } else
        this.masterService.validate(ctrl.value).subscribe((response: any) => {
          if (response.statusCode != 404) resolve({ uniqueName: true });
          else resolve(null);;
        });
    });
  }
}
