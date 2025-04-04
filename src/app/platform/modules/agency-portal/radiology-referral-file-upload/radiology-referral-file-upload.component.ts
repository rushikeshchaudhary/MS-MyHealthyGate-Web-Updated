import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { environment } from "src/environments/environment";
import { ResponseModel } from "../../core/modals/common-model";
import { ClientsService } from "../../client-portal/clients.service";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { switchMap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { PatientRadioData } from "src/app/shared/models/sidebarInfo";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-radiology-referral-file-upload",
  templateUrl: "./radiology-referral-file-upload.component.html",
  styleUrls: ["./radiology-referral-file-upload.component.css"],
})
export class RadiologyReferralFileUploadComponent implements OnInit {
  testResultDocument: any[] = [];
  @ViewChild("fileInput") fileInput!: ElementRef;
  testNames: Array<string> = [];
  testIds: Array<number> = [];
  selectedLabReferral: any;
  testList: Array<{ TestName: string; TestId: number; labReferralId: number }> =
    [];
  fileList: Array<any> = [];

  fileListDicom: Array<any> = [];
  existingFilesListDicom: any[] = [];
  dataURL: any;

  form: FormGroup;
  savedURLs: string[] = [];
  fieldName: any;

  //patientRadiologyDocumentUrlList: any[] = [];
  //patientResultRadiologyDicomDocumentList: any[] = [];
  //radilogyDocRes: any[] = [];
  allData?: PatientRadioData;

  constructor(
    private dialogModalRef: MatDialogRef<RadiologyReferralFileUploadComponent>,
    private notifier: NotifierService,
    private clientService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private fb: FormBuilder,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    console.log(this.data);
    this.selectedLabReferral = this.data;
    this.testNames = this.data.testName.split("|");
    this.testIds = this.data.testIds.split("|");
    this.form = this.fb.group({
      inputsUrlArray: this.fb.array([]),
    });
  }

  ngOnInit() {
    for (let i = 0; i < this.testIds.length; i++) {
      this.testList.push({
        labReferralId: this.selectedLabReferral.labReferralId,
        TestName: this.testNames[i],
        TestId: this.testIds[i],
      });
      console.log(this.testList);
    }

    //this.getLabResult();
    // this.getUploadedDicomFiles();
    this.getUploadedRadiologyUrl();
    this.addInput();
  }

  get formControls() {
    return this.form.value;
  }

  get inputArray():FormArray{
    return this.form.get("inputsUrlArray") as FormArray;
  }

  //RadiologyURL
  addInput() {
    this.inputArray.push(
      this.fb.group({
        url: "",
      })
    );
  }
  removeInput(index: number) {
    this.inputArray.removeAt(index);
  }

  saveURLs = (urls: any[]) => {
    const data = {
      labReferralId: this.data.labReferralId,
      documentUrl: urls,
    };
    this.clientService.uploadRadiologyUrl(data).subscribe((response) => {
      if (response && response.statusCode == 200) {
        while (this.inputArray.value.length !== 0) {
          this.inputArray.removeAt(0);
        }
        this.fieldName = "";
        this.getUploadedRadiologyUrl();
        this.notifier.notify("success", response.message);
      } else {
        this.notifier.notify("error", response.message);
      }
    });
  };

  getUploadedRadiologyUrl() {
    this.clientService
      .getUploadedRadiologyUrl(this.data.labReferralId)
      .subscribe((response) => {
        if (response.data) {
          this.allData = response.data;
          console.log(this.allData);
        }
      });
  }

  closeDialog(action: string) {
    this.dialogModalRef.close(action);
  }

  uploadDoc_Url = (field: any) => {
    this.fieldName = field;
  };

  openUrlInNewWindow(url: string) {
    window.open(url, "_blank");
  }

