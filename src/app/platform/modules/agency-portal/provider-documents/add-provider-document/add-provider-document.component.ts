import { Component, OnInit, Inject, Input } from '@angular/core';
//import { UsersService } from '../../users.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
//import { ResponseModel } from '../../../../core/modals/common-model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../../core/services/common.service';
import { ResponseModel } from '../../../core/modals/common-model';
import { UsersService } from '../../users/users.service';
//import { CommonService } from '../../../../core/services';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-add-provider-document',
  templateUrl: './add-provider-document.component.html',
  styleUrls: ['./add-provider-document.component.css']
})
export class AddProviderDocumentComponent implements OnInit {
  userId: number;
  masterDocumentTypes: any = []
  addDocumentForm!: FormGroup;
  fileList: any = [];
  dataURL: any;
  submitted: boolean = false;
  todayDate = new Date();
  constructor(private dialogModalRef: MatDialogRef<AddProviderDocumentComponent>,
    private userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate:TranslateService,
    private notifier: NotifierService, private formBuilder: FormBuilder, private commonService: CommonService) {
      translate.setDefaultLang( localStorage.getItem("language") || "en");
      translate.use(localStorage.getItem("language") || "en");
      this.userId = this.data;
  }

  ngOnInit() {
    this.addDocumentForm = this.formBuilder.group({
      documentType: [],
      expirationDate: [],
      title: []
    });
    this.getMasterData();
  }
  get formControls() {
    return this.addDocumentForm.controls;
  }

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  getMasterData() {
    this.userService.getMasterData("MASTERDOCUMENTTYPESSTAFF").subscribe((response: any) => {
      if (response != null)
        this.masterDocumentTypes = response.masterDocumentTypesStaff = response.masterDocumentTypesStaff != null ? response.masterDocumentTypesStaff : [];
    });
  }

  handleImageChange(e:any) {
    //if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
    let fileExtension = e.target.files[0].name.split('.').pop().toLowerCase();
    var input = e.target;
    var reader = new FileReader();
    reader.onload = () => {
      this.dataURL = reader.result;
      this.fileList.push({
        data: this.dataURL,
        ext: fileExtension,
        fileName: e.target.files[0].name
      });
    };
    reader.readAsDataURL(input.files[0]);
    // }
    // else
    //   this.notifier.notify('error', "Please select valid file type");
  }
  removeFile(index: number) {
    this.fileList.splice(index, 1);
  }
  onSubmit() {
   
    ///Please chnage this API to avoid loops
    if (!this.addDocumentForm.invalid) {
      if (this.fileList.length > 0) {
        let formValues = {
          base64: this.fileList,
          documentTitle: this.addDocumentForm.value.title,
          documentTypeIdStaff: 15,
          expiration: this.addDocumentForm.value.expirationDate,
          key: "STAFF",
          otherDocumentType: "",
          userId: this.userId,
          isProviderEducationalDocument:true
        }
        let dic: any[] = [];
        formValues.base64.forEach((element: { data: string; ext: any; }, index: any) => {
          dic.push(`"${element.data.replace(/^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/, '')}": "${element.ext}"`);
        });
        let newObj = dic.reduce((acc, cur, index) => {
          acc[index] = cur;
          return acc;
        }, {})
        formValues.base64 = newObj;
        this.submitted = true;
        //////debugger;
        this.userService.uploadProviderEducationalDocuments(formValues).subscribe((response: ResponseModel) => {
          this.submitted = false;
          if (response != null && response.statusCode == 200) {
            this.notifier.notify('success', response.message);
            this.closeDialog("save");
          }
          else this.notifier.notify('error', response.message);
        });
      }
      else this.notifier.notify('error', "Please add atleast one file");
    }
  }
}
