import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SocialHistoryModel } from "../client.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotifierService } from "angular-notifier";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "../../../core/services";
import { ClientsService } from "../clients.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-social-history",
  templateUrl: "./social-history.component.html",
  styleUrls: ["./social-history.component.css"],
})
export class SocialHistoryComponent implements OnInit {
  @Input() clientId!: number;
  @Input() appointmentId: number = 0;
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  masterSocialHistory: Array<any>;
  masterTravel: Array<any> = [];
  socialHistory: SocialHistoryModel;
  socialForm!: FormGroup;
  submitted: boolean = false;
  isHistoryShareable: boolean = true;
  // clientId: number;
  header: string = "Social History";
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private clientService: ClientsService,
    private notifier: NotifierService,
    private commonService: CommonService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.masterSocialHistory = [];
    this.masterTravel = [];

    this.socialHistory = new SocialHistoryModel();
  }

  ngOnInit() {
    this.commonService.loadingStateSubject.next(true);
    // this.activatedRoute.queryParams.subscribe((params) => {
    //   this.clientId =
    //     params.id == undefined
    //       ? null
    //       : this.commonService.encryptValue(params.id, false);
    // });
    this.getAppointmentDetails();

    this.clientService
      .getMasterData("SOCIALHISTORY")
      .subscribe((response: any) => {
        console.log(response);
        response.masterSocialHistory.map((ele: { globalCodeName: string; value: string; }) => {
          if (ele.globalCodeName == "Current every day") {
            ele.value = "Daily";
          } else if (ele.globalCodeName == "Current some day") {
            ele.value = "Weekly/Occasionally";
          } else if (ele.globalCodeName == "Current status unknown") {
            ele.value = "None";
          } else {
          }
        });
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
    this.clientService
      .getPatientSocialHistory(this.clientId)
      .subscribe((response: any) => {
        this.socialHistory = response.data;
        this.socialForm.patchValue({
          ...response.data,
        });
      });

    this.socialForm = this.formBuilder.group({
      alcohalID: [this.socialHistory.alcohalID, Validators.required],
      drugID: [this.socialHistory.drugID, Validators.required],
      occupation: [this.socialHistory.occupation, Validators.required],
      tobaccoID: [this.socialHistory.tobaccoID, Validators.required],
      travelID: [this.socialHistory.travelID, Validators.required],
    });
    this.commonService.loadingStateSubject.next(false);
  }


  getAppointmentDetails() {
    this.clientService
      .getClientProfileInfo(this.clientId)
      .subscribe((responce) => {
        this.isHistoryShareable =
          responce.data.patientInfo[0].isHistoryShareable;
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
