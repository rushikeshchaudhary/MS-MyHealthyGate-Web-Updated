import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from "angular-notifier";
import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";
import { ResponseModel } from '../../../core/modals/common-model';
import { WaitingRoomService } from '../../waiting-room.service';


@Component({
  selector: 'app-patient-doc-modal',
  templateUrl: './patient-doc-modal.component.html',
  styleUrls: ['./patient-doc-modal.component.css']
})
export class PatientDocModalComponent implements OnInit {
  userId: number;
  masterDocumentTypes: any = [];
  filtermasterDocumentTypes: any = [];
  filterString:any;
  filterStringId:any;
  addDocumentForm!: FormGroup;
  fileList: any = [];
  dataURL: any;
  submitted: boolean = false;
  todayDate = new Date();
  

  constructor(private dialogModalRef: MatDialogRef<PatientDocModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private waitingRoomService: WaitingRoomService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private clientService: ClientsService,
  ) { this.userId = this.data.userId; }


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

  closeDialog(action:string): void {
    this.dialogModalRef.close(action);
  }

  getMasterData() {
    this.clientService
      .getMasterData("MASTERDOCUMENTTYPESSTAFF")
      .subscribe((response: any) => {
        if (response != null)
          this.masterDocumentTypes = response.masterDocumentTypesStaff =
            response.masterDocumentTypesStaff != null
              ? response.masterDocumentTypesStaff
              : [];
      });
  }

//old code 
  // handleImageChange(e: { target: { files: { name: any; }[]; }; }) {
  //   //if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
  //   let fileExtension = e.target.files[0].name
  //     .split(".")
  //     .pop()
  //     .toLowerCase();
  //   var input = e.target;
  //   var reader = new FileReader();
  //   reader.onload = () => {
  //     this.dataURL = reader.result;
  //     this.fileList.push({
  //       data: this.dataURL,
  //       ext: fileExtension,
  //       fileName: e.target.files[0].name
  //     });
  //   };
  //   reader.readAsDataURL(input.files[0]);
    
  //   // }
  //   // else
  //   //   this.notifier.notify('error', "Please select valid file type");
  // }

  //new code
  handleImageChange(e: Event) {
    const input = e.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      const reader = new FileReader();
      reader.onload = () => {
        this.dataURL = reader.result;
        this.fileList.push({
          data: this.dataURL,
          ext: fileExtension,
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Handle the case when no file is selected
      console.error('No file selected');
    }
  }

  removeFile(index: number) {
    this.fileList.splice(index, 1);
  }
  documentTypeHandler = (e: string) => {
    if (e !== "") {
      this.filtermasterDocumentTypes = this.masterDocumentTypes.filter((doc:any)=> doc.value.toLowerCase().indexOf(e) != -1);
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
          patientAppointmentId:this.data.appointmentId
        };
        let dic: any[] = []
        formValues.base64.forEach((element: { data: string; ext: any; }, index: any) => {
          dic.push(
            `"${element.data.replace(
              /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/,
              ""
            )}": "${element.ext}"`
          );
        });
        let newObj = dic.reduce((acc, cur, index) => {
          acc[index] = cur;
          return acc;
        }, {});
        formValues.base64 = newObj;
        this.submitted = true;

        this.waitingRoomService.uploadUserDocuments(formValues).subscribe((response: ResponseModel) => {
          if (response != null && response.statusCode == 200) {
            this.submitted = false;
            this.notifier.notify("success", response.message);
            this.closeDialog("save");
          }
          else this.notifier.notify('error', response.message);
        });
        this.fileList = [];
        console.log(formValues)
        // this.clientService
        //   .uploadUserDocuments(formValues)
        //   .subscribe((response: ResponseModel) => {
        //     this.submitted = false;
        //     if (response != null && response.statusCode == 200) {
        //       this.notifier.notify("success", response.message);
        //       this.closeDialog("save");
        //     } else this.notifier.notify("error", response.message);
        //   });
      } else(this.notifier.notify('error', "Please add atleast one file"));
    }
  }

}
