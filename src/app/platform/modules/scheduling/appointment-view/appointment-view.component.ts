import { DatePipe } from "@angular/common";
import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Meta } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
//import * as format from "date-fns/format";
import { format } from 'date-fns';
import { AppService } from "src/app/app-service.service";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { ChatInitModel } from "src/app/shared/models/chatModel";
import { TextChatService } from "src/app/shared/text-chat/text-chat.service";
import { ResponseModel } from "src/app/super-admin-portal/core/modals/common-model";
import { ClientsService } from "../../agency-portal/clients/clients.service";
import { EncounterService } from "../../agency-portal/encounter/encounter.service";
import { UserDocumentModel } from "../../agency-portal/users/users.model";
import { Metadata } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { AppointmentModel } from "../scheduler/scheduler.model";
import { SchedulerService } from "../scheduler/scheduler.service";
import { ViewReportComponent } from "./../../../../shared/view-report/view-report.component";
import { ClientHeaderModel } from "../../agency-portal/clients/client-header.model";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-appointment-view",
  templateUrl: "./appointment-view.component.html",
  styleUrls: ["./appointment-view.component.css"],
})
export class AppointmentViewComponent implements OnInit {
  appointment: AppointmentModel = new AppointmentModel;
  appointmentId: number;
  reportId: any;
  appointmentForm!: FormGroup;
  showReport: boolean = false;
  otherAppointments: AppointmentModel[] = [];
  otherAppointmentsPersistence: AppointmentModel[] = [];
  currentLoginUserId: any;
  isAdminLogin = false;
  isProviderLogin = false;
  isClientLogin = false;
  selectedAppointments: number[] = [];
  loading = false;
  isFirstLoad = true;
  isLoadingOtherAppointments = true;
  statusColors: Array<any>;
  documentList: Array<UserDocumentModel> = [];
  isLoadingDocuments = true;
  isEnded: boolean = false;
  isStarted: boolean = false;
  isShowTimer: boolean = false;
  metaData: Metadata;
  allSoapNotes: Array<any> = [];
  patientDiagnosisList: any = [];
  isAppoitmentCompleted: boolean = false;
  displayColumns: Array<any> = [
    {
      displayName: "document_title",
      key: "documentTitle",
      isSort: true,
      class: "",
      width: "15%",
    },
    {
      displayName: "document_type",
      key: "otherDocumentType",
      isSort: true,
      class: "",
      width: "15%",
    },
    {
      displayName: "uploaded_date",
      key: "createdDate",
      isSort: true,
      class: "",
      width: "15%",
    },
    {
      displayName: "expiration_date",
      key: "expiration",
      isSort: true,
      class: "",
      width: "15%",
    },
    // {
    //   displayName: "Extension",
    //   type: "img",
    //   key: "extenstion",
    //   isSort: true,
    //   class: "",
    //   width: "15%",
    // },
  ];
  patientDiagnosisColumns = [
    {
      displayName: "ICD Code",
      key: "code",
    },
    {
      displayName: "Diagnos With",
      key: "diagnosis",
    },
    {
      displayName: "Diagnos Date",
      key: "diagnosisDate",
    },
    {
      displayName: "Doctor Remark",
      key: "descriptions",
    }
  ];
  displaySoapNoteColumns: Array<any> = [
    {
      displayName: "patient_name",
      key: "patientName",
      width: "15%",
    },
    {
      displayName: "Subjective",
      key: "subjective",
      width: "15%",
    },
    {
      displayName: "Objective",
      key: "objective",
      width: "15%",
    },
    {
      displayName: "assessment",
      key: "assessment",
      width: "15%",
    },
    {
      displayName: "Plans",
      key: "plans",
      width: "15%",
    },
  ];
  clientHeaderModel: ClientHeaderModel;
  clientId!: number;
  constructor(
    private formBuilder: FormBuilder,
    private schedulerService: SchedulerService,
    public dialogPopup: MatDialogRef<AppointmentViewComponent>,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogModal: MatDialog,
    private date: DatePipe,
    private clientService: ClientsService,
    private dialogService: DialogService,
    private notifier: NotifierService,
    private router: Router,
    private textChatService: TextChatService,
    private appService: AppService,
    private encounterService: EncounterService,
    private translate: TranslateService,

  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.appointmentId = data;
    this.metaData = new Metadata();
    this.statusColors = [
      { name: "pending", color: "#74d9ff" },
      { name: "approved", color: "#93ee93" },
      { name: "cancelled", color: "#ff8484" },
      { name: "Accepted", color: "rgb(179, 236, 203)" },
      { name: "Tentative", color: "rgb(253, 209, 100)" },
    ];

    this.clientHeaderModel = new ClientHeaderModel();
  }

