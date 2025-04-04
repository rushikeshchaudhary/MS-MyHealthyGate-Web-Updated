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
import { SpecialityService } from "src/app/platform/modules/agency-portal/masters/speciality/speciality.service";
import { NotifierService } from "angular-notifier";
import { SpecialityModel } from "src/app/platform/modules/agency-portal/masters/speciality/speciality.model";
import { CommonService } from "src/app/super-admin-portal/core/services";
import { debug } from "console";
import { DomSanitizer } from "@angular/platform-browser";
import { MasterService } from "../../service/service.service";

@Component({
  selector: "app-speciality-modal",
  templateUrl: "./speciality-modal.component.html",
  styleUrls: ["./speciality-modal.component.css"]
})
export class SpecialityModalComponent implements OnInit {
  specialityModel: SpecialityModel;
  specialityForm!: FormGroup;
  submitted: boolean = false;
  dataURL: any;
  imagePreview: any;
  masterCategory: any[] = [];
  editmodel: any;
  headerText: string = 'Add Speciality';
  checkduplicate: boolean = false;
  constructor(
    private domSanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private serviceDialogModalRef: MatDialogRef<SpecialityModalComponent>,
    private specialityService: SpecialityService,
    private masterService: MasterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    this.specialityModel = data;
    if (this.specialityModel.id != null && this.specialityModel.id != "") {
      this.headerText = 'Edit Speciality';
      this.editmodel = true;
    }
    else {
      this.headerText = 'Add Speciality';
    }
  }

  ngOnInit() {
    this.specialityForm = this.formBuilder.group({
      id: [this.specialityModel.id],
      globalCodeName: new FormControl(this.specialityModel.globalCodeName, {
        validators: [Validators.required],
        asyncValidators: [this.validateService.bind(this)],
        //asyncValidators: [],
        updateOn: "blur"
      }),
      globalCodeCategoryID: new FormControl(this.specialityModel.globalCodeCategoryID, {
        validators: [Validators.required],
        asyncValidators: [this.validateService.bind(this)],
        updateOn: "blur"
      }),
      isActive: [this.specialityModel.isActive],
     // globalCodeCategoryID: [this.specialityModel.globalCodeCategoryID, [Validators.required]],
      userImg: []

      // isActive: [this.specialityModel.isActive]
    });
    this.getCategories();
  }
  getCategories() {

    let data = "GLOBALCODECATEGORY"
    this.specialityService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterCategory = response.masterGlobalCategories != null ? response.masterGlobalCategories : [];
        if (this.specialityModel.photoThumbnailPath != '') {
          this.imagePreview = this.domSanitizer.bypassSecurityTrustUrl(this.specialityModel.photoThumbnailPath)
        }
      }
    });
  }

  get formControls() {
    return this.specialityForm.controls; ''
  }

  onSubmit() {
    //////debugger
    this.submitted = true;
    if (this.specialityForm.invalid) {
      this.submitted = false;
      return;
    }
    this.specialityModel = this.specialityForm.value
    this.specialityModel.specialityIcon = this.dataURL;
    if (this.specialityModel.specialityIcon == null || this.specialityModel.specialityIcon == '' || this.specialityModel.specialityIcon == undefined) {
      this.submitted = false;
      this.notifier.notify("error", "Please select speciality icon");
    }
    else {
  
      this.specialityService.create(this.specialityModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode === 200) {
          if (this.editmodel) {
            this.notifier.notify("success", "Speciality has been updated successfully");
          }
          else
            this.notifier.notify("success", response.message);

          this.closeDialog("Save");
        } else {
          this.notifier.notify("error", response.message);
        }
      });
    
  }
 
  }
  closeDialog(type?: string): void {
    this.serviceDialogModalRef.close(type);
  }
 
  handleImageChange(e:any) {

    if (this.specialityService.isValidFileType(e.target.files[0], "image")) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        this.dataURL = reader.result;
        this.imagePreview = this.domSanitizer.bypassSecurityTrustUrl(this.dataURL); //'data:image/png;base64,' + this.dataURL.substr(this.dataURL.indexOf(',')+1); //this.dataURL;
      };
      reader.readAsDataURL(input.files[0]);
    } else this.notifier.notify("error", "Please select valid file type with size less than 2 MB");
  }

  
  validateService(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise(resolve => {
      if (!ctrl.dirty) {
       resolve(null);;
      } else
        this.specialityService.validate(ctrl.value).subscribe((response: any) => {
          if (response.statusCode != 404) resolve({ uniqueName: true });
          else resolve(null);;
        });
    });
  }
}
