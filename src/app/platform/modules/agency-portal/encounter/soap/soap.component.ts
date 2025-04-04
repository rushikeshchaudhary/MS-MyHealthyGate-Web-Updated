import { DiagnosisService } from "./../diagnosis/diagnosis.service";
import { DialogService } from "./../../../../../shared/layout/dialog/dialog.service";
import { ResponseModel } from "./../../../../../super-admin-portal/core/modals/common-model";
//import { DiagnosisModalComponent } from "./../../clients/diagnosis/diagnosis-modal/diagnosis-modal.component";
//import { ChatService } from "src/app/platform/modules/agency-portal/encounter/mean-video/chat.service";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Renderer2,
  OnDestroy,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { EncounterService } from "../encounter.service";
import { format, addDays } from "date-fns";
import { MatDialog } from "@angular/material/dialog";
import { SignDialogComponent } from "../sign-dialog/sign-dialog.component";
import { ClientHeaderModel } from "../../clients/client-header.model";
import { CommonService } from "../../../core/services";
import { DatePipe } from "@angular/common";
import { TemplateFormComponent } from "../template-form/template-form.component";
import { ServiceCodeModal } from "../../masters/service-codes/service-code.modal";
import {
  DiagnosisModel,
  PatientEncounterNotesModel,
} from "../../clients/diagnosis/diagnosis.model";
import { FormioOptions } from '@formio/angular';
import { ResizeEvent } from "angular-resizable-element";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";
import { DiagnosisModalComponent } from "src/app/platform/modules/agency-portal/encounter/diagnosis/diagnosis-modal/diagnosis-modal.component";
import { AddServiceCodeModalComponent } from "src/app/platform/modules/agency-portal/encounter/service-code-modal/add-service-code-modal.component";
import { AppService } from "src/app/app-service.service";
import { CallInitModel, CallStatus } from "src/app/shared/models/callModel";
import { PatientEncounterNotesModalComponent } from "../patientencounternotes-modal/patientencounternotes.component";
import { ClientsService } from "../../clients/clients.service";
import { UserDocumentModel } from "../../users/users.model";
import { VitalModel } from "../../clients/vitals/vitals.model";
import { Observable } from "rxjs";
import {
  FilterModel,
  MedicationModel,
} from "../../clients/medication/medication.model";
import { VideoConsultationTestModalComponent } from "src/app/shared/video-consultation-test-modal/video-consultation-test-modal.component";
import { SchedulerService } from "../../../scheduling/scheduler/scheduler.service";
import { SoapNoteComponent } from "../../clients/soap-note/soap-note.component";
import { VitalsComponent } from "../../clients/vitals/vitals.component";
import { DocumentsComponent } from "../../clients/documents/documents.component";
import { MedicationComponent } from "../../clients/medication/medication.component";
import { PrescriptionComponent } from "../../clients/prescription/prescription.component";
import { IcdComponent } from "../../clients/icd/icd.component";
import { ImmunizationComponent } from "../../clients/immunization/immunization.component";
import { AllergiesComponent } from "../../clients/allergies/allergies.component";
import { ClientInsuranceComponent } from "../../clients/client-insurance/client-insurance.component";
import { LabReferralComponent } from "../../lab-referral/lab-referral.component";
import { RadiologyReferralComponent } from "../../radiology-referral/radiology-referral.component";
import { HistoryComponent } from "../../clients/history/history.component";
import { HealthPlanCoverageComponent } from "../../clients/health-plan-coverage/health-plan-coverage.component";
import { MediCertificateComponent } from "../../clients/medi-certificate/medi-certificate.component";
import { NotifierService } from "angular-notifier";
import { VideoCallInvitationComponent } from "../video-call-invitation/video-call-invitation.component";
import { AngularEditorConfig } from "@kolkov/angular-editor";

class signModal {
  id: number = 0;
  bytes!: string;
  date!: string;
  name!: string;
}

