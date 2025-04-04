import { CommonService } from "src/app/platform/modules/core/services";
import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EncounterService } from "../encounter.service";
//import { ChatService } from "src/app/platform/modules/agency-portal/encounter/mean-video/chat.service";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";
import { HubService } from "../../../main-container/hub.service";
import { AppService } from "src/app/app-service.service";
import { CallInitModel, CallStatus } from "src/app/shared/models/callModel";
import { ClientsService } from "../../clients/clients.service";
import { VitalModel } from "../../clients/vitals/vitals.model";
import { MedicationModel } from "../../clients/medication/medication.model";
import { VitalsComponent } from "../../clients/vitals/vitals.component";
import { MedicationComponent } from "../../clients/medication/medication.component";
import { PrescriptionComponent } from "../../clients/prescription/prescription.component";
import { SoapNoteComponent } from "../../clients/soap-note/soap-note.component";
import { DocumentsComponent } from "../../clients/documents/documents.component";
import { IcdComponent } from "../../clients/icd/icd.component";
import { HistoryComponent } from "../../clients/history/history.component";
import { ClientInsuranceComponent } from "../../clients/client-insurance/client-insurance.component";
import { ImmunizationComponent } from "../../clients/immunization/immunization.component";
import { AllergiesComponent } from "../../clients/allergies/allergies.component";
import { LabReferralComponent } from "../../lab-referral/lab-referral.component";
import { RadiologyReferralComponent } from "../../radiology-referral/radiology-referral.component";
import { VideoConsultationTestModalComponent } from "src/app/shared/video-consultation-test-modal/video-consultation-test-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { PatientEncounterCheckInNotesModel } from "../../clients/diagnosis/diagnosis.model";
import { NotifierService } from "angular-notifier";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-video-call",
  templateUrl: "./video-call.component.html",
  styleUrls: ["./video-call.component.css"],
})
export class VideoCallComponent implements OnInit, OnDestroy {
  @ViewChild("tabContent", { read: ViewContainerRef })
  tabContent!: ViewContainerRef;
  appointmentId: number;
  encounterId: number;
  patientAppointmentDetails: any;
  patientAppointment: any;
  staffDetails: any;
  userId: number = 0;
  patientNoteId: number = 0;

  displayedColumns: Array<any>;
  vitalListingData: VitalModel[] = [];
  vitalData: VitalModel = new VitalModel;
  metaData: any;
  medication: MedicationModel = new MedicationModel;
  encrytPatientId:any;
  selectPatientOption:any;
  PatientTab:any;
  encryptedAppointmentId!: number;
  selectedIndex:any;
  htmlContent: any = "";
  patientEncounterCheckInNotesModel: PatientEncounterCheckInNotesModel = new PatientEncounterCheckInNotesModel;
  editorConfig: AngularEditorConfig;
  endAppointmentNote: boolean = false;
  moduleTabs = [
    {
      id: 5,
      displayName: "Documents",
    },
    {
      id: 6,
      displayName: "Vitals",
    },
    {
      id: 7,
      displayName: "Doctor Notes",
    },
    {
      id: 8,
      displayName: "Pre-Existing Medications",
    },
    {
      id: 9,
      displayName: "E-Prescription",
    },
    {
      id: 10,
      displayName: "ICD",
    },
    // {
    //   id: 11,
    //   displayName: "History",
    // },
    {
      id: 12,
      displayName: "Insurance",
    },
    {
      id: 13,
      displayName: "Immunization",
    },
    {
      id: 14,
      displayName: "Allergies",
    },
  ];

  callStartStop: boolean = false;


