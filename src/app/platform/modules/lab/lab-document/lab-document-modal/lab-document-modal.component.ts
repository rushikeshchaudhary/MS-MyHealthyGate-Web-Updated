import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { ClientsService } from "../../../agency-portal/clients/clients.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-lab-document-modal",
  templateUrl: "./lab-document-modal.component.html",
  styleUrls: ["./lab-document-modal.component.css"],
})
export class LabDocumentModalComponent implements OnInit {
  userId: number;
  masterDocumentTypes: any = [];
  filtermasterDocumentTypes: any = [];
  filterString: any;
  filterStringId: any;
  addDocumentForm!: FormGroup;
  fileList: any = [];
  dataURL: any;
  submitted: boolean = false;
  todayDate = new Date();
  filterPatient: any;
  patientName:any;
  allPatientList: any = [];
  filterPatientList: any = [];

  constructor(
    private dialogModalRef: MatDialogRef<LabDocumentModalComponent>,
    private clientService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private formBuilder: FormBuilder,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.userId = this.data;
  }

  ngOnInit() {
    this.addDocumentForm = this.formBuilder.group({
      PatientName: [],
      documentType: [],
      expirationDate: [],
      title: [],
    });
    this.getMasterData();
    this.getAllPatient();
  }

  get formControls() {
    return this.addDocumentForm.controls;
  }

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  getAllPatient = () => {
    this.clientService.getAllPatient().subscribe((res) => {
      this.allPatientList = res.data;
    });
  };

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
  patientFilterHandler = (e: any) => {
    if (e !== "") {
      this.filterPatientList = this.allPatientList.filter(
        (data: any) =>
          (data.firstName && data.firstName.toLowerCase().indexOf(e) != -1) ||
          (data.lastName && data.lastName.toLowerCase().indexOf(e) != -1)
      );
    } else {
      this.filterPatientList = [];
    }
  };
  patientChangeHandler = (patient: any) => {
    console.log(patient)
    this.filterPatient = patient;
  };

  handleImageChange(e: any) {
    let fileExtension = e.target.files[0].name.split(".").pop().toLowerCase();
    var input = e.target;
    var reader = new FileReader();
    reader.onload = () => {
      this.dataURL = reader.result;
      this.fileList.push({
        data: this.dataURL,
        ext: fileExtension,
        fileName: e.target.files[0].name,
      });
    };
    reader.readAsDataURL(input.files[0]);
  }

  removeFile(index: number) {
    this.fileList.splice(index, 1);
  }

  documentTypeHandler = (e: any) => {
    if (e !== "") {
      this.filtermasterDocumentTypes = this.masterDocumentTypes.filter(
        (doc: any) => doc.value.toLowerCase().indexOf(e) != -1
      );
    } else {
      this.filtermasterDocumentTypes = [];
    }
  };

  onSelFunc(data: any) {
    this.filterString = data.type;
    this.filterStringId = data.id;
  }
  onSubmit = () => {

    if (!this.addDocumentForm.invalid) {
      if (this.fileList.length > 0) {
        let formValues :any= {
          base64: this.fileList,
          documentTitle: this.addDocumentForm.value.title,
          documentTypeId:null,
          expiration: this.addDocumentForm.value.expirationDate,
          documentTypeIdStaff:this.filterStringId!=null?this.filterStringId:null,
          otherDocumentType:this.filterStringId!=null?null:this.filterString,
          key: "STAFF",
          userId: this.filterPatient.userId,
          patientAppointmentId:null

        };
        let dic: any[] = [];
        formValues.base64.forEach((element: { data: string; ext: any; }) => {
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
        console.log(formValues)
        this.clientService
          .uploadUserDocuments(formValues)
          .subscribe((response) => {
            this.submitted = false;
            if (response != null && response.statusCode == 200) {
              this.notifier.notify("success", response.message);
              this.closeDialog("save");
            } else this.notifier.notify("error", response.message);
          });
      } else this.notifier.notify("error", "Please add atleast one file");
    }
  };
}