@Component({
  selector: "app-soap",
  templateUrl: "./soap.component.html",
  styleUrls: ["./soap.component.css"],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class SoapComponent implements OnInit, OnDestroy {
  @ViewChild("dragsidebar")
  panel!: ElementRef;
  @ViewChild("videoDiv")
  panelVideo!: ElementRef;
  @ViewChild("SOAPPanel")
  SOAPPanel!: ElementRef;
  @ViewChild("videoTool")
  videoTool!: ElementRef;
  @ViewChild("tabContent", { read: ViewContainerRef })
  tabContent!: ViewContainerRef;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",

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
  };
  selectedIndex: any;
  serviceCodeModal!: ServiceCodeModal;
  patientEncounterServiceCodes: ServiceCodeModal[];
  soapForm!: FormGroup;
  appointmentId!: number;
  allSoapNotes: Array<any> = [];
  encryptedAppointmentId!: number;
  encounterId!: number;
  soapNoteId: number;
  submitted: boolean;
  submittedMedicationForm: boolean;
  submittedSign: boolean;
  appConfiguration: Array<any>;
  maxDate = new Date();
  patientEncounterDiagnosisCodes: DiagnosisModel[];
  patientEncounterTemplate: Array<any>;
  patientAppointmentDetails: any;
  soapNotes: any;
  encounterSignature: Array<any>;
  staffDetails: any;
  appointmentStartTime: string;
  appointmentEndTime: string;
  unitsConsumed: number;
  patientSign: signModal = new signModal();
  employeeSign: signModal = new signModal();
  guardianSign: signModal = new signModal();
  isGuardianSigned: boolean;
  isClientSigned: boolean;
  isEmployeeSigned: boolean;
  isAllSigned: boolean;
  isSoapCompleted: boolean;
  istelehealthappt!: boolean;
  Vital: any;
  patientencounternotesForm!: FormGroup;
  public style: object = {};
  public styleVideo: object = {};
  disabledVitalForm: boolean = false;
  masterTemplates: Array<any>;
  templateFormId!: number;
  templateFormName!: string;
  diagnosisCodeModel!: DiagnosisModel;
  clientHeaderModel: ClientHeaderModel;
  FormData: any;
  initialValue: any;
  isSoap: boolean = false;
  previousEncounters!: Array<any>;
  previousEncounterId!: number;
  isPreviousEncounter: boolean = false;
  isSubmitted: boolean = false;
  templateIdFromDD: any = null;
  encounterTemplateId: any;
  showFormioDiv: any;
  otSessionId: number = 0;
  userDisplayName!: string;
  public jsonFormData: Object = {
    components: [],
  };
  initialFormValues: Object = {
    data: {},
  };
  formioOptions: FormioOptions = {
    disableAlerts: true,
  };

  public jsonFormDataProvider: Object | any = {
    components: [],
  };
  initialFormValuesProvider: Object | any = {
    data: {},
  };
  formioOptionsProvider: FormioOptions = {
    disableAlerts: true,
  };
  diagnosisModel!: DiagnosisModel;
  patientencounternotesmodel!: PatientEncounterNotesModel;
  patientencounternotesModel!: PatientEncounterNotesModel;
  clientId!: number;
  userId!: number;
  aptId!: number;
  todayDate = new Date();
  fromDate!: string;
  toDate!: string;
  documentList: Array<UserDocumentModel> = [];
  isSubmit = false;
  ICDName: string = "";
  masterICD: any = [];
  IcdComment = false;
  icdForm!: FormGroup;
  selectedIcdCode: any;
  encrytPatientId: any;
  encrytPatientUserId: any;
  masterFrequencyType:any = [];
  vitalModel: VitalModel = new VitalModel();
  callStartStop: boolean = false;
  isEnded: boolean = false;
  isStarted: boolean = false; //true;
  isShowTimer: boolean = false;
  isShowCheckinBtns: boolean = false;
  patientEncounterDetails: any;

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
  filterModel: FilterModel = new FilterModel();
  vitalForm!: FormGroup;
  showEndSessionBtn: boolean = true;
  patientNotesForm = { encounternotes: "" };
  selectPatientOption: any;
  patientId!: number;
  error: string = "Please fill atleast one more vital other than date";
  medicationAddForm!: FormGroup;
  medicationModel: MedicationModel = new MedicationModel();
  PatientTab: any;
  appointmentMode: string = "";
  MasterTemplateListByProvider!: Array<any>;
  isAppointmentCompleted: boolean = false;
  constructor(
    private signDailog: MatDialog,
    private schedulerService: SchedulerService,
    private dailog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private encounterService: EncounterService,
    private notifierService: NotifierService,
    private commonService: CommonService,
    private serviceCodeDailog: MatDialog,
    private renderer: Renderer2,
    private cfr: ComponentFactoryResolver,
    private diagnosisService: DiagnosisService,
    private diagnosisDialogModal: MatDialog,
    private patientencounternotesDialogModal: MatDialog,
    private dialogService: DialogService,
    private appService: AppService,
    private clientService: ClientsService,
    private notifier: NotifierService
  ) {
    this.submitted = false;
    this.submittedMedicationForm = false;
    this.submittedSign = false;
    this.soapNoteId = 0;
    this.appConfiguration = [];
    this.patientEncounterDiagnosisCodes = [];
    this.patientEncounterServiceCodes = [];
    this.patientEncounterTemplate = [];
    this.patientAppointmentDetails = null;
    this.soapNotes = null;
    this.encounterSignature = [];
    this.staffDetails = null;
    this.appointmentStartTime = '';
    this.appointmentEndTime = '';
    this.unitsConsumed = 0;
    this.isGuardianSigned = false;
    this.isClientSigned = false;
    this.isEmployeeSigned = false;
    this.isAllSigned = false;
    this.isSoapCompleted = false;
    this.masterTemplates = [];

    this.clientHeaderModel = new ClientHeaderModel();
    this.commonService._isAppointmentCompleted.subscribe((res) => {
      this.isAppointmentCompleted = res;
    })
    if (localStorage.getItem("access_token")) {
      this.commonService.loginUser.subscribe((user: LoginUser) => {
        if (user.data) {
          let userInfo: any;

          this.userId = user.data.userID;
          const userRoleName =
            user.data.users3 && user.data.users3.userRoles.userType;
          if ((userRoleName || "").toUpperCase() === "CLIENT") {
            userInfo = user.patientData;
          } else {
            userInfo = user.data;
          }
        } else {
        }
        if (
          this.activatedRoute.snapshot.url[0] &&
          this.activatedRoute.snapshot.url[0].path == "check-in-soap"
        ) {
          const apptId = this.activatedRoute.snapshot.paramMap.get("id");
          this.appointmentId = Number(apptId);
          this.encounterId = this.getCurrentencouter();
          this.getPatientEncounterDetails();
          this.getMasterTemplates();
          this.GetMasterTemplateListByProvider();
        } else {
          this.activatedRoute.queryParams.subscribe((params) => {
            this.appointmentId =
              params["apptId"] == undefined ? 0 : parseInt(params["apptId"]);
            this.encounterId =
              params["encId"] == undefined ? 0 : parseInt(params["encId"]);
            this.getPatientEncounterDetails();
            this.getMasterTemplates();
            this.GetMasterTemplateListByProvider();
          });
        }
        var localItem = localStorage.getItem("callPicked");
        if (localItem == "yes") {
          // console.log("10 call initiate  called from video call");
          // console.log("call initiated from here");
          // console.log("appointmentid=" + this.appointmentId);
          this.appService
            .getCallInitiate(this.appointmentId, this.userId)
            .subscribe((res) => {
              console.log(res);
              this.commonService.callStartStopSubject.next(true);
              let callInitModel: CallInitModel = new CallInitModel();
              callInitModel.AppointmentId = this.appointmentId;
              callInitModel.CallStatus = CallStatus.Picked;
              this.appService.CheckCallStarted(callInitModel);
            });
        }
      });
    }
  }
  getCurrentencouter() {
    let soapnotesData = localStorage.getItem("soapnotesData")!;
    const _soapnotesData = JSON.parse(soapnotesData);
    if (
      _soapnotesData != null &&
      this.appointmentId == _soapnotesData.appointmentId &&
      _soapnotesData.encounterId != 0
    ) {
      return _soapnotesData.encounterId;
    } else {
      return 0;
    }
  }
  get f() {
    return this.soapForm.controls;
  }
  get icdF() {
    return this.icdForm.controls;
  }

  EndSession() {
    const appointmentData = {
      id: this.appointmentId,
      status: "COMPLETED",
    };
    this.dialogService
      .confirm("Are you sure you want to end this session? Have you saved your SOAP notes and other important information?")
      .subscribe((result: any) => {
        if (result == true) {
          this.schedulerService
            .updateAppointmentStatus(appointmentData)
            .subscribe((response: any) => {
              if (response.statusCode === 200) {
                this.notifier.notify(
                  "success",
                  "All data has been saved successfully, your appointment is marked completed."
                );
                this.router.navigate(["/web/my-appointments"]);
              } else {
              }
            });
        }
        else {

        }
      }
      );


  }

  call() {
    // console.log("1 Call method called from check page");
    localStorage.setItem("called_" + this.appointmentId, "true");

    setTimeout(function () {
      window.scroll({
        top: 320,
        left: 0,
        behavior: "smooth",
      });
    }, 2000);
    this.appService
      .getCallInitiate(this.appointmentId, this.userId)
      .subscribe((res) => {
        if (res.statusCode == 200) {
          let callInitModel: CallInitModel = new CallInitModel();
          callInitModel.AppointmentId = this.appointmentId;
          callInitModel.CallStatus = CallStatus.Picked;
          this.appService.CheckCallStarted(callInitModel);
        }
      });
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
            this.otSessionId = response.data.id;
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

    // this.commonService.callStartStopSubject.next(true);
    // localStorage.setItem("isCallStart", "true");
  }

  onAudioVideoTest() {
    const modalPopup = this.dailog.open(VideoConsultationTestModalComponent, {
      hasBackdrop: true,
      width: "55%",
    });
  }

  ngOnInit() {
    this.PatientTab = [
      {
        TabName: "Letter Template",
        Component: MediCertificateComponent,
      },
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
        TabName: "Health Plan Coverage",
        Component: HealthPlanCoverageComponent,
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
      {
        TabName: "User Invitaion",
        Component: VideoCallInvitationComponent,
      },
    ];

    this.getMasterData();
    this.commonService.isDoctor.subscribe((val) => {
      if (val) {
        localStorage.removeItem("called_" + this.appointmentId);
      }
    });
    this.commonService.isPatient.subscribe((isPatient) => {
      if (isPatient) {
      }
    });
    this.getIcdCodes();
    // console.log("3 ngoninit called from soap component");
    this.icdForm = this.formBuilder.group({
      icdName: [""],
      icdComment: [""],
    });



    let fullName = "";
    if (localStorage.getItem("access_token")) {
      this.commonService.loginUser.subscribe((user: LoginUser) => {
        if (user.data) {
          let userInfo: any;
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
    this.getCheckInNotesByAppointmentID(this.appointmentId);
    this.initilizeFormValues();
    this.getAppConfigurations();
    this.userDisplayName = "Provider";

    this.getUserDocuments();
    let soapnotesData = localStorage.getItem("soapnotesData")!;
    const _soapnotesData = JSON.parse(soapnotesData);
    if (
      _soapnotesData != null &&
      _soapnotesData.appointmentId == this.appointmentId
    ) {
      this.getCheckInNotesByAppointmentID(this.appointmentId);
      this.getMasterTemplatesfortemp(
        _soapnotesData.encounterId,
        _soapnotesData.masterTemplateId
      );
    }
    var localItem = localStorage.getItem("callPicked");
    if (localItem == "yes") {
      this.commonService.callStartStopShareSubject.subscribe((res: any) => {
        this.callStartStop = res;
      });
    }
  }

  getMasterTemplatesfortemp(encounterId: any, id: any):any {
    this.encounterService
      .getTemplateForm(encounterId, id)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.showFormioDiv = true;
          // this.openTemplateForm(response.data, id);
          let formJson:any = { components: [] },
            formData = { data: {} };
          try {
            formJson = JSON.parse(response.data.templateJson);
            formData = JSON.parse(response.data.templateData);
          } catch (err) { }

          this.encounterTemplateId = response.data.id || null;
          this.jsonFormData = response.data.templateJson
            ? formJson
            : this.jsonFormData;
          this.templateFormName = response.data.templateName || "";
          this.initialFormValues = response.data.templateData
            ? formData
            : this.initialFormValues;
          this.templateFormId = id;
          //this.encounterId = data.encounterId;
          // this.encounterTemplateId = response.data.id || null;
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

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
    debugger
    comp.instance.encryptedPatientId = this.encrytPatientId;
    comp.instance.encryptedPatientUserId = this.encrytPatientUserId;
    comp.instance.appointmentId = this.appointmentId;
  }

  selectChangeHandler = (event: { value: any; }) => {
    this.selectPatientOption = event.value;
  };

  initilizeFormValues() {
    const currentDate = new Date();
    const previousWeekDate = addDays(currentDate, -7);

    this.vitalForm = this.formBuilder.group({
      id: [this.vitalModel.id],
      patientID: [this.vitalModel.patientID],
      bmi: [this.vitalModel.bmi],
      bpDiastolic: [
        this.vitalModel.bpDiastolic,
        {
          asyncValidators: [this.validateBpdystolic.bind(this)],
        },
      ],
      bpSystolic: [
        this.vitalModel.bpSystolic,
        {
          asyncValidators: [this.validateBpsystolic.bind(this)],
        },
      ],
      heartRate: [
        this.vitalModel.heartRate,
        {
          asyncValidators: [this.validateHeartRate.bind(this)],
        },
      ],
      heightIn: [
        this.vitalModel.heightIn,
        {
          asyncValidators: [this.validateHeight.bind(this)],
        },
      ],
      pulse: [
        this.vitalModel.pulse,
        {
          asyncValidators: [this.validatePulse.bind(this)],
        },
      ],
      respiration: [
        this.vitalModel.respiration,
        {
          asyncValidators: [this.validateRespiration.bind(this)],
        },
      ],
      temperature: [
        this.vitalModel.temperature,
        {
          asyncValidators: [this.validateTemperature.bind(this)],
        },
      ],
      vitalDate: [this.vitalModel.vitalDate],
      weightLbs: [
        this.vitalModel.weightLbs,
        {
          asyncValidators: [this.validateWeight.bind(this)],
        },
      ],
    });

    this.soapForm = this.formBuilder.group({
      subjective: [""],
      objective: [""],
      assessment: [""],
      plans: [""],
      fromDate: [previousWeekDate],
      toDate: [currentDate],
    });
    this.medicationAddForm = this.formBuilder.group({
      id: [],
      patientId: this.patientId,
      dose: [],
      endDate: [],
      frequencyID: [],
      medicine: [],
      startDate: [],
      strength: [],
    });
    this.patientencounternotesForm = this.formBuilder.group({
      encounternotes: [],
    });

    console.log("Initilize form values end");
  }
  get formControls() {
    return this.soapForm.controls;
  }

  onBackClick() {
    localStorage.removeItem("called_" + this.appointmentId);
    this.router.navigate([
      "/web/waiting-room/check-in-call/" + this.appointmentId,
    ]);
  }
  getICDONChange = () => {
    this.encounterService
      .getMasterICDOnSearch(this.ICDName, 0)
      .subscribe((res) => {
        this.masterICD = res.data;
      });
  };

  icdChangeHandler = (item: { id: any; }) => {
    this.IcdComment = true;
    this.selectedIcdCode = item.id;
    // this.isSubmit=true;
  };

  OnSubmitICD = () => {
    if (this.selectedIcdCode) {
      this.isSubmit = true;
      const IcdData = {
        patientID: this.patientAppointmentDetails.patientID,
        iCDID: this.selectedIcdCode,
        // descriptions: this.ICDName,
        descriptions: this.icdForm.controls["icdComment"].value,
        appointmentId: this.appointmentId,
      };
      this.encounterService.savePatientIcd(IcdData).subscribe((res) => {
        if (res.statusCode == 200) {
          this.isSubmit = false;
          // this.ICDName = res.data.descriptions;
          // this.icdForm.controls["icdComment"].setValue(res.data.descriptions);
          this.isSubmit = false;
          this.getIcdCodes();
          this.getSoapNoteICDPatientPlanByAppId();
          this.notifier.notify("success", res.message);
        } else {
          this.isSubmit = false;
          this.notifier.notify("error", res.message);
        }
      });
    }
    else {
      this.notifier.notify("warn", "Please enter a valid ICD input.");
    }
  };

  onNavigate(url: string) {
    const clientId =
      this.patientAppointmentDetails &&
      this.patientAppointmentDetails.patientID;
    const aptId = this.appointmentId;
    if (aptId) {
      this.router.navigate([url], {
        queryParams: { aptid: this.commonService.encryptValue(aptId, true) },
      });
    }
    if (clientId)
      this.router.navigate([url], {
        queryParams: { id: this.commonService.encryptValue(clientId, true) },
      });
  }

  checkIsRequiredSigned() {
    let employee_signRequired = false,
      client_signRequired = false,
      guardian_signRequired = false;
    if (this.appConfiguration && this.appConfiguration.length) {
      this.appConfiguration.forEach((Obj) => {
        if (Obj.configType === 1) {
          switch (Obj.key) {
            case "CLINICIAN_SIGN":
              employee_signRequired =
                Obj.value.toString().toLowerCase() === "true";
              break;
            case "PATIENT_SIGN":
              client_signRequired =
                Obj.value.toString().toLowerCase() === "true";
              break;
            case "GUARDIAN_SIGN":
              guardian_signRequired =
                Obj.value.toString().toLowerCase() === "true";
              break;
            default:
              break;
          }
        }
      });
    }
    let employee_Signed = true,
      client_signed = true,
      guardian_signed = true;
    if (employee_signRequired) {
      if (this.isEmployeeSigned) {
        employee_Signed = true;
      } else {
        employee_Signed = false;
      }
    }
    if (client_signRequired) {
      if (this.isClientSigned) {
        client_signed = true;
      } else {
        client_signed = false;
      }
    }
    if (guardian_signRequired) {
      if (this.isGuardianSigned) {
        guardian_signed = true;
      } else {
        guardian_signed = false;
      }
    }
    // finally check if all required are signed ...
    if (employee_Signed) {
      //&& client_signed && guardian_signed) {
      this.isAllSigned = true;
    } else {
      this.isAllSigned = false;
    }
  }
  get vitalFormControls() {
    return this.vitalForm.controls;
  }
  get vitalValidation() {
    return (
      !this.vitalFormControls["heightIn"].value &&
      !this.vitalFormControls["weightLbs"].value &&
      !this.vitalFormControls["heartRate"].value &&
      !this.vitalFormControls["bpSystolic"].value &&
      !this.vitalFormControls["bpDiastolic"].value &&
      !this.vitalFormControls["pulse"].value &&
      !this.vitalFormControls["respiration"].value &&
      !this.vitalFormControls["temperature"].value
    );
  }
  openSignDialog() {
    const staffsList = [
      {
        id: this.staffDetails && this.staffDetails.staffId,
        value: this.staffDetails && this.staffDetails.staffName,
      },
    ];
    const clientDetails = {
      id:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.patientID,
      value:
        this.patientAppointmentDetails &&
        this.patientAppointmentDetails.patientName,
    };
    const modalPopup = this.signDailog.open(SignDialogComponent, {
      hasBackdrop: true,
      data: {
        staffsList,
        clientDetails,
        SignatoryLists: ["Employee", "Client", "Guardian"],
      },
    });

    modalPopup.afterClosed().subscribe((result) => {
      if (result) {
        switch ((result.Signatory || "").toUpperCase()) {
          case "EMPLOYEE":
            this.employeeSign = {
              ...this.employeeSign,
              date: format(new Date(), "yyyy-MM-ddTHH:mm:ss"),
              name: result.name,
              bytes: (result.bytes || "").split(",")[1],
            };
            this.saveSignature(
              this.employeeSign.id,
              this.employeeSign,
              null,
              null
            );
            break;
          case "CLIENT":
            this.patientSign = {
              ...this.patientSign,
              date: format(new Date(), "yyyy-MM-ddTHH:mm:ss"),
              name: result.name,
              bytes: (result.bytes || "").split(",")[1],
            };
            this.saveSignature(
              this.patientSign.id,
              null,
              this.patientSign,
              null
            );
            break;
          case "GUARDIAN":
            this.guardianSign = {
              ...this.guardianSign,
              date: format(new Date(), "yyyy-MM-ddTHH:mm:ss"),
              name: result.name,
              bytes: (result.bytes || "").split(",")[1],
            };
            this.saveSignature(
              this.guardianSign.id,
              null,
              null,
              this.guardianSign
            );
            break;
        }
      }
    });
  }
  onSubmitTemplate(event: any) {
    // debugger;
    const jsonData = {
      id: 0,
      templateData: JSON.stringify(event),
      masterTemplateId: this.templateFormId,
      patientEncounterId: this.encounterId,
    };
    let postData: Array<any> = [];
    postData.push(jsonData);

    this.isSubmitted = true;

    this.onSubmit(postData);
  }

  get addFormControls() {
    return this.medicationAddForm.controls;
  }
  getMasterData() {
    let data = "FREQUENCYTYPE";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterFrequencyType =
          response.masterFrequencyType != null
            ? response.masterFrequencyType
            : [];
      }
    });
  }

  getMedicationByAppointmentId() {
    this.clientService
      .getmedicationByAppointmentId(this.appointmentId)
      .subscribe((response: any) => {
        if (response != null) {
          console.log("getmedicationByAppointmentId", response);
          this.medicationModel = response.data != null ? response.data : [];
          this.medicationAddForm = this.formBuilder.group({
            id: [this.medicationModel.id],
            patientId: this.patientId,
            dose: [this.medicationModel.dose],
            endDate: [this.medicationModel.endDate],
            frequencyID: [this.medicationModel.frequencyID],
            medicine: [this.medicationModel.medicine],
            startDate: [this.medicationModel.startDate],
            strength: [this.medicationModel.strength],
          });
        }
      });
  }

  getVitalByAppointmentId() {
    this.clientService
      .getVitalByAppointmentId(this.appointmentId)
      .subscribe((response: any) => {
        if (response != null) {
          console.log("getVitalByAppointmentId", response);
          this.vitalModel = response.data != null ? response.data : [];

          this.vitalForm = this.formBuilder.group({
            id: [this.vitalModel.id],
            patientID: [this.vitalModel.patientID],
            bmi: [this.vitalModel.bmi],
            bpDiastolic: [
              this.vitalModel.bpDiastolic,
              {
                asyncValidators: [this.validateBpdystolic.bind(this)],
              },
            ],
            bpSystolic: [
              this.vitalModel.bpSystolic,
              {
                asyncValidators: [this.validateBpsystolic.bind(this)],
              },
            ],
            heartRate: [
              this.vitalModel.heartRate,
              {
                asyncValidators: [this.validateHeartRate.bind(this)],
              },
            ],
            heightIn: [
              this.vitalModel.heightIn,
              {
                asyncValidators: [this.validateHeight.bind(this)],
              },
            ],
            pulse: [
              this.vitalModel.pulse,
              {
                asyncValidators: [this.validatePulse.bind(this)],
              },
            ],
            respiration: [
              this.vitalModel.respiration,
              {
                asyncValidators: [this.validateRespiration.bind(this)],
              },
            ],
            temperature: [
              this.vitalModel.temperature,
              {
                asyncValidators: [this.validateTemperature.bind(this)],
              },
            ],
            vitalDate: [this.vitalModel.vitalDate],
            weightLbs: [
              this.vitalModel.weightLbs,
              {
                asyncValidators: [this.validateWeight.bind(this)],
              },
            ],
          });
        }
      });
  }
  onSubmitMedicationForm(event: any) {
    if (!this.medicationAddForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submittedMedicationForm = true;
      this.medicationModel = this.medicationAddForm.value;
      this.medicationModel.patientId = this.patientId;
      this.medicationModel.appointmentId = this.appointmentId;
      this.clientService
        .createMedication(this.medicationModel)
        .subscribe((response: any) => {
          this.submittedMedicationForm = false;
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }
  onSubmit(formioData: any):any {
    //  debugger
    if (this.soapForm.invalid) {
      return null;
    }
    const postData = {
      PatientAppointmentId: this.appointmentId,
      PatientEncounterTemplate: formioData,
    };
    console.log("onSubmit postData:", postData); // Debugging log
    this.savePatientEncounter(postData);
    return
  }

  get formControlsPatientNotes() {
    return this.patientencounternotesForm.controls;
  }

  getCheckInNotesByAppointmentID(id: any) {
    this.encounterService.getCheckInNotesByAppointmentID(id).subscribe(
      (res) => {
        this.patientNotesForm.encounternotes = res.data.encounterNotes;
        this.ICDName = res.data.descriptions;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onSubmitPatientNotes(event: any) {
    let clickType = event.currentTarget.name;
    this.patientencounternotesmodel = new PatientEncounterNotesModel();
    this.patientencounternotesmodel.patientID = this.clientId;
    this.patientencounternotesmodel.StaffId = this.staffDetails.staffId;
    this.patientencounternotesmodel.AppointmentID = this.appointmentId;
    this.patientencounternotesmodel.encounterNotes =
      this.patientNotesForm.encounternotes;
    this.encounterService
      .savePatientEncounterNotes(this.patientencounternotesmodel)
      .subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.patientNotesForm.encounternotes = response.data.encounterNotes;
          this.notifier.notify("success", response.message);
          this.getSoapNoteICDPatientPlanByAppId();
        } else {
          this.notifier.notify("error", response.message);
        }
      });
    //}
  }
  getAppConfigurations() {
    this.encounterService.getAppConfigurations().subscribe((response) => {
      if (response.statusCode == 200) {
        this.appConfiguration = response.data || [];
      } else {
        this.appConfiguration = [];
      }
      this.checkIsRequiredSigned();
    });
  }

  getPatientEncounterDetails() {
    this.encounterService
      .GetPatientEncounterDetails(this.appointmentId, this.encounterId, false)
      .subscribe(async (response) => {
        console.log(response);
        if (response.statusCode == 200) {
          this.patientEncounterDiagnosisCodes =
            response.data.patientEncounterDiagnosisCodes || [];
          this.patientEncounterServiceCodes =
            response.data.patientEncounterServiceCodes || [];

          let patientDetails = await this.getClientById(
            response.data.patientAppointment.patientID
          );
          this.encrytPatientId = this.commonService.encryptValue(
            response.data.patientAppointment.patientID,
            true
          );

          this.encrytPatientUserId = this.commonService.encryptValue(
            patientDetails.data.userID,
            true
          );

          this.encryptedAppointmentId = this.commonService.encryptValue(
            this.appointmentId,
            true
          );
          this.patientAppointmentDetails =
            response.data.patientAppointment || [];
          this.clientId =
            this.patientAppointmentDetails &&
            this.patientAppointmentDetails.patientID;

          this.appointmentMode = this.patientAppointmentDetails.mode;

          if (
            new Date(this.patientAppointmentDetails.endDateTime) < new Date()
          ) {
            this.isEnded = true;
          } else if (
            new Date(this.patientAppointmentDetails.startDateTime) < new Date()
          ) {
            this.isStarted = true;
            this.isShowTimer = false;
          } else {
            this.isShowTimer = true;
          }

          this.soapNotes = response.data.soapNotes || null;
          this.encounterSignature = response.data.encounterSignature || [];
          this.unitsConsumed = response.data.unitsConsumed;
          this.patientEncounterTemplate =
            response.data.patientEncounterTemplate || [];

          this.isSoapCompleted =
            (response.data.status || "").toUpperCase() == "RENDERED";
          this.istelehealthappt =
            this.patientAppointmentDetails.isTelehealthAppointment;
          this.filterDetails();
          this.loadChild("Letter Template");
        } else {
          this.patientEncounterDiagnosisCodes = [];
          this.patientEncounterServiceCodes = [];
          this.patientAppointmentDetails = null;
          this.soapNotes = null;
          this.encounterSignature = [];
          this.unitsConsumed = 0;
          this.isSoapCompleted = false;
        }
        if (this.encounterId) {
          this.getTemplateForm(this.templateFormId);
        }
      });
  }

  async getClientById(patientId: any) {
    return this.clientService.getClientById(patientId).toPromise();
  }

  filterDetails() {
    if (this.patientAppointmentDetails) {
      const { appointmentStaffs, endDateTime, startDateTime } =
        this.patientAppointmentDetails;
      if (appointmentStaffs && appointmentStaffs.length) {
        this.staffDetails = appointmentStaffs[0];
      }
      this.appointmentStartTime = `${format(startDateTime, "hh:mm a")}`;
      this.appointmentEndTime = `${format(endDateTime, "hh:mm a")}`;

      if (this.patientAppointmentDetails.patientID)
        this.getClientHeaderInfo(this.patientAppointmentDetails.patientID);
    }

    if (this.soapNotes) {
      this.soapForm.patchValue({ ...this.soapNotes });
    }

    if (this.encounterSignature && this.encounterSignature.length) {
      this.encounterSignature.forEach((signObj) => {
        if (signObj.guardianSign) {
          let data = {
            id: signObj.id,
            bytes: signObj.guardianSign,
            date: signObj.guardianSignDate,
            name: signObj.guardianName,
          };
          this.isGuardianSigned = true;
          this.guardianSign = data;
        }
        if (signObj.patientSign) {
          let data = {
            id: signObj.id,
            bytes: signObj.patientSign,
            date: signObj.patientSignDate,
            name:
              this.patientAppointmentDetails &&
              this.patientAppointmentDetails.patientName,
          };
          this.isClientSigned = true;
          this.patientSign = data;
        }
        if (signObj.clinicianSign) {
          let data = {
            id: signObj.id,
            bytes: signObj.clinicianSign,
            date: signObj.clinicianSignDate,
            name: this.staffDetails && this.staffDetails.staffName,
          };
          this.isEmployeeSigned = true;
          this.employeeSign = data;
        }
      });
    }
    this.checkIsRequiredSigned();
    this.getSoapNoteICDPatientPlanByAppId();
  }

  savePatientEncounter(postData: any, isAdmin: boolean = false) {
    // debugger
    console.log("4 savepatientencounter called from soap component", postData);
    var model = {
      id: this.patientEncounterDetails.patientEncounterTemplateId,
      patientAppointmentId: postData.PatientAppointmentId,
      masterTemplateId: postData.PatientEncounterTemplate[0].masterTemplateId,
      templateData: postData.PatientEncounterTemplate[0].templateData,
    };
    this.submitted = true;
    this.encounterService
      .SavePatientAppointmentEncounters(model, isAdmin)
      .subscribe((response) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifierService.notify("success", response.message);
          //this.getSoapNoteICDPatientPlanByAppId();
          //  debugger
          if (!this.encounterId) {
            this.encounterId = response.data.id || 0;
            const soapnotesData = {
              id: response.data.patientEncounterTemplate[0].id,
              appointmentId: this.appointmentId,
              encounterId: response.data.id,
              masterTemplateId:
                response.data.patientEncounterTemplate[0].masterTemplateId,
              templateData:
                response.data.patientEncounterTemplate[0].templateData,
            };
            this.encounterId = response.data.id;
            localStorage.setItem(
              "soapnotesData",
              JSON.stringify(soapnotesData)
            );
            console.log("Updated soapnotesData:", soapnotesData); // Debugging log

            // this.router.navigate(["/web/encounter/soap"], {
            //   queryParams: {
            //     apptId: this.appointmentId,
            //     encId: this.encounterId,
            //   },
            // });
            //this.router.navigate(["/web/waiting-room/" + this.appointmentId]);
            //  this.router.navigate(["/web/waiting-room/"+this.appointmentId]);
          } else {
            this.isSoapCompleted = true;
            let isPatient: boolean = false;
            this.commonService.isPatient.subscribe((isPatient) => {
              // if (!isPatient) this.router.navigate(["/web/scheduling"]);
              // else this.router.navigate(["/web/client/my-scheduling"]);
              if (!isPatient) {
                this.checkAndNavigate("/web/scheduling");
              } else if (response.data.id) {
                this.router.navigate([
                  "/web/waiting-room/" + this.appointmentId,
                ]);
              } else {
                this.router.navigate(["/web/client/my-scheduling"]);
              }
            });
            //this.createClaim(this.encounterId);
          }
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

  checkAndNavigate(route: string): void {
    if (this.router.config.some((r) => r.path === route)) {
      this.router.navigate([route]).then((data) => {
        console.log("Route exists, redirection is done");
      });
    } else {
      this.router.navigate([
        "/web/waiting-room/check-in-soap/" + this.appointmentId,
      ]);
      console.log("Route not found, redirection stopped with no error raised");
    }
  }

  saveSignature(id = 0, employeeSign: any, patientSign: any, guradianSign: any) {
    let postData = {
      id: id,
      patientEncounterId: this.encounterId,
      patientId: patientSign
        ? this.patientAppointmentDetails &&
        this.patientAppointmentDetails.patientID
        : null,
      patientSign: patientSign ? patientSign.bytes : null,
      patientSignDate: patientSign ? patientSign.date : null,
      staffId: employeeSign
        ? this.staffDetails && this.staffDetails.staffId
        : null,
      clinicianSign: employeeSign ? employeeSign.bytes : null,
      clinicianSignDate: employeeSign ? employeeSign.date : null,
      guardianName: guradianSign ? guradianSign.name : null,
      guardianSign: guradianSign ? guradianSign.bytes : null,
      guardianSignDate: guradianSign ? guradianSign.date : null,
    };
    this.submittedSign = true;
    this.encounterService
      .saveEncounterSignature(postData)
      .subscribe((response) => {
        this.submittedSign = false;
        if (response.statusCode == 200) {
          this.notifierService.notify("success", response.message);
          let signObj = response.data;
          if (signObj.guardianSign) {
            this.guardianSign = {
              ...this.guardianSign,
              id: signObj.id,
            };
            this.isGuardianSigned = true;
          }
          if (signObj.patientSign) {
            this.patientSign = {
              ...this.patientSign,
              id: signObj.id,
            };
            this.isClientSigned = true;
          }
          if (signObj.clinicianSign) {
            this.employeeSign = {
              ...this.employeeSign,
              id: signObj.id,
            };
            this.isEmployeeSigned = true;
          }
          this.checkIsRequiredSigned();
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

  createClaim(encounterId: number, isAdmin: boolean = false) {
    this.encounterService
      .createClaim(encounterId, isAdmin)
      .subscribe((response) => {
        if (response.statusCode == 1) {
          this.notifierService.notify("success", response.message);
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

  getClientHeaderInfo(patientID: number) {
    this.encounterService
      .getClientHeaderInfo(patientID)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 200) {
          this.clientHeaderModel = response.data;
          this.patientId =
            this.clientHeaderModel.patientBasicHeaderInfo.patientID;
          //  console.log("Client header model", this.clientHeaderModel);
          this.clientHeaderModel.patientBasicHeaderInfo.dob = format(
            new Date(this.clientHeaderModel.patientBasicHeaderInfo.dob),
            'MM/dd/yyyy'
          );
        }
      });
  }

  getMasterTemplates() {
    console.log("UserId in Mastertempates", this.appointmentId);
    this.encounterService
      .getMasterTemplates(this.appointmentId)
      .subscribe((response) => {
        if (response.statusCode == 200) this.masterTemplates = response.data;
        this.masterTemplates = response.data.filter(
          (x: { templateCategoryName: string; }) => x.templateCategoryName.toLowerCase() == "soap"
          //  ||
          //   x.templateCategoryName.toLowerCase() == "survey"
        );
      });
  }

  GetMasterTemplateListByProvider() {
    this.encounterService
      .getMasterTemplates(this.appointmentId)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.MasterTemplateListByProvider = response.data;
          this.MasterTemplateListByProvider = response.data.filter(
            (x: { templateCategoryName: string; }) => x.templateCategoryName.toLowerCase() == "survey"
            //  ||
            //   x.templateCategoryName.toLowerCase() == "survey"
          );
        }
      });
  }

  onMastertemplateSelect(event: any) {
    this.templateIdFromDD = event.value;
  }
  getTemplateForm(event: any) {
    //  debugger
    const masterTempIdData = this.masterTemplates.filter(
      (ele) => ele.id == event.value
    );
    this.patientEncounterDetails = masterTempIdData[0];
    let formJson:any = { components: [] },
      formData = { data: {} };
    formJson = JSON.parse(masterTempIdData[0].templateJson);
    formData = masterTempIdData[0].templateData
      ? JSON.parse(masterTempIdData[0].templateData)
      : { data: {} };

    formJson.components.map((ele: any) => {
      if (formData.data.hasOwnProperty(ele.key)) {
        ele.value = formData.data[ele.key as keyof typeof formData.data];
      }
    });

    console.log({ formJson, formData });

    // Update component properties
    this.jsonFormData = formJson;
    this.initialFormValues = { data: formData.data };
  }

  // testing the method
  getTemplateFormForProvider(id: number, panelId: number) {
    this.encounterService
      .getTemplateForm(this.appointmentId, id)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.showFormioDiv = true;
          // this.openTemplateForm(response.data, id);
          let formJson:any = { components: [] },
            formData = { data: {} };
          try {
            formJson = JSON.parse(response.data.templateJson);
            formData = JSON.parse(response.data.templateData);
          } catch (err) { }

          this.encounterTemplateId = response.data.id || null;
          
          // this.jsonFormDataProvider[panelId] = response.data.templateJson
          //   ? formJson
          //   : this.jsonFormData;
          // this.templateFormName = response.data.templateName || "";
          // this.initialFormValuesProvider[panelId] = response.data.templateData
          //   ? formData
          //   : this.initialFormValuesProvider[panelId];
          this.templateFormId = id;
          //this.encounterId = data.encounterId;
          // this.encounterTemplateId = response.data.id || null;
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }
  onStartVideoEncounterClick() {
    console.log("5 onstartvideoencounterclick called from soap component");
    this.router.navigate(["/web/encounter/video-encounter"], {
      queryParams: {
        templateIdFromDD: this.templateIdFromDD,
        encounterId: this.encounterId,
        appointmentId: this.appointmentId,
      },
    });
  }
  openTemplateForm(jsonFormData: any, templateId: number) {
    const modalPopup = this.signDailog.open(TemplateFormComponent, {
      hasBackdrop: true,
      data: {
        templateId,
        encounterId: this.encounterId,
        ...jsonFormData,
      },
    });

    modalPopup.afterClosed().subscribe((result) => {
      if (result) {
        this.encounterService.saveTemplateData(result).subscribe((response) => {
          if (response.statusCode == 200) {
            this.notifierService.notify("success", response.message);
          } else {
            this.notifierService.notify("error", response.message);
          }
        });
      }
    });
  }
  PrintSOAP = () => {
    console.log("print");
  };
  getPreviousEncounters(patientId: any, fromDate: any, toDate: any) {
    this.encounterService
      .getPreviousEncounters(patientId, fromDate, toDate)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.previousEncounters = response.data;
          this.previousEncounterId = response.data.id;
          this.previousEncounters = (response.data || []).map((obj: any) => {
            obj.dateOfService = format(obj.dateOfService, "MM/DD/yyyy hh:mm a");
            return obj;
          });
        } else {
          this.previousEncounters = [];
        }
      });
  }
  getSelectedPreviousEncountersData(event: any) {
    this.previousEncounterId = event;
    this.encounterService
      .getPreviousEncountersData(this.previousEncounterId)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          //this.previousEncounters=response.data;
          if (response.statusCode == 200) {
            this.isPreviousEncounter = true;
            this.encounterId = 0;
            this.soapNotes = response.data.soapNotes || null;
            this.patientEncounterTemplate =
              response.data.patientEncounterTemplate || [];
            this.templateFormId =
              (response.data.patientEncounterTemplate &&
                response.data.patientEncounterTemplate[0].masterTemplateId) ||
              0;
            // this.filterDetails();
          } else {
            this.soapNotes = null;
            this.unitsConsumed = 0;
            this.isSoapCompleted = false;
          }
          if (this.previousEncounterId) {
            this.getTemplateForm(this.templateFormId);
          }
        }
      });
  }
  onResizing(event: ResizeEvent | any): any {
    const perValue =
      (event.rectangle.width * 100) / document.documentElement.clientWidth;
    if (perValue > 70 || perValue < 20) {
      return false;
    }
    this.renderer.setStyle(this.panel.nativeElement, "width", `${perValue}%`);
    // let SOAPPanel = this.encounterService.SOAPPanelRef;
    // if (this.SOAPPanel)
    //   this.renderer.setStyle(this.SOAPPanel.nativeElement, 'margin-right', `${event.rectangle.width}px`)
  }
  onDragChat(event: any) {
    let bottom = this.panel.nativeElement.style.bottom,
      right = this.panel.nativeElement.style.right;

    (bottom = bottom.replace("px", "")), (right = right.replace("px", ""));
    (bottom = (parseInt(bottom) || 0) + -event.y),
      (right = (parseInt(right) || 0) + -event.x);
    this.renderer.setStyle(this.panel.nativeElement, "bottom", `${bottom}px`);
    this.renderer.setStyle(this.panel.nativeElement, "right", `${right}px`);
  }
  // onValidateResize(event: ResizeEvent): boolean {
  //   let perValue = (event.rectangle.width * 100) / document.documentElement.clientWidth;
  //   if (perValue > 70 || perValue < 20) {
  //     return false;
  //   }
  //   return true;
  // }
  onValidateResize(event: ResizeEvent): boolean {
    // let perValue = (event.rectangle.width * 100) / document.documentElement.clientWidth;
    // const MIN_DIMENSIONS_PX: number = 50;
    // if (
    //   event.rectangle.width &&
    //   event.rectangle.height &&
    //   (event.rectangle.width < MIN_DIMENSIONS_PX ||
    //     event.rectangle.height < MIN_DIMENSIONS_PX) && (perValue > 70 || perValue < 20)
    // ) {
    //   return false;
    // }
    return true;
  }
  onResizeEnd(event: ResizeEvent): void {
    this.style = {
      position: "fixed",
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
      // bottom: `${event.rectangle.bottom}px`,
      // right: `${event.rectangle.right}px`,
    };
  }

  onResizingVideo(event: ResizeEvent | any): any {
    const perValue =
      (event.rectangle.width * 100) / document.documentElement.clientWidth;
    if (perValue > 70 || perValue < 20) {
      return false;
    }
    this.renderer.setStyle(
      this.panelVideo.nativeElement,
      "width",
      `${perValue}%`
    );
    // let SOAPPanel = this.encounterService.SOAPPanelRef;
    // if (this.SOAPPanel)
    //   this.renderer.setStyle(this.SOAPPanel.nativeElement, 'margin-right', `${event.rectangle.width}px`)
  }
  onDragVideo(event: any) {
    let bottom = this.panelVideo.nativeElement.style.bottom,
      right = this.panelVideo.nativeElement.style.right;

    (bottom = bottom.replace("px", "")), (right = right.replace("px", ""));
    (bottom = (parseInt(bottom) || 0) + -event.y),
      (right = (parseInt(right) || 0) + -event.x);
    this.renderer.setStyle(
      this.panelVideo.nativeElement,
      "bottom",
      `${bottom}px`
    );
    this.renderer.setStyle(
      this.panelVideo.nativeElement,
      "right",
      `${right}px`
    );
  }
  // onValidateResize(event: ResizeEvent): boolean {
  //   let perValue = (event.rectangle.width * 100) / document.documentElement.clientWidth;
  //   if (perValue > 70 || perValue < 20) {
  //     return false;
  //   }
  //   return true;
  // }
  onValidateResizeVideo(event: ResizeEvent): boolean {
    // let perValue = (event.rectangle.width * 100) / document.documentElement.clientWidth;
    // const MIN_DIMENSIONS_PX: number = 50;
    // if (
    //   event.rectangle.width &&
    //   event.rectangle.height &&
    //   (event.rectangle.width < MIN_DIMENSIONS_PX ||
    //     event.rectangle.height < MIN_DIMENSIONS_PX) && (perValue > 70 || perValue < 20)
    // ) {
    //   return false;
    // }
    return true;
  }
  onResizeVideoEnd(event: ResizeEvent): void {
    this.styleVideo = {
      position: "fixed",
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
      // bottom: `${event.rectangle.bottom}px`,
      // right: `${event.rectangle.right}px`,
    };
  }
  openDiagnosisDialog(id?: number) {
    if (id != null && id > 0) {
      this.diagnosisService.getDiagnosisById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.diagnosisModel = response.data;
          this.createDiagnosisModal(this.diagnosisModel);
        }
      });
    } else {
      this.diagnosisModel = new DiagnosisModel();
      this.createDiagnosisModal(this.diagnosisModel);
    }
  }

  createDiagnosisModal(diagnosisModel: DiagnosisModel) {
    this.diagnosisModel.patientID = this.clientId;
    let diagnosisModal;
    diagnosisModal = this.diagnosisDialogModal.open(DiagnosisModalComponent, {
      data: {
        diagnosis: diagnosisModel,
        refreshGrid: this.refreshGrid.bind(this),
      },
    });
    diagnosisModal.afterClosed().subscribe((result: string) => {
      if (result == "save") this.getDiagnosisList();
    });
  }
  refreshGrid() {
    this.getDiagnosisList();
  }

  deleteDiagnosisCode(id: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this diagnosis?")
      .subscribe((result: any) => {
        if (result == true) {
          this.diagnosisService
            .deleteDiagnosis(id)
            .subscribe((response: any) => {
              if (response != null && response.data != null) {
                if (response.statusCode == 200) {
                  this.notifierService.notify("success", response.message);
                  this.getDiagnosisList();
                } else {
                  this.notifierService.notify("error", response.message);
                }
              }
            });
        }
      });
  }
  getDiagnosisList() {
    this.diagnosisService
      .getSoapNoteDiagnosisList(this.clientId)
      .subscribe((response: ResponseModel) => {
        if (
          response != null &&
          response.data != null &&
          response.data.length > 0
        ) {
          this.patientEncounterDiagnosisCodes = response.data;
          //this.diagnosisList = response.data;
        }
      });
  }

  // openServiceDialog(id?: number) {
  //   if (id != null && id > 0) {
  //     this.clientsService.getDiagnosisById(id).subscribe((response: any) => {
  //       if (response != null && response.data != null) {
  //         this.diagnosisModel = response.data;
  //         this.createServiceModal(this.diagnosisModel);
  //       }
  //     });
  //   } else {
  //     this.diagnosisModel = new DiagnosisModel();
  //     this.createServiceModal(this.diagnosisModel);
  //   }
  // }

  // createServiceModal(diagnosisModel: DiagnosisModel) {
  //   this.diagnosisModel.patientID = this.clientId;
  //   let diagnosisModal;
  //   // diagnosisModal = this.diagnosisDialogModal.open(DiagnosisModalComponent, {
  //   //   data: {
  //   //     diagnosis: diagnosisModel,
  //   //     refreshGrid: this.refreshServiceGrid.bind(this)
  //   //   }
  //   // });
  //   // diagnosisModal.afterClosed().subscribe((result: string) => {
  //   //   if (result == "save") this.getServiceList();
  //   // });
  // }
  // refreshServiceGrid() {
  //   this.getServiceList();
  // }

  // deleteServiceCode(id: number) {
  //   this.dialogService
  //     .confirm("Are you sure you want to delete this diagnosis?")
  //     .subscribe((result: any) => {
  //       if (result == true) {
  //         this.clientsService.deleteDiagnosis(id).subscribe((response: any) => {
  //           if (response != null && response.data != null) {
  //             if (response.statusCode == 200) {
  //               this.notifierService.notify("success", response.message);
  //               this.getServiceList();
  //             } else {
  //               this.notifierService.notify("error", response.message);
  //             }
  //           }
  //         });
  //       }
  //     });
  // }
  // getServiceList() {
  //   this.clientsService
  //     .getSoapNoteDiagnosisList(this.clientId)
  //     .subscribe((response: ResponseModel) => {
  //       if (
  //         response != null &&
  //         response.data != null &&
  //         response.data.length > 0
  //       ) {
  //         this.patientEncounterDiagnosisCodes = response.data;
  //         //this.diagnosisList = response.data;
  //       }
  //     });
  // }
  openServiceDialog(id?: number): void {
    this.serviceCodeModal = {
      id: id || 0,
    };
    if (!this.serviceCodeModal.id) {
      this.createServiceModel(this.serviceCodeModal);
    }
  }
  createServiceModel(serviceCodeModal: ServiceCodeModal) {
    const serviceCodeModalPopup = this.serviceCodeDailog.open(
      AddServiceCodeModalComponent,
      {
        hasBackdrop: true,
        data: {
          serviceCodeModal: serviceCodeModal || new ServiceCodeModal(),
          refreshGrid: this.refreshServiceGrid.bind(this),
        },
      }
    );
    serviceCodeModalPopup.afterClosed().subscribe((result) => {
      // if (result === 'SAVE')
      //   this.getServiceCodeListData()
    });
  }
  refreshServiceGrid(data: any) {
    let ServiceCodes: string;
    this.patientEncounterServiceCodes.push(data);
    ServiceCodes = this.patientEncounterServiceCodes
      .map((obj) => obj.serviceCodeId)
      .toString();

    this.encounterService
      .CheckServiceCodeAvailability(this.appointmentId, ServiceCodes)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          return this.notifierService.notify("success", response.message);
        } else {
          this.patientEncounterServiceCodes;
          if (this.patientEncounterServiceCodes.length > 0) {
            this.patientEncounterServiceCodes.splice(
              this.patientEncounterServiceCodes.length - 1,
              1
            );
          }
          return this.notifierService.notify("warning", response.message);
        }
      });
  }
  deleteCPTCode(id: number) {
    this.patientEncounterServiceCodes.splice(id, 1);
  }

  openPatientEncounterNotesDialog(id?: number) {
    this.patientencounternotesmodel = new PatientEncounterNotesModel();
    this.createPatientEncounterNotesModal(this.patientencounternotesmodel);

    // if (id != null && id > 0) {
    //   this.encounterService.getDiagnosisById(id).subscribe((response: any) => {
    //     if (response != null && response.data != null) {
    //       this.diagnosisModel = response.data;
    //       this.createDiagnosisModal(this.diagnosisModel);
    //     }
    //   });
    // } else {
    //   this.diagnosisModel = new DiagnosisModel();
    //   this.createDiagnosisModal(this.diagnosisModel);
    // }
  }

  createPatientEncounterNotesModal(
    patientencounternotesmodel: PatientEncounterNotesModel
  ) {
    //this.patientencounternotesmodel.patientID = this.clientId;
    (this.patientencounternotesmodel.patientID = this.clientId),
      (this.patientencounternotesmodel.StaffId = this.staffDetails.staffId),
      (this.patientencounternotesmodel.AppointmentID = this.appointmentId);
    let patientencounternotesModal;
    patientencounternotesModal = this.patientencounternotesDialogModal.open(
      PatientEncounterNotesModalComponent,
      {
        data: {
          patientencounternote: patientencounternotesmodel,
          //refreshGrid: this.refreshGrid.bind(this),
        },
      }
    );
    patientencounternotesModal.afterClosed().subscribe((result: string) => {
      //if (result == "save")
      //this.getDiagnosisList();
    });
  }

  getUserDocuments() {
    if (this.appointmentId != null) {
      // this.fromDate =
      //   this.fromDate == null
      //     ? "1990-01-01"
      //     : format(this.fromDate, "yyyy-MM-dd");
      // this.toDate =
      //   this.toDate == null
      //     ? format(this.todayDate, "yyyy-MM-dd")
      //     : format(this.toDate, "yyyy-MM-dd");
      this.clientService
        .getPateintApptDocuments(this.appointmentId)
        .subscribe((response: ResponseModel) => {
          if (response != null) {
            this.documentList =
              response.data != null && response.data.length > 0
                ? response.data
                : [];
          }
        });
    }
  }

  getUserDocument(value: UserDocumentModel) {
    // this.clientService.getUserDocument(value.id).subscribe((response: any) => {
    //   this.clientService.downloadFile(response, response.type, value.url);
    // });
    let key;
    if (value.key.toLowerCase() === "refferal") {
      key = "refferal";
    } else {
      key = "userdoc";
    }
    this.clientService
      .getDocumentForDownlod(value.id, key)
      .subscribe((response: any) => {
        console.log(response);
        if (response.statusCode == 200) {
          var fileType = "";
          switch (response.data.extenstion) {
            case ".png":
              fileType = "image/png";
              break;
            case ".gif":
              fileType = "image/gif";
              break;
            case ".pdf":
              fileType = "application/pdf";
              break;
            case ".jpeg":
              fileType = "image/jpeg";
              break;
            case ".jpg":
              fileType = "image/jpeg";
              break;
            case ".xls":
              fileType = "application/vnd.ms-excel";
              break;
            default:
              fileType = "";
          }
          var binaryString = atob(response.data.base64);
          var bytes = new Uint8Array(binaryString.length);
          for (var i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          var newBlob = new Blob([bytes], {
            type: fileType,
          });

          this.clientService.downloadFile(
            newBlob,
            fileType,
            response.data.fileName
          );
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }
  onSubmitVitalForm(event: any) {
    if (!this.vitalForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.vitalModel = this.vitalForm.value;
      this.vitalModel.patientID = this.patientId;
      this.vitalModel.appointmentId = this.appointmentId;
      this.clientService
        .createVital(this.vitalModel)
        .subscribe((response: any) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.disabledVitalForm = true;
            this.notifier.notify("success", response.message);
            //if (clickType == "Save")
            // this.closeDialog('save');
            //else if (clickType == "SaveAddMore") {
            //this.refreshGrid.next();
            //this.vitalForm.reset();
            //}
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }
  deleteUserDocument(id: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this document?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deleteUserDocument(id)
            .subscribe((response: ResponseModel) => {
              if (response.statusCode == 200) {
                this.notifier.notify("success", response.message);
                this.getUserDocuments();
              } else {
                this.notifier.notify("error", response.message);
              }
            });
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
  validatePulse(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var pulse = ctrl.value;

        if (pulse >= 101) resolve({ pulse: true });
        else resolve(null);
      }
    });
  }
  validateBpdystolic(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var dystolic = ctrl.value;

        if (dystolic >= 141) resolve({ dystolic: true });
        else resolve(null);
      }
    });
  }
  validateRespiration(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var respiration = ctrl.value;

        if (respiration >= 101) resolve({ respiration: true });
        else resolve(null);
      }
    });
  }
  validateTemperature(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var temperature = ctrl.value;

        if (temperature >= 116) resolve({ temperature: true });
        else resolve(null);
      }
    });
  }
  validateHeartRate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var heartrate = ctrl.value;

        if (heartrate >= 201) resolve({ heartrate: true });
        else resolve(null);
      }
    });
  }
  validateBpsystolic(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var bpsytolic = ctrl.value;

        if (bpsytolic >= 281) resolve({ bpsytolic: true });
        else resolve(null);
      }
    });
  }
  validateWeight(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var weight = ctrl.value;

        if (weight >= 1000)
          //this.submitted=false,
          resolve({ weight: true });
        else resolve(null);
      }
    });
  }
  validateHeight(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (!ctrl.dirty && !ctrl.untouched) {
        resolve(null);
      } else {
        var height = ctrl.value;

        if (height >= 256) resolve({ height: true });
        else resolve(null);
      }
    });
  }

  getIcdCodes() {

    this.encounterService.getIcdCodes(0,
      0,
      this.appointmentId
    ).subscribe((res) => {
      if (res != null && res.data != null && res.statusCode == 200) {
        console.log(res) // (soapNoteIdx >= 0) ? false : true;
        this.IcdComment = true;
        this.icdForm.controls['icdComment'].setValue(res.data.descriptions);
        debugger
        this.encounterService.getMasterICDOnSearch(res.data.masterICD.description, 0)
          .subscribe((masterRes) => {
            if (masterRes != null && masterRes.data != null && masterRes.statusCode == 200) {
              //  this.masterICD = new Array(masterRes.data);

              debugger
              const selectedIcd = masterRes.data.find((icd: any) => icd.id === res.data.icdid);
              if (selectedIcd) {
                this.ICDName = selectedIcd.description;
                this.icdForm.controls['icdName'].patchValue(selectedIcd.description);
                this.selectedIcdCode = selectedIcd.id;
              }
            }
          });
      }
    });
  }
  getSoapNoteICDPatientPlanByAppId() {
    this.encounterService
      .getEndSessionValidateData(
        this.clientId,
        this.staffDetails.staffId,
        this.appointmentId
      )
      .subscribe((res) => {
        if (res != null && res.data != null && res.statusCode == 200) {
          this.showEndSessionBtn = res.data; // (soapNoteIdx >= 0) ? false : true;
          //this.icdForm.controls["icdComment"].setValue(res.data.patientDiagnosisICDDetailList[0].descriptions);
          //let selectedIcd=this.masterICD.filter(icd=>icd.id=res.data.patientDiagnosisICDDetailList[0].id);
          //this.ICDName=selectedIcd[0].description;
        }
      });
  }

  enableAllButtons(status: any) {
    this.isShowCheckinBtns = status;
    if (this.isShowCheckinBtns) {
      // this.isStarted = true;
      this.isShowTimer = false;
      //this.call();
    }
  }
}