  constructor(
    private activateRoute: ActivatedRoute,
    private encounterService: EncounterService,
    //private chatService: ChatService,
    private commonService: CommonService,
    private appService: AppService,
    private clientService: ClientsService,
    private cfr: ComponentFactoryResolver,
    private dailog: MatDialog,
    private notifier: NotifierService,
    private date: DatePipe
  ) {
    this.appointmentId = 0;
    this.encounterId = 0;
    this.patientAppointmentDetails = null;
    this.staffDetails = null;
    this.patientAppointment = null;
    this.displayedColumns = [
      { displayName: "date", key: "vitalDate", isSort: true, width: "20%" },
      {
        displayName: "Height (Cm)",
        key: "displayheight",
        isSort: true,
        width: "10%",
      },
      { displayName: "weight(Kg)", key: "weightLbs" },
      { displayName: "h_rate", key: "heartRate" },
      { displayName: "bmi", key: "bmi", isSort: true },
      { displayName: "bp_h_l", key: "displayBP" },
      { displayName: "pulse", key: "pulse" },
      { displayName: "resp", key: "respiration" },
      { displayName: "temp(C)", key: "temperature" },
      { displayName: "actions", key: "Actions" },
    ];
    this.editorConfig = {
      editable: true,
      spellcheck: true,
      height: "auto",
      minHeight: "10rem",
      maxHeight: "auto",
      width: "auto",
      minWidth: "auto",
      translate: "no",
      enableToolbar: false,
      showToolbar: true,
      placeholder: "Enter text here...",
      defaultParagraphSeparator: "",
      defaultFontName: "",
      defaultFontSize: "",
      fonts: [
        { class: "arial", name: "Arial" },
        { class: "times-new-roman", name: "Times New Roman" },
        { class: "calibri", name: "Calibri" },
        { class: "comic-sans-ms", name: "Comic Sans MS" },
      ],
      customClasses: [
        {
          name: "quote",
          class: "quote",
        },
        {
          name: "redText",
          class: "redText",
        },
        {
          name: "titleText",
          class: "titleText",
          tag: "h1",
        },
      ],
      //sanitize: true,
      //toolbarPosition: 'top',
      // toolbarHiddenButtons: [
      //   [
      //   ],
      //   [
      //     'customClasses',
      //     'link',
      //     'unlink',
      //     'insertImage',
      //     'insertVideo',
      //     'toggleEditorMode'
      //   ]
      // ]
    };
  }

  ngOnInit() {
    this.PatientTab = [
      {
        TabName: "Vitals",
        Component: VitalsComponent,
      },
      {
        TabName: "Pre-Existing Medications",
        Component: MedicationComponent,
      },
      {
        TabName: "E-Prescription",
        Component: PrescriptionComponent,
      },
      {
        TabName: "Doctor Soap Notes",
        Component: SoapNoteComponent,
      },
      {
        TabName: "Documents",
        Component: DocumentsComponent,
      },
      {
        TabName: "ICD",
        Component: IcdComponent,
      },
      {
        TabName: "History",
        Component: HistoryComponent,
      },
      {
        TabName: "Insurance",
        Component: ClientInsuranceComponent,
      },
      {
        TabName: "Immunization",
        Component: ImmunizationComponent,
      },
      {
        TabName: "Allergies",
        Component: AllergiesComponent,
      },
      {
        TabName: "Lab Referral",
        Component: LabReferralComponent,
      },
      {
        TabName: "Radiology Referral",
        Component: RadiologyReferralComponent,
      },
    ];

    this.medication = new MedicationModel();
    //////debugger;
    console.log("13 oninit   called from video call component  ");
    let fullName = "";
    if (localStorage.getItem("access_token")) {
      this.commonService.loginUser.subscribe((user: LoginUser) => {
        if (user.data) {
          let userInfo: any;

          this.userId = user.data.userID;
          const userRoleName =
            user.data.users3 && user.data.users3.userRoles.userType;
          if ((userRoleName || "").toUpperCase() === "CLIENT") {
            userInfo = user.patientData;
            fullName = userInfo.lastName + " " + userInfo.firstName;
          } else {
            userInfo = user.data;
            fullName = "Dr. " + userInfo.lastName + " " + userInfo.firstName;
          }
        } else {
        }
      });
    }

    if (
      this.activateRoute.snapshot.url[0] &&
      this.activateRoute.snapshot.url[0].path == "check-in-video-call"
    ) {
      const apptId = this.activateRoute.snapshot.paramMap.get("id");
      this.appointmentId = Number(apptId);
      this.encounterId = 0;
      //////debugger;
      if (this.appointmentId) this.getPatientAppointmentDetails();
    } else {
      this.activateRoute.queryParams.subscribe((params) => {
        this.appointmentId =
          params["apptId"] == undefined ? 0 : parseInt(params["apptId"]);
        if (this.appointmentId) {
          this.getPatientAppointmentDetails();
          //this.hubSevice.handleIncomingCall(this.appointmentId, this.userId);
          // this.chatService.changename({
          //   username: fullName,
          //   roomname: "room" + this.appointmentId.toString()
          // });
        }
      });
    }
//debugger;
    this.commonService.callStartStopShareSubject.subscribe((res: any) => {
      this.callStartStop = res;
    });
    var localItem = localStorage.getItem("callPicked");
    if (localItem == "yes") {
      console.log("10 call initiate  called from video call");
      console.log("call initiated from here");
      console.log("appointmentid=" + this.appointmentId);
      this.appService
        .getCallInitiate(this.appointmentId, this.userId)
        .subscribe((res) => {
          console.log(res);
          let callInitModel: CallInitModel = new CallInitModel();
          callInitModel.AppointmentId = this.appointmentId;
          callInitModel.CallStatus = CallStatus.Picked;
          this.appService.CheckCallStarted(callInitModel);
        });
    }

    this.getVitalByAppointmentId();
    this.getMedicationByAppointmentId();
  }

