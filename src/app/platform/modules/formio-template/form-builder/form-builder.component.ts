import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormioOptions } from '@formio/angular';
import { TemplateService } from '../template.service';
import { CommonService } from '../../core/services';
import { NotifierService } from 'angular-notifier';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit {
  public form: any = { components: [] };
  templateFormId: number | null = null;
  templateName: string = '';
  templateCategoryId!: number;
  templateSubCategoryId!: number;
  masterTemplateCategory: any[] = [];
  masterTemplateSubCategory: any[] = [];
  formioOptions: FormioOptions = { disableAlerts: true };
  submitted = false;
  UserRole!: string;

  constructor(
    private templateService: TemplateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(DOCUMENT) private _document: any,
    private commonService: CommonService,
    private notifierService: NotifierService,
    private translate: TranslateService
  ) {
    const lang = localStorage.getItem('language') || 'en';
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.activatedRoute.queryParams.subscribe(params => {
      this.templateFormId = params['id']
        ? parseInt(this.commonService.encryptValue(params['id'], false))
        : null;
    });
  }

  ngOnInit(): void {
    if (this.templateFormId) {
      this.loadTemplateForm();
    }
    this.getMasterTemplateCategoryData();
    this.UserRole = localStorage.getItem('UserRole')!;
  }

  loadTemplateForm(): void {
    this.templateService.getTemplateForm(this.templateFormId!).subscribe(response => {
      if (response.statusCode === 200) {
        this.form = JSON.parse(response.data.templateJson || '{}');
        this.templateName = response.data.templateName;
        this.templateCategoryId = response.data.templateCategoryId;
        this.templateSubCategoryId = response.data.templateSubCategoryId;
        if (this.templateSubCategoryId > 0) {
          this.getMasterTemplateSubCategoryData(this.templateCategoryId);
        }
      }
    });
  }

  // onChange(event: any): void {
  //   // Log form changes. You may add additional logic as needed.
  //   console.log('Form changed:', event);
    
  //   // Example: dynamically hide/show a component based on your custom logic.
  //   const cards = document.getElementsByClassName('formio-component-multiple');
  //   const boxes = document.getElementsByClassName('formio-component-selectboxes');
  //   const radio = document.getElementsByClassName('formio-component-radio2');
  //   if (cards.length && (boxes.length > 0 || radio.length > 0)) {
  //     cards[0].setAttribute('style', 'display:none!important;');
  //   } else if (cards.length) {
  //     cards[0].setAttribute('style', 'display:block!important;');
  //   }
  // }

  onChange = (event: any): void => {
    console.log('Form changed:', event);

    const cards = document.getElementsByClassName('formio-component-multiple');
    const boxes = document.getElementsByClassName('formio-component-selectboxes');
    const radio = document.getElementsByClassName('formio-component-radio2');
    if (cards.length && (boxes.length > 0 || radio.length > 0)) {
      cards[0].setAttribute('style', 'display:none!important;');
    } else if (cards.length) {
      cards[0].setAttribute('style', 'display:block!important;');
    }
  };

  saveTemplateForm(): void {
    if (!this.templateName || !this.templateName.trim()) {
      this.notifierService.notify('error', 'Please enter template name');
      return;
    }
    const jsonFormString = JSON.stringify(this.form);
    const postData = {
      id: this.templateFormId,
      templateName: this.templateName,
      templateJson: jsonFormString,
      templateCategoryId: this.templateCategoryId,
      templateSubCategoryId: this.templateSubCategoryId
    };
    this.submitted = true;
    this.templateService.saveTemplateForm(postData).subscribe(response => {
      this.submitted = false;
      if (response.statusCode === 200) {
        this.notifierService.notify('success', response.message);
        if (!this.templateFormId && response.data.id) {
          const encryptId = this.commonService.encryptValue(response.data.id, true);
          if (this.UserRole === 'ADMIN') {
            this.router.navigate(['/webadmin/Masters/template/builder'], { queryParams: { id: encryptId } });
          } else if (this.UserRole === 'PROVIDER') {
            this.router.navigate(['/web/Masters/template/builder'], { queryParams: { id: encryptId } });
          }
        }
      } else {
        this.notifierService.notify('error', response.message);
      }
    });
  }

  getMasterTemplateCategoryData(): void {
    this.templateService.getMasterCategoryTemplateForDD().subscribe((response: any) => {
      this.masterTemplateCategory = response.statusCode === 200 ? response.data : [];
    });
  }

  getMasterTemplateSubCategoryData(masterCategoryId: number): void {
    this.templateService.getMasterSubCategoryTemplateForDD(masterCategoryId).subscribe((response: any) => {
      this.masterTemplateSubCategory = response.statusCode === 200 ? response.data : [];
    });
  }

  onMasterCategorySelect(event: any): void {
    this.templateCategoryId = event.value;
    this.getMasterTemplateSubCategoryData(this.templateCategoryId);
  }
}
