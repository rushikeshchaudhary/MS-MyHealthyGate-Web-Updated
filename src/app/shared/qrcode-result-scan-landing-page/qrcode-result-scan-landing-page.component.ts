import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ClientsService } from "src/app/platform/modules/client-portal/clients.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-qrcode-result-scan-landing-page",
  templateUrl: "./qrcode-result-scan-landing-page.component.html",
  styleUrls: ["./qrcode-result-scan-landing-page.component.css"],
})
export class QRCodeResultScanLandingPageComponent implements OnInit {
  referalId: string='';
  referalData: any;
  testList: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientsService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.referalId = params.get("id")!;
    });
    console.log(this.referalId);
    this.getReferalDataByReferalId();
  }

  getReferalDataByReferalId = () => {
    this.clientService
      .GetReferalDetailsByReferalIdAPi(this.referalId)
      .subscribe((res: any) => {
        // console.log(res);
        this.referalData = res.data;
        this.testList = res.data.testName.split("|");
        // console.log(this.testList);
      });
  };


  showImageHandler = (element: { fileName: string; originalFileName: string; }) => {
    if (element) {
      let byteChar = atob(element.fileName);
      let byteArray = new Array(byteChar.length);
      for (let i = 0; i < byteChar.length; i++) {
        byteArray[i] = byteChar.charCodeAt(i);
      }

      let uIntArray = new Uint8Array(byteArray);
      let file = new Blob([uIntArray], { type: "application/pdf" });
      var fileURL = URL.createObjectURL(file);
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.target = "_blank";
      a.href = fileURL;
      a.download = element.originalFileName;
      a.click();
      a.remove();

      const nav = window.navigator as any;
      if (nav && nav.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(file);
        return;
      }
      const data = window.URL.createObjectURL(file);
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

  }
}
