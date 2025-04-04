import {
  Component,
  ElementRef,
  Inject,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { ClientsService } from "../../client-portal/clients-details/clients.service";
import { ResponseModel } from "../../core/modals/common-model";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-lab-test-download-patient",
  templateUrl: "./lab-test-download-patient.component.html",
  styleUrls: ["./lab-test-download-patient.component.css"],
})
export class LabTestDownloadPatientComponent implements OnInit {
  testList: Array<{
    TestName: string;
    TestId: number;
    labReferralId: number;
    LabReferralTestId: number;
    
  }> = [];
  testIds: Array<number> = [];

  @ViewChild("fileInput") fileInput!: ElementRef;
  testNames: Array<string> = [];
  selectedLabReferral: any;
  labReferralTestMappings: Array<number> = [];
  isReadytoDownload: boolean = false;
  testResultDocument: any[] = [];
  fileList: Array<any> = [];
  fieldName: any;
  constructor(
    private notifier: NotifierService,
    private dialogModalRef: MatDialogRef<LabTestDownloadPatientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientService: ClientsService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    console.log(this.data);

    this.selectedLabReferral = this.data;
    this.testNames = this.data.testName.split("|");
    this.testIds = this.data.testIds
      ? this.data.testIds.split("|")
      : this.data.testIDs.split("|");
    // this.labReferralTestMappings = this.data.labReferralTestMappingId.split(',');
  }

  ngOnInit() {
    this.getLabResult();
  }
  downloadFile(event: any, fileName: any) {
    this.clientService.downloadLabFile(event).subscribe((response: any) => {
      this.clientService.downloadFile(response, response.type, fileName);
    });
  }
  closeDialog(action: string) {
    this.dialogModalRef.close(action);
  }
  // handleImageChange(e, labReferralId) {
  //   let files = e.target.files;
  //   if (files) {
  //     for (let file of files) {
  //       let reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         this.fileList.push({
  //           // testId: testId,
  //           labReferralId: labReferralId,
  //           data: e.target.result,
  //           ext: file.name.split(".").pop().toLowerCase(),
  //           fileName: file.name,
  //         });
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }
  uploadDoc_Url = (field:any) => {
    this.fieldName = field;
  };

  handleImageChange(e: { target: { files: any; } | any; }, labReferralId: any) {
    let file_data = e.target.files;
    if (file_data.length > 0) {
      // Define a function to read each file asynchronously
      const readFile = (file: any) => {
        return new Promise((resolve, reject) => {
          let fileExtension = file.name.split(".").pop().toLowerCase();
          let reader = new FileReader();
          reader.onload = () => {
            resolve({
            //  testId: testId,
              labReferralId: labReferralId,
              data: reader.result,
              ext: file.name.split(".").pop().toLowerCase(),
              fileName: file.name,
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
    // let fileExtension = e.target.files[0].name.split(".").pop().toLowerCase();
    // var input = e.target;
    // var reader = new FileReader();
    // reader.onload = () => {
    //   this.dataURL = reader.result;
    //   console.log("befor push", this.fileList);
    //   this.fileList.push({
    //     testId: testId,
    //     labReferralId: labReferralId,
    //     data: this.dataURL,
    //     ext: fileExtension,
    //     fileName: e.target.files[0].name,
    //   });
    //   console.log("after push", this.fileList);
    // };
    // reader.readAsDataURL(input.files[0]);
  }
  getLabResult = () => {
    this.clientService
      .GetAllLabReferralResultDocByReverralId(
        this.data.labReferralID == undefined
          ? this.data.labReferralId
          : this.data.labReferralID
      )
      .subscribe((res: any) => {
        if (res.statusCode == 404) {
          this.testResultDocument.length = 0;
        } else {
          this.testResultDocument = res.data;
        }
      });
  };
  deleteLabFile = (index:any) => {
    this.fileList.splice(index, 1);
    if (this.fileList.length == 0) {
      this.fileInput.nativeElement.value = null;
    }
  };
  onSubmit() {
    if (this.fileList.length > 0) {
      this.clientService
        .updateLabReferral(this.fileList)
        .subscribe((response: any) => {
          if (response.statusCode == 200) {
            this.fileList.length = 0;
            this.notifier.notify("success", response.message);
            this.getLabResult();

            // this.closeDialog("close");
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }

  viewDocument = (event: any, fileName: any) => {
    // window.open(act.data.url, '_blank')
    // this.clientService.getLabReferralPdfById(act.id).subscribe((response: any) => {
      this.clientService.downloadLabFile(event).subscribe((response: any) => {
     //  this.clientService.downloadFile(response, response.type, fileName);

       var newBlob = new Blob([response], { type: response.type });
      
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
      });   
    //});
  };
}
