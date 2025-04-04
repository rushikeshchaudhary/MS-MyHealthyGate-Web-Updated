import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { ClientsService } from "../../clients.service";
import { CommonService } from "../../../../core/services";
import { ResponseModel } from "../../../../core/modals/common-model";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-add-document",
  templateUrl: "./add-document.component.html",
  styleUrls: ["./add-document.component.css"],
})
export class AddDocumentComponent implements OnInit {
  userId: number | null = null;
  masterDocumentTypes: any = [];
  filtermasterDocumentTypes: any = [];
  filterString:any;
  filterStringId:any;
  addDocumentForm!: FormGroup;
  fileList: any = [];
  dataURL: any;
  submitted: boolean = false;
  todayDate = new Date();
  constructor(
    private dialogModalRef: MatDialogRef<AddDocumentComponent>,
    private clientService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.userId = this.data;
  }

  ngOnInit() {
    this.addDocumentForm = this.formBuilder.group({
      documentType: [],
      expirationDate: [],
      title: [],
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

  handleImageChange(e:any) {
    //if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
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
    // }
    // else
    //   this.notifier.notify('error', "Please select valid file type");
  }
  removeFile(index: number) {
    this.fileList.splice(index, 1);
  }

  documentTypeHandler = (e:any) => {
    if (e !== "") {
      this.filtermasterDocumentTypes = this.masterDocumentTypes.filter(
        (doc:any) => doc.value.toLowerCase().indexOf(e) != -1
      );
    } else {
      this.filtermasterDocumentTypes = [];
    }
  };
  onSelFunc(data:any) {
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
          documentTypeId: null,
          documentTypeIdStaff:
            this.filterStringId != null ? this.filterStringId : null,
          expiration: this.addDocumentForm.value.expirationDate,
          key: "STAFF",
          otherDocumentType:
            this.filterStringId != null ? null : this.filterString,
          patientAppointmentId: null,
          userId: this.userId,
        };
        let dic:any = [];
        formValues.base64.forEach((element:any, index:any) => {
          dic.push(
            `"${element.data.replace(
              /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/,
              ""
            )}": "${element.ext}"`
          );
        });
        let newObj = dic.reduce((acc:any, cur:any, index:any) => {
          acc[index] = cur;
          return acc;
        }, {});
        formValues.base64 = newObj;
        this.submitted = true;
        this.clientService
          .uploadUserDocuments(formValues)
          .subscribe((response: ResponseModel) => {
            this.submitted = false;
            if (response != null && response.statusCode == 200) {
              this.notifier.notify("success", response.message);
              this.closeDialog("save");
            } else this.notifier.notify("error", response.message);
          });
      } else this.notifier.notify("error", "Please add atleast one file");
    }
  }
}
