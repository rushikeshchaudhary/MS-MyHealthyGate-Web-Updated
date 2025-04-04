import { Component, OnInit } from "@angular/core";
import { ClientsService } from "../clients.service";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router, ParamMap, Params } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { ClientProfileModel } from "../client-profile.model";
import { ClientsService as AgencyClientsService } from "../../agency-portal/clients/clients.service";
import { ChatHistoryModel } from "../../agency-portal/clients/profile/chat-history.model";
import { FilterModel, ResponseModel } from "../../core/modals/common-model";
import { CommonService } from "../../core/services/common.service";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs/internal/Subscription";

@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.css"],
})
export class MyProfileComponent implements OnInit {
  clientId!: number;
  fromUserId!: number;
  maxDate: any;
  locationId!: number;
  clientProfileModel!: ClientProfileModel;
  //insuranceModel: PatientInsuranceModel;
  //patientMedicalFamilyHistoryModel: PatientMedicalFamilyHistoryModel;
  insuranceColumns!: Array<any>;
  actionButtons: Array<any> = [];
  subscription!: Subscription;
  isPatient:boolean=false;
  isSuperAdmin:boolean=false;
  //chat
  userId!: number;
  chatHistoryData: Array<ChatHistoryModel> = [];
  constructor(
    private clientService: ClientsService,
    private dialogModal: MatDialog,
    private router: Router,
    private commonService: CommonService,
    private notifier: NotifierService,
    private clientsAgencyService: AgencyClientsService,
    private pharmacyDialog: MatDialog,
    private dialogService: DialogService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.route.queryParams.subscribe((params: Params) => {
      this.clientId = +params["id"];
      this.fromUserId = +params["userID"];
      this.locationId = +params["locationID"];
      this.userId =+params["userID"];
      this.getClientProfileInfo();
    });
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }
  profileTabs: any;
  historyTabs: any;
  selectedIndex: number = 0;
  selectedIndexForHistoryTabs: number = 0;
  showupcomingappts: boolean = false;
  showlastappts: boolean = false;

  ngOnInit() {
    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        console.log(user);
        if (user) {
          this.clientId = user.id;
          this.fromUserId = user.userID;
          this.userId = user.userID;
          this.locationId = user.locationID;
          this.getClientProfileInfo();
          var today = new Date().toLocaleDateString();
          var dateArray = today.split("/");
          this.maxDate = new Date(Date.now());
          if (user.users3.userRoles.roleName == "Patient") {
            this.isPatient = true;
          }
        }else if(user == null || user.users3.userRoles.roleName!="Provider"){
          this.isSuperAdmin = true; 
        }else{
          this.isPatient=false
        }
        
      }
    );
  }
  getClientProfileInfo() {
    this.clientService
      .getClientProfileInfo(this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientProfileModel = response.data;
          if (this.clientProfileModel.upcomingAppointmentDetails.length > 0) {
            this.showupcomingappts = true;
          }
          if (this.clientProfileModel.lastAppointmentDetails.length > 0) {
            this.showlastappts = true;
          }
          if (this.clientProfileModel) {
            this.getChatHistory();
          }
        }
      });
  }
  //chat
  getChatHistory() {
    if (this.clientProfileModel.patientInfo.length > 0) {
      this.clientService
        .getChatHistory(
          this.fromUserId,
          this.clientProfileModel.patientInfo[0].renderingProviderId as number
        )
        .subscribe((response: ResponseModel) => {
          if (response != null && response.statusCode == 200) {
            this.chatHistoryData =
              response.data != null && response.data.length > 0
                ? response.data
                : [];
            // this.createModal(this.chatHistoryData);
          }
        });
    }
  }
  editProfile(event: any) {
    this.router.navigate(["/web/client/client-profile"], {
      queryParams: {
        id:
          this.clientId != null
            ? this.commonService.encryptValue(this.clientId, true)
            : null,
      },
    });
  }

  pastAppoinment() {
    this.router.navigate(["/web/client/clientencounter"], {
      queryParams: {
        id:
          this.clientId != null
            ? this.commonService.encryptValue(this.clientId, true)
            : null,
      },
    });
  }
}
