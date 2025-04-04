import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ClientsService } from "src/app/platform/modules/client-portal/clients.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-referral-qr-code-page",
  templateUrl: "./referral-qr-code-page.component.html",
  styleUrls: ["./referral-qr-code-page.component.css"],
})
export class ReferralQrCodePageComponent implements OnInit {
  referalId: string|null=null;
  referalData: any;
  testList: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientsService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.referalId = params.get("id");
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
        this.testList = res.data.testName.split('|')
        // console.log(this.testList);
        
      });
  };
}
