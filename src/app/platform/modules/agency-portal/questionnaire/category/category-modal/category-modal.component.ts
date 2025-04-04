import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { CategoryModel } from '../../documents/document.model';
import { DocumentService } from '../../documents/document.service';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.css']
})
export class CategoryModalComponent implements OnInit {
  categoryModel: CategoryModel;
  categoryForm!: FormGroup;

  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private categoryDialogModalRef: MatDialogRef<CategoryModalComponent>,
    private categoryService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate:TranslateService,
    private notifier: NotifierService) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.categoryModel = data;
  }

  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      id: [this.categoryModel.id],
      categoryName: new FormControl(this.categoryModel.categoryName, {
        validators: [Validators.required],
        asyncValidators: [this.validateCategoryName.bind(this)],
        updateOn: 'blur'
      }),
      description: [this.categoryModel.description]
    });
  }
  get formControls() { return this.categoryForm.controls; }
  onSubmit() {
    if (!this.categoryForm.invalid) {
      this.submitted = true;
      this.categoryModel = this.categoryForm.value;
      this.categoryService.saveCategory(this.categoryModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          this.closeDialog('save');
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }
  closeDialog(action: string): void {
    this.categoryDialogModalRef.close(action);
  }

  validateCategoryName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "categoryName",
        "tableName": "QUESTIONNAIRE_CATEGORYNAME",
        "value": ctrl.value,
        "colmnName": "CATEGORYNAME",
        "id": this.categoryModel.id,
      }
      if (!ctrl.dirty) {
       resolve(null);;
      } else
        this.categoryService.validate(postData)
          .subscribe((response: any) => {
            if (response.statusCode !== 202)
              resolve({ uniqueName: true })
            else
             resolve(null);;
          })
    })
  }
}
