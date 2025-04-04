import { Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterCategoryModel } from '../catogery-master/category-model';
import { CategoryMasterServiceService } from '../catogery-master/category-master-service.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-create-category-master-data',
  templateUrl: './create-category-master-data.component.html',
  styleUrls: ['./create-category-master-data.component.css']
})
export class CreateCategoryMasterDataComponent implements OnInit {
  submitted: boolean = false;
  CategoryMasterForm!: FormGroup;
  MasterCategoryModel: MasterCategoryModel;
  headerText: string = 'Add Category-Master';
  isEdit: boolean = false;
  constructor(private serviceDialogModalRef: MatDialogRef<CreateCategoryMasterDataComponent>,private formBuilder: FormBuilder, private CategoryMasterService:CategoryMasterServiceService,private notifier: NotifierService,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.MasterCategoryModel=data;
    if ((this.MasterCategoryModel.id as number) >0){
      this.headerText = 'Edit CareCategory-Master';
      this.isEdit = true;
    }
    else
      this.headerText = 'Add Category-Master';
  }

  ngOnInit() {
    this.CategoryMasterForm = this.formBuilder.group({
      Id:[this.MasterCategoryModel.id],
      CareCategoryName: new FormControl(this.MasterCategoryModel.careCategoryName, {
        validators: [Validators.required],
       // asyncValidators: [this.validateService.bind(this)],
        updateOn: "blur"
      }),

       });
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

    this.CategoryMasterService.create(this.MasterCategoryModel).subscribe((response: any) => {
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
    return this.CategoryMasterForm.controls;''
  }
}
