import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClientsService } from "../../client-portal/clients-details/clients.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-lab-test-download-modal",
  templateUrl: "./lab-test-download-modal.component.html",
  styleUrls: ["./lab-test-download-modal.component.css"],
})
export class LabTestDownloadModalComponent implements OnInit {
  selectedLabReferral: any;
  testIds: Array<number> = [];
  testNames: Array<string> = [];
  labReferralTestMappings: Array<number> = [];
  isReadytoDownload: boolean = false;
  testResultDocument: any[] = [];
  testList: Array<{
    LabReferralTestId: number;
    TestName: string;
    TestId: number;
    labReferralId: number;
  }> = [];
  constructor(
    private dialogModalRef: MatDialogRef<LabTestDownloadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientService: ClientsService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.selectedLabReferral = this.data;
    this.testNames = this.data.testName.split("|");
    this.testIds = this.data.testIds.split("|");
    console.log(this.data);
  }

  ngOnInit() {
    // this.labReferralTestMappings =
    //   this.data.labReferralTestMappingId.split("/");

    if (this.data.status != "Report Uploaded") {
      this.isReadytoDownload = true;
    }
    for (let i = 0; i < this.testNames.length; i++) {
      this.testList.push({
        LabReferralTestId: this.labReferralTestMappings[i],
        labReferralId: this.selectedLabReferral.labReferralId,
        TestName: this.testNames[i],
        TestId: this.testIds[i],
      });
    }
    this.getLabResult();
  }
  downloadFile(event: number, fileName: string) {
    this.clientService.downloadLabFile(event).subscribe((response: any) => {
      this.clientService.downloadFile(response, response.type, fileName);
    });
  }
  closeDialog(action: string) {
    this.dialogModalRef.close(action);
  }
  getLabResult = () => {
    this.clientService
      .GetAllLabReferralResultDocByReverralId(this.data.labReferralId)
      .subscribe((res: any) => {
        this.testResultDocument = res.data?res.data:[];
      });
  };

  viewDocument = (event: number, fileName: any) => {
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