  startcallAgain = () => {
    //debugger;
    if (this.appointmentId > 0 && this.userId > 0) {
      console.log("10 call initiate  called from video call");
      console.log("call initiated from here");
      console.log("appointmentid=" + this.appointmentId);
      this.appService
        .getCallInitiate(this.appointmentId, this.userId)
        .subscribe((res) => {
          console.log(res);

          let callInitModel: CallInitModel = new CallInitModel();
          callInitModel.AppointmentId = this.appointmentId;
          callInitModel.CallStatus = CallStatus.Picked;
          this.appService.CheckCallStarted(callInitModel);
        });
    }

    let divVideoTool = document.getElementById("divVideoTool");
    if (divVideoTool != undefined) {
      let videoTool = document.getElementsByClassName("video-tool");
      if (videoTool != undefined && videoTool.length > 0) {
        var position = divVideoTool.getBoundingClientRect();
        videoTool[0].setAttribute("style", "left:" + position.left + "px;");
      }
    }

    if (this.patientAppointmentDetails && !localStorage.getItem("otSession")) {
      this.encounterService
        .getTelehealthSession(this.appointmentId)
        .subscribe((response) => {
          if (response.statusCode == 200) {
            var otSession = this.commonService.encryptValue(
              JSON.stringify(response.data)
            );

            console.log("session=" + JSON.stringify(response.data));
            //let videoTool = document.getElementsByClassName("video-tool");
            //videoTool[0].classList.remove("video-tool-hide");
            localStorage.setItem("otSession", otSession);
            this.commonService.videoSession(true);
            // this.otSessionId = response.data.id;
            // const config = {
            //   API_KEY: +response.data.apiKey,
            //   TOKEN: response.data.token,
            //   SESSION_ID: response.data.sessionID,
            //   SAMPLE_SERVER_BASE_URL: ""
            // };
            //this.getSession(config);
          }
        });
    }
  };

  getVitalByAppointmentId() {
    this.clientService
      .getVitalByAppointmentId(this.appointmentId)
      .subscribe((response: any) => {
        if (response != null) {
          console.log("getVitalByAppointmentId", response);
          this.vitalData = response.data != null ? response.data : [];
          this.vitalListingData = [];
          this.vitalListingData.push(this.vitalData);
        }
      });
  }

  getMedicationByAppointmentId() {
    this.clientService
      .getmedicationByAppointmentId(this.appointmentId)
      .subscribe((response: any) => {
        if (response != null) {
          console.log("getmedicationByAppointmentId", response);
          this.medication = response.data != null ? response.data : [];
        }
      });
  }

