import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NotifierService } from 'angular-notifier';
import { TemplateModel } from '../template/template.model';
//import { SignaturePad } from 'angular2-signaturepad/signature-pad';
//import { SignaturePad } from 'angular2-signaturepad';
import { SignaturePad } from '@vijhhh2/ngx-signaturepad';
import { ClientsService } from '../../client-portal/clients.service';
import { CommonService } from '../../core/services';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-add-template-modal',
  templateUrl: './add-template-modal.component.html',
  styleUrls: ['./add-template-modal.component.css']
})
export class AddTemplateModalComponent implements OnInit {
  @ViewChild(SignaturePad)
  signaturePad!: SignaturePad;
  private templateModel: TemplateModel
  templateForm!: FormGroup;
  htmlContent: any;
  editorConfig: AngularEditorConfig;
  staffDetails: any;
  signDataUrl!: string;
  submitted: boolean = false;
  templateId: number = 0;
  staffID: number = 0;
  logodataURL: any;
  stampdataURL: any;
  logoImagePreview: any;
  stampImagePreview: any;

  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'dotSize': parseFloat('0.1'),
    'minWidth': 5,
    'canvasWidth': 600,
    'canvasHeight': 300
  };

  constructor(
    private notifier: NotifierService,
    private dialogModalRef: MatDialogRef<AddTemplateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private clientService: ClientsService,
    private commonService: CommonService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.templateModel = data.template;
    this.templateId = data.template.id;
    this.staffID = data.template.staffID;
    this.editorConfig = {
      editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '10rem',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: 'auto',
      translate: 'no',
      enableToolbar: false,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        { class: 'arial', name: 'Arial' },
        { class: 'times-new-roman', name: 'Times New Roman' },
        { class: 'calibri', name: 'Calibri' },
        { class: 'comic-sans-ms', name: 'Comic Sans MS' }
      ],
      customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ],
      //sanitize: true,
      //toolbarPosition: 'top',
      // toolbarHiddenButtons: [
      //   [
      //   ],
      //   [
      //     'customClasses',
      //     'link',
      //     'unlink',
      //     'insertImage',
      //     'insertVideo',
      //     'toggleEditorMode'
      //   ]
      // ]
    };
    this.staffDetails = null;
  }

  ngOnInit() {
    this.htmlContent = this.templateModel.htmlContent;
    this.templateForm = this.formBuilder.group({
      title: [this.templateModel.title, Validators.required],
      name: [this.templateModel.name, Validators.required],
      date: [this.templateModel.date, Validators.required],
      logo: [],
      stamp: [],
    });
  }

  closeDialog(action: string) {
    this.dialogModalRef.close(action);
  }

  onSubmit():any {
    this.signDataUrl = this.signaturePad.toDataURL();
    if (this.htmlContent === '' || this.htmlContent === undefined) {
      this.notifier.notify("error", "Notes is empty.");
      return;
    } else if (!this.signDataUrl || this.signDataUrl === 'data:,') {
      this.notifier.notify("error", "Sign is empty.");
      return;
    }

    if (this.templateForm.invalid) {
      return this.templateForm;
    } else {
      this.submitted = true;
      this.templateModel = this.templateForm.value;      
      this.templateModel.id = this.templateId;
      this.templateModel.staffID = this.staffID;      
      this.templateModel.htmlContent = this.htmlContent;
      this.templateModel.signature = (this.signDataUrl || "").split(",")[1];   
      this.templateModel.logoBase64 = this.logodataURL;
      this.templateModel.stampBase64 = this.stampdataURL;

      this.clientService.createTemplate(this.templateModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
            this.closeDialog('save');
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
    return
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
     console.log("called",this.signaturePad.toDataURL());
    this.signDataUrl = this.signaturePad.toDataURL();
  }

  onClear() {
    this.signaturePad.clear();
    this.signDataUrl = "";
  }

  // sign pad
  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  get formControls() {
    return this.templateForm.controls;
  }

  handleLogoImageChange(e:any) {
    if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        this.logodataURL = reader.result;
        this.logoImagePreview = this.logodataURL;
      };
      reader.readAsDataURL(input.files[0]);
    } else this.notifier.notify("error", "Please select valid file type");
  }

  handleStampImageChange(e:any) {
    if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        this.stampdataURL = reader.result;
        this.stampImagePreview = this.stampdataURL;
      };
      reader.readAsDataURL(input.files[0]);
    } else this.notifier.notify("error", "Please select valid file type");
  }

  removeLogoImage() {
    this.logodataURL = null;
    this.logoImagePreview = null;
  }

  removeStampImage() {
    this.stampdataURL = null;
    this.stampImagePreview = null;
  }
}
