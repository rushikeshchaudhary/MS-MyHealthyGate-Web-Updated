import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { TestMasterModule } from './Test-masterModule';
import { TestmasterserviceService } from './testmasterservice.service';

@Component({
  selector: 'app-create-test-masterdata',
  templateUrl: './create-test-masterdata.component.html',
  styleUrls: ['./create-test-masterdata.component.css']
})
export class CreateTestMasterdataComponent implements OnInit {
  submitted: boolean = false;
  CategoryMasterForm!: FormGroup;
  MasterCategoryModel: TestMasterModule;
  headerText: string = 'Add Lab-List-Master';
  isEdit: boolean = false;
  selectedRole: any;

  constructor(
    private serviceDialogModalRef: MatDialogRef<CreateTestMasterdataComponent>,
    private formBuilder: FormBuilder,
    private TestmasterserviceService: TestmasterserviceService,
    private notifier: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    debugger;
    this.MasterCategoryModel = data.serviceModal;

    this.selectedRole = data.selectedRole;
    if (this.MasterCategoryModel.testID > 0) {
      this.headerText = 'Edit Lab-List-Master';
      this.isEdit = true;
    } else {
      this.headerText = 'Add Lab-List-Master';
    }
  }

  ngOnInit() {
    this.CategoryMasterForm = this.formBuilder.group({
      TestID: [this.MasterCategoryModel.testID],
      TestName: new FormControl(this.MasterCategoryModel.testName, {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      Cost: new FormControl(this.MasterCategoryModel.cost, { validators: [Validators.required] }),
      isActive: new FormControl(this.MasterCategoryModel.isActive),
      limsCode: new FormControl(this.MasterCategoryModel.limsCode ),
      loincCode: new FormControl(this.MasterCategoryModel.loincCode),
      shortName: new FormControl(this.MasterCategoryModel.shortName),
      cpt: new FormControl(this.MasterCategoryModel.cpt),
      jordanianCode: new FormControl(this.MasterCategoryModel.jordanianCode)
    });
  }

  closeDialog(type?: string): void {
    this.serviceDialogModalRef.close(type);
  }

  onSubmit() {
    debugger
    this.submitted = true;
    if (this.CategoryMasterForm.invalid) {
      this.submitted = false;
      return;
    }
    this.MasterCategoryModel = this.CategoryMasterForm.value;
    this.MasterCategoryModel.roleId = this.data.roleId;
    
    this.TestmasterserviceService.create(this.MasterCategoryModel).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode === 200) {
        if (this.isEdit)
          this.notifier.notify("success", "CategoryMaster service has been updated successfully.");
        else
          this.notifier.notify("success", response.message);
        this.closeDialog("Save");
      } else {
        this.notifier.notify("error", response.message);
      }
    });
  }

  get formControls() {
    return this.CategoryMasterForm.controls;
  }
}