  handleImageChange(e:any, labReferralId: any) {
    let file_data = e.target.files;
    if (file_data.length > 0) {
      // Define a function to read each file asynchronously
      const readFile = (file: any) => {
        return new Promise((resolve, reject) => {
          let fileExtension = file.name.split(".").pop().toLowerCase();
          let reader = new FileReader();
          reader.onload = () => {
            resolve({
              // data: reader.result,
              ext: fileExtension,
              fileName: file.name,
              // testId: testId,
              labReferralId: labReferralId,
              data: reader.result,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      // Use Promise.all to wait for all files to be processed
      Promise.all(Array.from(file_data).map((file) => readFile(file)))
        .then((fileList) => {
          // Add processed files to this.fileList
          this.fileList.push(...fileList);
        })
        .catch((error) => {
          console.error("Error reading files:", error);
        });
    }
  }

  deleteFile = (index: number) => {
    this.fileList.splice(index, 1);
    if (this.fileList.length == 0) {
      this.fileInput.nativeElement.value = null;
    }
  };

  deleteFileDicom = (index: number) => {
    let tempFileName = Array.from(this.fileListDicom);
    console.log("Before Files", this.fileListDicom);
    tempFileName.splice(index, 1);

    this.fileListDicom = tempFileName;
    console.log("After Files", this.fileListDicom);
  };

  getUploadedDicomFiles() {
    this.clientService
      .getUploadedDicomFiles(this.data.labReferralId)
      .subscribe((filename) => {
        this.existingFilesListDicom = filename.data;
        console.log("Uploaded dicom files", this.existingFilesListDicom);
      });
  }

  openDicomViewer(file: any) {
    this.clientService.getUrlForViewer(file.id).subscribe(
      (response: any) => {
        window.open(response.message, "_blank");
      },
      (error) => {
        console.error("Failed to retrieve DICOM viewer URL:", error);
      }
    );
  }

  handleImageChangeDicom(event: any) {
    // this.fileListDicom = event.target.files;
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      this.fileListDicom = [];
      for (let i = 0; i < files.length; i++) {
        this.fileListDicom.push(files[i]);
      }
    }
    console.log("Files selected:", this.fileListDicom);
  }

  onSubmitDicom() {
    var command: any = {
      LabReferralId: this.data.labReferralId,
      // TrainingContantPath: this.dataURL,
      // state: 'add'
    };
    var formData = new FormData();
    for (let i = 0; i < this.fileListDicom.length; i++) {
      formData.append(`file${i}`, this.fileListDicom[i]);
    }
    formData.append('labReferal', JSON.stringify(command));

    this.clientService
      .uploadDicomfile(formData)
      .subscribe(
        (response) => {
          console.log("Files uploaded successfully");
          let tempFileName = Array.from(this.fileListDicom);
          tempFileName.length = 0;
          this.fileListDicom = tempFileName;
          this.getUploadedRadiologyUrl();
          this.notifier.notify("success", response.message);
        },
        (error) => {
          this.notifier.notify("error", error.message);
          console.error("Error uploading files:", error);
        }
      );
  }

  async onSubmit() {
    const urls = this.inputArray.controls
      .map((control) => control.value.url)
      .filter((url) => url);
    const documents = this.fileList;

    if (documents.length > 0) {
      this.clientService
        .updateLabReferral(documents)
        .subscribe((response: ResponseModel) => {
          if (response.statusCode == 200) {
            this.fileList.length = 0;
            this.fieldName = "";
            this.notifier.notify("success", response.message);
            this.getUploadedRadiologyUrl();
            if (urls.length > 0) {
              this.saveURLs(urls);
            }
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    } else if (urls.length > 0) {
      this.saveURLs(urls);
    } else {
      this.notifier.notify("error", "Both document and URL cannot be empty.");
    }
  }

  getLabResult = () => {
    this.clientService
      .GetAllLabReferralResultDocByReverralId(this.data.labReferralId)
      .subscribe((res: any) => {
        this.testResultDocument = res.data ? res.data : [];
      });
  };

  downloadFile(event: any, fileName: string) {
    this.clientService.downloadLabFile(event).subscribe((response: any) => {
      this.clientService.downloadFile(response, response.type, fileName);
    });
  }

  viewDocument = (act:any) => {
    if (act) {
      let byteChar = atob(act.base64);
      let byteArray = new Array(byteChar.length);
      for (let i = 0; i < byteChar.length; i++) {
        byteArray[i] = byteChar.charCodeAt(i);
      }

      let uIntArray = new Uint8Array(byteArray);
      let newBlob = new Blob([uIntArray], { type: "application/pdf" });
      const nav = window.navigator as any;
      if (nav && nav.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(newBlob);
        return;
      }
      const data = window.URL.createObjectURL(newBlob);
      var link = document.createElement("a");
      document.body.appendChild(link);
      link.href = data;
      link.target = "_blank";
      link.click();

      setTimeout(function () {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(data);
      }, 100);
    }
  };
}
