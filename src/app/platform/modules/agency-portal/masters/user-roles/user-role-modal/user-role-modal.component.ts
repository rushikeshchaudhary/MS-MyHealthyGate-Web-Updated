import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { UserRoleModal } from '../user-role.modal';
import { UserRoleService } from '../user-role.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-user-role-modal',
  templateUrl: './user-role-modal.component.html',
  styleUrls: ['./user-role-modal.component.css']
})
export class UserRoleModalComponent implements OnInit {
  userRoleForm!: FormGroup;
  userRoleModal: UserRoleModal;
  userRoleId: number|undefined;
  // for loading ...
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userRoleService: UserRoleService,
    private dialogRef: MatDialogRef<UserRoleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserRoleModal,
    private notifier: NotifierService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.userRoleModal = data || new UserRoleModal();
    this.userRoleId = this.userRoleModal.id;
  }

  ngOnInit() {
    this.initializeFormFields(this.userRoleModal);
  }

  // convenience getter for easy access to form fields
  get f() { return this.userRoleForm.controls; }

  initializeFormFields(userRoleObj?: UserRoleModal) {
    userRoleObj = userRoleObj || new UserRoleModal();
    const configControls = {
      'roleName': new FormControl(userRoleObj.roleName, {
        validators: [Validators.required],
     //   asyncValidators: [this.validateRoleName.bind(this)],
        updateOn: 'blur'
      }),
      'isActive': [userRoleObj.isActive, Validators.required],
    }
    this.userRoleForm = this.formBuilder.group(configControls);
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.userRoleForm.invalid) {
      this.submitted = false;
      return;
    }
    this.userRoleModal = this.userRoleForm.value;
    this.userRoleModal.userType = 'STAFF';
    this.userRoleModal.id = this.userRoleId;
    this.userRoleService.create(this.userRoleModal).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode === 200) {
        this.notifier.notify('success', response.message)
        this.dialogRef.close('SAVE');
      } else {
        this.notifier.notify('error', response.message)
      }
    })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  validateRoleName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "Role name",
        "tableName": "MASTER_USERROLES_ROLENAME",
        "value": ctrl.value,
        "colmnName": "ROLENAME",
        "id": this.userRoleId,
      }
      if (!ctrl.dirty) {
       resolve(null);;
      } else
      this.userRoleService.validate(postData)
        .subscribe((response: any) => {
          if (response.statusCode !== 202)
            resolve({ uniqueName: true })
          else
           resolve(null);;
        })
    })
  }
}
