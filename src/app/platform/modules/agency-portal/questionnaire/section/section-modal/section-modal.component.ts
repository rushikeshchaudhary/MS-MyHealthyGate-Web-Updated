import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { SectionModel } from '../../documents/document.model';
import { DocumentService } from '../../documents/document.service';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-section-modal',
  templateUrl: './section-modal.component.html',
  styleUrls: ['./section-modal.component.css']
})
export class SectionModalComponent implements OnInit {
  sectionModel: SectionModel;
  sectionForm!: FormGroup;
  documentId: number;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private sectionDialogModalRef: MatDialogRef<SectionModalComponent>,
    private sectionService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate:TranslateService,
    private notifier: NotifierService) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.sectionModel = data.sectionModel;
    this.documentId = data.documentId;
  }

  ngOnInit() {
    this.sectionForm = this.formBuilder.group({
      id: [this.sectionModel.id],
      sectionName: new FormControl(this.sectionModel.sectionName, {
        validators: [Validators.required],
        asyncValidators: [this.validateSectionName.bind(this)],
        updateOn: 'blur'
      }),
      displayOrder: [this.sectionModel.displayOrder]
    });
  }
  get formControls() { return this.sectionForm.controls; }
  onSubmit() {
    if (!this.sectionForm.invalid) {
      this.submitted = true;
      this.sectionModel = this.sectionForm.value;
      this.sectionModel.documentId = this.documentId;
      this.sectionService.saveSection(this.sectionModel).subscribe((response: any) => {
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
    this.sectionDialogModalRef.close(action);
  }

  validateSectionName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "sectionName",
        "tableName": "QUESTIONNAIRE_SECTIONNAME",
        "value": ctrl.value,
        "colmnName": "SECTIONNAME",
        "id": this.sectionModel.id,
      }
      if (!ctrl.dirty) {
       resolve(null);;
      } else
        this.sectionService.validate(postData)
          .subscribe((response: any) => {
            if (response.statusCode !== 202)
              resolve({ uniqueName: true })
            else
             resolve(null);;
          })
    })
  }
}
