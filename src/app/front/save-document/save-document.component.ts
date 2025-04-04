import { Component, OnInit, Inject, Input } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';

import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { UsersService } from 'src/app/platform/modules/agency-portal/users/users.service';
import { CommonService } from 'src/app/platform/modules/core/services/common.service';
import { ResponseModel } from 'src/app/platform/modules/core/modals/common-model';


@Component({
  selector: 'app-save-document',
  templateUrl: './save-document.component.html',
  styleUrls: ['./save-document.component.css']
})
export class SaveDocumentComponent implements OnInit {
  userId: number ;
  masterDocumentTypes: any = []
  filtermasterDocumentTypes: any = [];
  filterString:any;
  filterStringId:any;
  addDocumentForm!: FormGroup;
  fileList: any = [];
  dataURL: any;
  submitted: boolean = false;
  todayDate = new Date();
  constructor(private dialogModalRef: MatDialogRef<SaveDocumentComponent>,
    private userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService, private formBuilder: FormBuilder, private commonService: CommonService) {
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

  closeDialog(action:any): void {
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

  documentTypeHandler = (e:any) => {
    if (e !== "") {
      this.filtermasterDocumentTypes = this.masterDocumentTypes.filter((doc: { value: string; }) => doc.value.toLowerCase().indexOf(e) != -1);
    }
    else {
      this.filtermasterDocumentTypes = [];
    }

  }
  onSelFunc(data: { type: any; id: any; }) {
    this.filterString = data.type;
    this.filterStringId = data.id;


  }


  onSubmit() {

    ///Please chnage this API to avoid loops
    if (!this.addDocumentForm.invalid) {
      if (this.fileList.length > 0) {
        let formValues:any = {
          base64: this.fileList,
          documentTitle: this.addDocumentForm.value.title,
          documentTypeId:this.filterStringId!=null?this.filterStringId:null,
          expiration: this.addDocumentForm.value.expirationDate,
          documentTypeIdStaff:null,
          otherDocumentType:this.filterStringId!=null?null:this.filterString,
          key: "PATIENT",
          userId: this.userId,
          patientAppointmentId:null
        }
        this.closeDialog(formValues);
        // let dic = [];
        // formValues.base64.forEach((element, index) => {
        //   dic.push(`"${element.data.replace(/^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/, '')}": "${element.ext}"`);
        // });
        // let newObj = dic.reduce((acc, cur, index) => {
        //   acc[index] = cur;
        //   return acc;
        // }, {})
        // formValues.base64 = newObj;
        // this.submitted = true;
        // this.userService.uploadUserDocuments(formValues).subscribe((response: ResponseModel) => {
        //   this.submitted = false;
        //   if (response != null && response.statusCode == 200) {
        //     this.notifier.notify('success', response.message);
        //     this.closeDialog("save");
        //   }
        //   else this.notifier.notify('error', response.message);
        // });
      }
      else this.notifier.notify('error', "Please add atleast one file");
    }
  }
}