  ngOnInit() {
    this.initializeFormFields(this.appointment);
    // this.commonService.loadingState.subscribe(
    //   (isloading: boolean) => {
    //     this.loading = isloading;
    //   }
    // );

    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {

        this.currentLoginUserId = user.id;
        this.isAdminLogin =
          user.users3 &&
          user.users3.userRoles &&
          (user.users3.userRoles.userType || "").toUpperCase() == "ADMIN";

        this.isProviderLogin =
          user.users3 &&
          user.users3.userRoles &&
          (user.users3.userRoles.userType || "").toUpperCase() == "PROVIDER";

        this.isClientLogin =
          user.users3 &&
          user.users3.userRoles &&
          (user.users3.userRoles.userType || "").toUpperCase() == "CLIENT";
        this.selectedAppointments = [this.appointmentId];


        console.log(this.isAdminLogin, this.isProviderLogin, this.isClientLogin)
        this.getAppointment(this.appointmentId);


      }
    });

  }

  getClientHeaderInfo() {
    this.clientService.getClientHeaderInfo(this.clientId).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.clientHeaderModel = response.data;
        this.clientHeaderModel.patientBasicHeaderInfo != null ? this.clientHeaderModel.patientBasicHeaderInfo.dob = format(new Date(this.clientHeaderModel.patientBasicHeaderInfo.dob), 'MM/dd/yyyy') : '';
        const userId = this.clientHeaderModel.patientBasicHeaderInfo && this.clientHeaderModel.patientBasicHeaderInfo.userId;
        this.clientService.updateClientNavigations(this.clientId, userId);
      }
    });
  }

  onNavigate() { }


  onNoClick(): void {
    this.dialogPopup.close();
  }

  initializeFormFields(appointment?: AppointmentModel) {
    appointment = appointment || new AppointmentModel();

    const configControls = {
      patientName: [appointment.patientName],
      dob: [
        appointment.patientInfoDetails == null ||
          appointment.patientInfoDetails.patientInfo == null ||
          appointment.patientInfoDetails.patientInfo.length == 0 ||
          !appointment.patientInfoDetails.patientInfo[0].dob
          ? undefined
          : this.toDateTimeString(
            appointment.patientInfoDetails.patientInfo[0].dob,
            true
          ),
      ],
      gender: [
        appointment.patientInfoDetails == null ||
          appointment.patientInfoDetails.patientInfo == null ||
          appointment.patientInfoDetails.patientInfo.length == 0
          ? undefined
          : appointment.patientInfoDetails.patientInfo[0].gender,
      ],
      email: [
        appointment.patientInfoDetails == null ||
          appointment.patientInfoDetails.patientInfo == null ||
          appointment.patientInfoDetails.patientInfo.length == 0
          ? undefined
          : appointment.patientInfoDetails.patientInfo[0].email,
      ],
      phone: [
        appointment.patientInfoDetails == null ||
          appointment.patientInfoDetails.patientInfo == null ||
          appointment.patientInfoDetails.patientInfo.length == 0
          ? undefined
          : appointment.patientInfoDetails.patientInfo[0].phone,
      ],
      patientPhotoThumbnailPath: [appointment.patientPhotoThumbnailPath],
      startDateTime: [
        appointment.startDateTime
          ? this.toDateTimeString(appointment.startDateTime)
          : undefined,
      ],
      endDateTime: [
        appointment.endDateTime
          ? this.toDateTimeString(appointment.endDateTime)
          : undefined,
      ],
      notes: [appointment.notes],
      isTelehealthAppointment: [appointment.isTelehealthAppointment],
      statusName: [appointment.statusName],
      isClientRequired: [appointment.isClientRequired],
      mode: [appointment.mode],
      type: [appointment.type],
      provider: [
        appointment.appointmentStaffs == null ||
          appointment.appointmentStaffs.length == 0
          ? undefined
          : appointment.appointmentStaffs[0].staffName,
      ],
    };
    this.appointmentForm = this.formBuilder.group(configControls);
    this.appointmentForm.disable();
  }

  get f() {
    return this.appointmentForm.controls;
  }

  showInfermedicaReport() {
    const modalPopup = this.dialogModal.open(ViewReportComponent, {
      hasBackdrop: true,
      data: this.reportId,
    });

    modalPopup.afterClosed().subscribe((result) => { });
  }
  isApproved: boolean = false;
  getAppointment(appointmentId: number) {

    this.getUserDocuments(appointmentId);
    this.loading = true;
    this.schedulerService
      .getAppointmentDetailsWithPatient(appointmentId)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          //////debugger;
          this.appointment = response.data;
          debugger
          console.log(this.appointment, "appoitment");
          this.isAppoitmentCompleted = response.data.statusName === "Completed" ? true : false;
          this.clientId = response.data.patientID;
          this.getClientHeaderInfo();
          this.getSoapNotes();
          if (new Date(this.appointment.endDateTime) < new Date()) {
            this.isEnded = true;
          } else if (new Date(this.appointment.startDateTime) < new Date()) {
            this.isStarted = true;
          } else {
            this.isShowTimer = true;
          }
          if (this.appointment.statusName == "Pending") this.isApproved = false;
          else this.isApproved = true;

          if (response.data.reportId > 0) {
            this.showReport = true;
            this.reportId = response.data.reportId;
          }
          this.initializeFormFields(this.appointment);
          this.loading = false;
          if (this.isFirstLoad) {
            this.getAllAppointments(this.appointment.patientID);
            this.getPatientPreviousDiagnosis();
          } else {
            if (
              this.otherAppointmentsPersistence &&
              this.otherAppointmentsPersistence.length > 1
            ) {
              this.filterOtherAppointments(appointmentId);
            }
          }
        }
      });
  }
  goToProfile = () => {
    this.dialogPopup.close(this.appointment.patientID);

    // this.router.navigate(["web/client/profile"], {
    //   queryParams: {
    //     id: this.commonService.encryptValue(this.appointment.patientID, true),
    //   },
    // });
  };



  getSoapNotes = () => {
    this.encounterService
      .GetSoapNotesByPatientId(this.appointment.patientID)
      .subscribe((res) => {
        if (res.data != null) {
          
          res.data.forEach((element:any)=> {
            if (element.objective != null || element.subjective) {
              element.objective = element.objective.substring(0, 50)
              element.subjective = element.subjective.substring(0, 50)
            }
          }
          );
          this.allSoapNotes = res.data;
          console.log(this.allSoapNotes);
        }
      });
  };

  getPatientPreviousDiagnosis = () => {
    this.encounterService
      .getPatientDiagnosis(this.appointment.patientID)
      .subscribe((res) => {
        res.data.map((item:any) => {
          item.diagnosisDate = format(item.diagnosisDate, "MM-dd-yyyy")
        })
        this.patientDiagnosisList = res.data;
      });
  };

  getAllAppointments(patientId:any) {
    const filterModal = {
      locationIds: [101],
      // fromDate: format(this.appointmentForm.value.startDateTime, "yyyy-MM-dd"),
      // toDate: format(this.appointmentForm.value.endDateTime, "yyyy-MM-dd"),
      staffIds: [this.appointment.appointmentStaffs[0].staffId],
      patientIds: [patientId],
    };
    this.schedulerService.getListData(filterModal).subscribe((response) => {
      this.isLoadingOtherAppointments = true;
      if (response.statusCode === 200) {
        this.isLoadingOtherAppointments = false;
        this.otherAppointments = response.data;
        this.otherAppointmentsPersistence = response.data;
        if (this.otherAppointments && this.otherAppointments.length > 0) {
          this.filterOtherAppointments(this.appointmentId);
        }
      }
    });
  }

  filterOtherAppointments(currentAppointmentId:any) {
    this.otherAppointments = [
      ...this.otherAppointmentsPersistence.filter(
        (x) => x.patientAppointmentId != currentAppointmentId
      ),
    ];
    this.otherAppointments.sort((a, b) => {
      return (
        new Date(b.startDateTime).valueOf() -
        new Date(a.startDateTime).valueOf()
      );
    });
  }

  onClose() {
    this.dialogPopup.close();
  }

  onOtherAppointmentClick(appointmentId:any) {
    this.selectedAppointments.push(appointmentId);
    this.appointmentId = appointmentId;
    this.filterOtherAppointments(appointmentId);
    this.getAppointment(appointmentId);
  }

  toDateTimeString(date:any, onlyDate = false) {
    return this.date.transform(
      new Date(date),
      onlyDate ? 'MM/dd/yyyy' : "MM/dd/yyyy hh:mm a"
    );
  }

  slotDateTime(date:any) {
    return this.date.transform(new Date(date), "MM/dd hh:mm a");
  }

  onBack() {
    this.selectedAppointments.pop();
    const previousAppointmentId =
      this.selectedAppointments[this.selectedAppointments.length - 1];
    this.appointmentId = previousAppointmentId;
    this.getAppointment(previousAppointmentId);
  }

  getBgColor(appointmentStatus:any): string {
    return this.statusColors.find(
      (x) => x.name.toLowerCase() == appointmentStatus.toLowerCase()
    ).color;
  }

  getBgClass(index: number): string {
    return index % 2 == 0 ? "evenCellColor" : "oddCellColor";
  }

  getUserDocuments(appyId:any) {
    this.isLoadingDocuments = true;
    this.clientService
      .getPateintApptDocuments(appyId)
      .subscribe((response: ResponseModel) => {
        this.isLoadingDocuments = false;
        if (response != null) {
          this.documentList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
        }
      });
  }

  getUserDocument(value: UserDocumentModel) {
    // this.clientService.getUserDocument(value.id).subscribe((response: any) => {
    //   this.clientService.downloadFile(response, response.type, value.url);
    // });
    let key = "userdoc";
    if (value.key.toLowerCase() === "refferal") {
      key = "refferal";
    }
    this.clientService
      .getDocumentForDownlod(value.id, key)
      .subscribe((response: any) => {
        console.log(response);
        debugger;
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
              break; // Assuming PDF for illustration
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

  deleteUserDocument(id: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this document?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deleteUserDocument(id)
            .subscribe((response: ResponseModel) => {
              if (response != null) {
                this.notifier.notify("success", response.message);
                this.getUserDocuments(this.appointmentId);
              } else {
                this.notifier.notify("error", "unfortunately,something went wrong");
              }
            });
        }
      });
  }

  videoCall() {
    // this.router.navigate(["/web/encounter/video-call"], {
    //   queryParams: {
    //     apptId: this.appointmentId,
    //   },
    // });
    this.router.navigate(["/web/waiting-room/" + this.appointmentId]);
    this.dialogModal.closeAll();
  }

  chat() {
    this.commonService.loginUser.subscribe((response: any) => {
      if (response.access_token) {
        var chatInitModel = new ChatInitModel();
        chatInitModel.isActive = true;
        chatInitModel.AppointmentId = this.appointmentId;
        chatInitModel.UserId = response.data.userID;
        //chatInitModel.UserRole = response.data.userRoles.userType;

        if (this.isProviderLogin) {
          chatInitModel.UserRole = response.data.users1.userRoles.userType;
        } else {
          chatInitModel.UserRole = response.data.users3.userRoles.userType;
        }
        this.appService.CheckChatActivated(chatInitModel);
        // this.getAppointmentInfo(
        //   chatInitModel.AppointmentId,
        //   chatInitModel.UserRole
        // );
        this.textChatService.setAppointmentDetail(
          chatInitModel.AppointmentId,
          chatInitModel.UserRole
        );
        this.textChatService.setRoomDetail(
          chatInitModel.UserId,
          chatInitModel.AppointmentId
        );
        this.dialogModal.closeAll();
      }
    });
  }
}
