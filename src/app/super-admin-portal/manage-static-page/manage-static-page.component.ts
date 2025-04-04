import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NotifierService } from 'angular-notifier';
import { DynamicFilterModel, FilterModel, ResponseModel } from 'src/app/platform/modules/core/modals/common-model';
import { ManageStaticPageService } from './manage-static-page.service';

export class StaticPageModel {
  public id:number=0;
  public pageName: string="";
  public pageContent: string="";
  public isActive!: boolean;
}

@Component({
  selector: 'app-manage-static-page',
  templateUrl: './manage-static-page.component.html',
  styleUrls: ['./manage-static-page.component.css']
})
export class ManageStaticPageComponent implements OnInit {
  metaData:any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',

    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  }
  pageForm!: FormGroup;
  staticPageModel!: StaticPageModel;
  filterModel: DynamicFilterModel = new DynamicFilterModel();
  submitted: boolean = false;
  displayColumns: Array<any> = [
    { displayName: "Page Name", key: "pageName", width: "20%" },
    { displayName: "Status", key: "isActive", width: "20%" },
    { displayName: "Actions", key: "Actions", width: "20%" }
  ];
  actionButtons: Array<any> = [
    { displayName: "Edit", key: "edit", class: "fa fa-pencil" }
  ];
  allPages: Array<StaticPageModel> = [];
  constructor(private formBuilder: FormBuilder, private staticPageService: ManageStaticPageService,
    private notifier: NotifierService) {
    if (this.staticPageModel == null) this.staticPageModel = new StaticPageModel();
  }

  ngOnInit() {

    this.pageForm = this.formBuilder.group({
      pageName: [this.staticPageModel.pageName],
      pageContent: [this.staticPageModel.pageContent],
      isActive: [this.staticPageModel.isActive],
      id:0
    });
    this.getAllStaticPages();
  }
  get f() {
    return this.pageForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.pageForm.invalid) {
      return;
    }
    // console.log(this.pageForm.value);

    this.staticPageService.createOrUpdatePage(this.pageForm.value)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          this.pageForm.reset();
          this.getAllStaticPages();
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }
  getAllStaticPages() {
    this.filterModel.pageSize = 10;
    this.filterModel.isActiveRequired = true;
    this.staticPageService.getAllPages(this.filterModel).subscribe(res => {
      this.allPages = [];
      if (res != null && res.statusCode == 200) {
        this.allPages = res.data;
      }
    });
  }
  updatePage(id:any) {
console.log('id',id);
  }
  onTableActionClick(actionObj?: any) {
    const data = actionObj.data ;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        //this.updat  ePage(id);
        this.pageForm = this.formBuilder.group({
          pageName: [data.pageName],
          pageContent: [data.pageContent],
          isActive: [data.isActive],
          id:data.id
        });
        break;
      default:
        break;
    }
  }
}
