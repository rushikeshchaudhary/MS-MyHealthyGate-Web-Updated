import { Subscription } from "rxjs";
import { Component, OnInit } from "@angular/core";

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "angular-notifier";
import { ActivatedRoute } from "@angular/router";

import { SocialHistoryModel } from "src/app/platform/modules/agency-portal/clients/client.model";
import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";
import { CommonService } from "src/app/platform/modules/core/services";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-social-history-app",
  templateUrl: "./social-history.component.html",
  styleUrls: ["./social-history.component.css"]
})
export class SocialHistoryComponent implements OnInit {
  masterSocialHistory: Array<any>;
  socialHistory: SocialHistoryModel;
  socialForm!: FormGroup;
  masterTravel: Array<any> = [];
  subscription!: Subscription;
  submitted: boolean = false;
  clientId!: number;
  header: string = "Social History";
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private clientService: ClientsService,
    private notifier: NotifierService,
    private commonService: CommonService,
    private translate:TranslateService 
  ) {
    this.masterSocialHistory = [];
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
      this.socialHistory = new SocialHistoryModel();
      this.masterTravel = [];
  }

  ngOnInit() {
   
     this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          this.clientId = user.id;
          //this.getUserPermissions();
          this.clientService
            .getPatientSocialHistory(this.clientId)
            .subscribe((response: any) => {
              this.socialHistory = response.data;
              this.socialForm.patchValue({
                ...response.data
              });
            });
        }
      }
    );

    this.clientService
      .getMasterData("SOCIALHISTORY")
      .subscribe((response: any) => {
        this.masterSocialHistory = response.masterSocialHistory;
        this.masterTravel = JSON.parse(JSON.stringify(response.masterSocialHistory))
        this.masterTravel = this.masterTravel.filter(x => x.value != "Former");
        this.masterTravel.map((ele) => {
          if (ele.globalCodeName == "Daily") {
            ele.value = "Frequently";
          } else if (ele.globalCodeName == "Weekly/ Occasionally") {
            ele.value = "Occasionally";
          } else if (ele.globalCodeName == "None") {
            ele.value = "None";
          }
        });
      });

    this.socialForm = this.formBuilder.group({
      alcohalID: [this.socialHistory.alcohalID, Validators.required],
      drugID: [this.socialHistory.drugID, Validators.required],
      occupation: [this.socialHistory.occupation, Validators.required],
      tobaccoID: [this.socialHistory.tobaccoID, Validators.required],
      travelID: [this.socialHistory.travelID, Validators.required]
    });
  }

  get formControls() {
    return this.socialForm.controls;
  }

  onSubmit(event: any) {
    if (!this.socialForm.invalid) {
      this.submitted = true;

      //assign form values
      let formValues = this.socialForm.value;

      //assign values
      formValues.patientID = this.clientId;
      formValues.id = this.socialHistory.id == null ? 0 : this.socialHistory.id;

      //assign form values to socialhistory model
      this.socialHistory = formValues;

      //validation check
      if (
        this.socialHistory.alcohalID == null ||
        this.socialHistory.drugID == null ||
        this.socialHistory.occupation == null ||
        this.socialHistory.tobaccoID == null ||
        this.socialHistory.travelID == null
      ) {
        this.notifier.notify("warning", "Please select all option");
      } else if (
        this.socialHistory.patientID == null ||
        this.socialHistory.id == null
      ) {
        this.notifier.notify(
          "warning",
          "Something went wrong try after some time!"
        );
      } else {
        this.clientService
          .createSocialHistory(this.socialHistory)
          .subscribe((response: any) => {
            this.submitted = false;
            if (response.statusCode == 200) {
              this.notifier.notify("success", response.message);
            } else {
              this.notifier.notify("error", response.message);
            }
          });
      }
    }
  }
}