  getPatientAppointmentDetails() {
    this.encounterService
      .GetPatientEncounterDetails(this.appointmentId, this.encounterId, false)
      .subscribe((response) => {
        //////debugger;
        if (response.statusCode == 200) {
          //////debugger;
          this.getPatientEncounterCheckInNotesByAppointmentId();
          this.encrytPatientId = this.commonService.encryptValue(
            response.data.patientAppointment.patientID,
            true
          );
          this.encryptedAppointmentId = this.commonService.encryptValue(
            this.appointmentId,
            true
          );

          this.patientAppointmentDetails =
            response.data.patientAppointment || null;
          console.log(response.data.patientAppointment);
          if (
            this.patientAppointmentDetails.appointmentStaffs != null &&
            this.patientAppointmentDetails.appointmentStaffs != undefined &&
            this.patientAppointmentDetails.appointmentStaffs.length > 0
          )
            this.staffDetails =
              this.patientAppointmentDetails.appointmentStaffs[0];
          this.loadChild("Vitals");
          var curDate = this.date.transform(
            new Date(),
            "yyyy-MM-dd HH:mm:ss a"
          );
          var selDate = this.date.transform(
            this.patientAppointmentDetails.endDateTime,
            "yyyy-MM-dd HH:mm:ss a"
          );
          if (selDate! < curDate!) {
            this.endAppointmentNote = true;
          }
        } else {
          this.patientAppointmentDetails = null;
          this.staffDetails = null;
        }
      });
  }
  getPatientEncounterCheckInNotesByAppointmentId() {
    this.encounterService
      .GetPatientEncounterCheckInNotesByAppointmentId(this.appointmentId)
      .subscribe((response) => {
        if (response.data) {
          this.patientNoteId = response.data.id;
          this.htmlContent = response.data.encounterNotes;
        }
      });
  }
  ngOnDestroy(): void {
    // this.appService.newSelectedScreenSizeSubject.next("1:4");
    this.appService.newSelectedScreenSizeSubject.next("1:2");
    const top = screen.height * 0.1;
    const left = screen.width * 0.7;
    this.appService.newSelectedVideoPositionSubject.next(left + "," + top);
  }

  selectChangeHandler = (event: { value: any; }) => {
    this.selectPatientOption = event.value;
    console.log(this.encrytPatientId);
  };

  loadComponent(eventType: any): any {
    this.loadChild(eventType.tab.textLabel);
  }

  loadChild(childName: string) {
    let factory: any;
    factory = this.cfr.resolveComponentFactory(
      this.PatientTab.find((x: { TabName: string; }) => x.TabName == childName).Component
    );
    this.tabContent.clear();
    let comp: ComponentRef<VitalsComponent> =
      this.tabContent.createComponent(factory);
    console.log("Loaddeddd", this.encryptedAppointmentId);
    comp.instance.encryptedPatientId = this.encrytPatientId;
    comp.instance.appointmentId = this.appointmentId;
    // comp.instance.appointmentId = 500;

    console.log("Appointment Id", this.encryptedAppointmentId);
    // comp.instance.handleTabChange.subscribe(this.handleTabChange.bind(this));
  }

  onAudioVideoTest() {
    const modalPopup = this.dailog.open(VideoConsultationTestModalComponent, {
      hasBackdrop: true,

      width: "55%",
    });
  }

  call() {
    console.log("1 Call method called from check page");
    localStorage.setItem("called_" + this.appointmentId, "true");
    this.startcallAgain();
    // localStorage.setItem("isCallStart", "true");
    /* if (this.isPatient == true) {
      this.router.navigate([
        "/web/waiting-room/check-in-video-call/" + this.appointmentId,;
      ]);
    } else {
      this.router.navigate([
        "/web/waiting-room/check-in-soap/" + this.appointmentId,
      ]);
    }*/
  }

  onSubmitEncounterCheckInNotes(event: any) {
    let clickType = event.currentTarget.name;
    this.patientEncounterCheckInNotesModel =
      new PatientEncounterCheckInNotesModel();
    if (this.patientNoteId > 0) {
      this.patientEncounterCheckInNotesModel.id = this.patientNoteId;
    }
    // this.submitted = true;
    this.patientEncounterCheckInNotesModel.patientID =
      this.patientAppointmentDetails.patientID;
    this.patientEncounterCheckInNotesModel.StaffId = this.staffDetails.staffId;
    this.patientEncounterCheckInNotesModel.AppointmentID = this.appointmentId;
    this.patientEncounterCheckInNotesModel.encounterNotes = this.htmlContent;
    this.encounterService
      .savePatientEncounterCheckInNotes(this.patientEncounterCheckInNotesModel)
      .subscribe((response: any) => {
        // this.submitted = false;
        if (response.statusCode == 200) {
          this.patientNoteId = response.data.id;
          this.notifier.notify("success", response.message);
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }

  EndSession=()=>{
    console.log("endSEssion");
    
  }
}
