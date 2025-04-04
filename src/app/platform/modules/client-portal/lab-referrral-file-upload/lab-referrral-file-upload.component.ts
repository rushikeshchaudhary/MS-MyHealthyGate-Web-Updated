import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { ResponseModel } from "../../core/modals/common-model";
import { ClientsService } from "../clients.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-lab-referrral-file-upload",
  templateUrl: "./lab-referrral-file-upload.component.html",
  styleUrls: ["./lab-referrral-file-upload.component.css"],
})
export class LabReferrralFileUploadComponent implements OnInit {
  @ViewChild("fileInput") fileInput!: ElementRef;
  testNames: Array<string> = [];
  testIds: Array<number> = [];
  selectedLabReferral: any;
  testList: Array<{ TestName: string; TestId: number; labReferralId: number }> =
    [];
  fileList: Array<any> = [];
  dataURL: any;
  testResultDocument: any[] = [];
  constructor(
    private dialogModalRef: MatDialogRef<LabReferrralFileUploadComponent>,
    private notifier: NotifierService,
    private clientService: ClientsService,
    private translate:TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.selectedLabReferral = this.data;
    console.log(this.data);

    this.testNames = this.data.testName.split("|");
    this.testIds = this.data.testIds.split("|");
  }

  ngOnInit() {
    for (let i = 0; i < this.testNames.length; i++) {
      this.testList.push({
        labReferralId: this.selectedLabReferral.labReferralId,
        TestName: this.testNames[i],
        TestId: this.testIds[i],
      });

      console.log(this.testList);
    }

    this.getLabResult();
  }
  closeDialog(action: string) {
    this.dialogModalRef.close(action);
  }
  // handleImageChange(e: { target: { files: any; }; }, labReferralId: any) {
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

  handleImageChange(e: any, labReferralId: any) {
    let files = e.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.fileList.push({
            // testId: testId,
            labReferralId: labReferralId,
            data: e.target.result,
            ext: file.name.split(".").pop().toLowerCase(),
            fileName: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteLabFile = (index:any) => {
    this.fileList.splice(index, 1);
    if (this.fileList.length == 0) {
      this.fileInput.nativeElement.value = null;
    }
  };
  // handleImageChange(e) {
  //   this.fileList=[];
  //   console.log(e.target.files)
  //   let uploadedFiles = e.target.files
  //   for (let i = 0; i < uploadedFiles.length; i++) {
  //     let fileExtension = uploadedFiles[i].name.split(".").pop().toLowerCase();
  //     let reader = new FileReader();
  //     reader.onload = () => {
  //       this.dataURL = reader.result;
  //       console.log('befor push', this.fileList);
  //       this.fileList.push(
  //         {
  //           data: this.dataURL,
  //           ext: fileExtension,
  //           fileName: e.target.files[i].name
  //         });
  //       console.log('after push', this.fileList);
  //     }
  //     reader.readAsDataURL(uploadedFiles[i]);
  //   }
  // }

  onSubmit() {
    // let testIds=this.data.testIds;
    // if(testIds.includes(',')){
    //   testIds=testIds.split(',');
    //   testIds=testIds[0];
    // }
    // const fileData={
    //   labReferralId: this.data.labReferralId,
    //   testId: Number(testIds),
    //   reports: this.fileList,
    //   status: this.data.status,
    //   labId: this.data.labId,
    //   providerId: this.data.providerId,
    //   patientId: this.data.patientId
    // };

    if (this.fileList.length > 0) {
      this.clientService
        .updateLabReferral(this.fileList)
        .subscribe((response: ResponseModel) => {
          if (response.statusCode == 200) {
            this.fileList.length = 0;
            this.notifier.notify("success", response.message);
            this.getLabResult();
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }

  getLabResult = () => {
    this.clientService
      .GetAllLabReferralResultDocByReverralId(this.data.labReferralId)
      .subscribe((res: any) => {
        this.testResultDocument = res.data ? res.data : [];
      });
  };

  downloadFile(event: any, fileName: any) {
    this.clientService.downloadLabFile(event).subscribe((response: any) => {
      this.clientService.downloadFile(response, response.type, fileName);
    });
  }
  viewDocument = (event: any, fileName: any) => {
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
  };
}
