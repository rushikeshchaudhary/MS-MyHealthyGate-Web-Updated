import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";
import { CommonService } from "src/app/platform/modules/core/services";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";

@Component({
  selector: "app-document-modal",
  templateUrl: "./document-modal.component.html",
  styleUrls: ["./document-modal.component.css"],
})
export class DocumentModalComponent implements OnInit {
  userId: number;
  masterDocumentTypes: any = [];
  filtermasterDocumentTypes: any = [];
  filterString:any;
  formType = "add";
  editFormData;
  filterStringId:any;
  addDocumentForm!: FormGroup;
  fileList: any = [];
  dataURL: any;
  documentCategoryList: any[] = [];
  selectedCategory: any;
  submitted: boolean = false;
  todayDate = new Date();

  constructor(
    private dialogModalRef: MatDialogRef<DocumentModalComponent>,
    private clientService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) {
    console.log("My Care Library", this.data);
    this.userId = this.data.id;
    this.formType = this.data.type;
    this.editFormData = this.data.documentData;
  }

  ngOnInit() {
    this.getMasterData();
    this.addDocumentForm = this.formBuilder.group({
      documentType: [],
      documentTypeId: [],
      expirationDate: [],
      title: [],
    });
    this.getMasterData();
    if (this.formType == "edit") {
      this.setFormData();
    }
  }
  get formControls() {
    return this.addDocumentForm.controls;
  }

  setFormData = () => {
    this.addDocumentForm.patchValue({
      documentType: this.editFormData.documentTypeName
        ? this.editFormData.documentTypeName
        : this.editFormData.otherDocumentType,
      expirationDate: this.editFormData.expiration,
      title: this.editFormData.documentTitle,
    });
    this.filterString = this.editFormData.documentTypeName
      ? this.editFormData.documentTypeName
      : this.editFormData.otherDocumentType;
  };

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }

  handleImageChange(e:any) {
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
        (doc: { value: string; }) => doc.value.toLowerCase().indexOf(e) != -1
      );
    } else {
      this.filtermasterDocumentTypes = [];
    }
  };
  onSelFunc(data: { type: any; id: any; }) {
    this.filterString = data.type;
    this.filterStringId = data.id;
  }

  onCategorySelectionChange = (event: any) => {
    console.log(event);
  };

  getMasterData() {
    this.clientService
      .getMasterData("MASTERDOCUMENTTYPESSTAFF")
      .subscribe((response: any) => {
        if (response != null)
          this.documentCategoryList = response.masterDocumentTypesStaff =
            response.masterDocumentTypesStaff != null
              ? response.masterDocumentTypesStaff
              : [];
      });
  }

  onEditSubmit = () => {
    let formValues:any = {
      documentId: this.editFormData.id,
      documentTitle: this.addDocumentForm.value.title,
      documentTypeId: this.addDocumentForm.value.documentTypeId,
      expiration: this.addDocumentForm.value.expirationDate,
      documentTypeIdStaff: null,
      otherDocumentType: this.filterStringId != null ? null : this.filterString,
    };
    this.submitted = true;
    console.log(formValues);
    this.clientService
      .updateUserDocuments(formValues)
      .subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response != null && response.statusCode == 200) {
          this.notifier.notify("success", response.message);
          this.closeDialog("save");
        } else this.notifier.notify("error", response.message);
      });
  };
  onSubmit() {


    console.log(this.addDocumentForm);
    if (!this.addDocumentForm.invalid) {
      if (this.fileList.length > 0) {
        let formValues: any = {
          base64: this.fileList,
          documentTitle: this.addDocumentForm.value.title,
          documentTypeId: this.addDocumentForm.value.documentTypeId,
          expiration: this.addDocumentForm.value.expirationDate,
          documentTypeIdStaff: null,
          otherDocumentType:
            this.filterStringId != null ? null : this.filterString,
          key: "PATIENT",
          userId: this.userId,
          patientAppointmentId: null,
        };
        let dic: any[] = [];
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
        console.log(formValues);
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
