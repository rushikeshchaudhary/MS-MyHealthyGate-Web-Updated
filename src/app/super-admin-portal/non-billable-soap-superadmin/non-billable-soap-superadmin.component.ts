import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ResponseModel } from 'src/app/platform/modules/core/modals/common-model';
import { SignDialogComponent } from 'src/app/platform/modules/agency-portal/encounter/sign-dialog/sign-dialog.component';
import { LabTestDownloadPatientComponent } from 'src/app/platform/modules/client-portal/lab-test-download-patient/lab-test-download-patient.component';
import { ClientHeaderModel } from 'src/app/platform/modules/agency-portal/clients/client-header.model';
import { ClientsService } from 'src/app/platform/modules/agency-portal/clients/clients.service';
import { EncounterService } from 'src/app/platform/modules/agency-portal/encounter/encounter.service';
import { NotifierService } from 'angular-notifier';
import { FilterModel, MedicationModel } from 'src/app/platform/modules/agency-portal/clients/medication/medication.model';
import { PrescriptionModel } from 'src/app/platform/modules/agency-portal/clients/prescription/prescription.model';
import { VitalModel } from 'src/app/platform/modules/agency-portal/clients/vitals/vitals.model';
import { ImmunizationModel } from 'src/app/platform/modules/agency-portal/clients/immunization/immunization.model';

import { CommonService } from 'src/app/platform/modules/core/services';
import { SoapNoteViewModalComponent } from 'src/app/platform/modules/agency-portal/clients/soap-note-view-modal/soap-note-view-modal.component';
import { FormioOptions } from '@formio/angular';

class signModal {
  id: number = 0;
  bytes: string | null = null;
  date: string | null = null;
  name: string | null = null;
}

@Component({
  selector: 'app-non-billable-soap-superadmin',
  templateUrl: './non-billable-soap-superadmin.component.html',
  styleUrls: ['./non-billable-soap-superadmin.component.css']
})
export class NonBillableSoapSuperadminComponent implements OnInit {
  soapForm!: FormGroup;
  previousEncounterId: number=0;
  templateFormId: number = 0;
  displayedColumns!: Array<any>;
  public jsonFormData: Object = {
    components: [],
  };
  initialFormValues: Object = {
    data: {},
  };
  formioOptions: FormioOptions = {
    disableAlerts: true,
  };
  tempDataId: number=0;
  appointmentId: number;
  encounterId: number=0;
  soapNoteId: number;
  submitted: boolean;
  submittedSign: boolean;
  appConfiguration: Array<any>;
  patientAppointmentDetails: any;
  immunizationList: Array<ImmunizationModel> = [];
  soapNotes: any;
  encounterSignature: Array<any>;
  staffDetails: any;
  appointmentStartTime: string|null=null;
  appointmentEndTime: string|null=null;
  patientSign: signModal = new signModal();
  employeeSign: signModal = new signModal();
  guardianSign: signModal = new signModal();
  isGuardianSigned: boolean;
  isClientSigned: boolean;
  isEmployeeSigned: boolean;
  isAllSigned: boolean;
  isSoapCompleted: boolean;
  vitalData!: VitalModel;
  metaData: any;
  PatientEncounterCheckInNotes: any;
  isProvider: boolean = false;
  displaySoapNoteColumns: Array<any> = [
    {
      displayName: "Patient Name",
      key: "patientName",
      isSort: true,
    },
    {
      displayName: "TemplateName",
      key: "templateName",
      isSort: true,
    },
 
    {
      displayName: "Actions",
      key: "Actions",
      isSort: true,
      class: "",
    }
  ];
  actionButtons: Array<any> = [
    { displayName: "View", key: "view", class: "fa fa-eye" },
  ];
  displayColumnsLab: Array<any> = [
    {
      displayName: "Lab Name",
      key: "labName",
      isSort: false,
      class: ""
    },
    {
      displayName: "Test Name",
      key: "testName",
      isSort: false,
      class: ""
    }, {
      displayName: "PatientName",
      key: "patientName",
      isSort: false,
      class: ""
    },
    {
      displayName: "Status",
      key: "status",
      isSort: false,
      class: ""
    }, {
      displayName: "Notes",
      key: "notes",
      isSort: false,
      class: ""
    }
    ,
    {
      displayName: "Actions",
      key: "Actions",
      isSort: true,
      class: "",
    }
  ];
  actionButtonsRadio: Array<any> = [
    { displayName: "View", key: "view", class: "fa fa-eye" },
  ];
  metaDataLab: any;
  metaDataRadio: any;
  actionButtonsLab: Array<any> = [
    { displayName: "View", key: "view", class: "fa fa-eye" },
  ];

  displayColumnsRadio: Array<any> = [
    {
      displayName: "Radiology Name",
      key: "labName",
      isSort: false,
      class: ""
    },
    {
      displayName: "Test Name",
      key: "testName",
      isSort: false,
      class: ""
    }, {
      displayName: "PatientName",
      key: "patientName",
      isSort: false,
      class: ""
    },
    {
      displayName: "Status",
      key: "status",
      isSort: false,
      class: ""
    }, {
      displayName: "Notes",
      key: "notes",
      isSort: false,
      class: ""
    }
    ,
    {
      displayName: "Actions",
      key: "Actions",
      isSort: true,
      class: "",
    }
  ];
  labReferralList: Array<any> = [];
  dataSourcePre = new MatTableDataSource<any>();
  displayedColumnsPre: string[] = [
    "drugName",
    "strength",
    "directions",
    "startDate",
    "endDate",
  ];

  metaDataPre: any;
  radiologyReferralList: Array<any> = [];
  medicationList: Array<MedicationModel> = [];
  // client header info
  clientHeaderModel: ClientHeaderModel;
  PatientEncounterDetails: any;
  PatientEncounterNotes: any;
  filterModel!: FilterModel;
  prescriptionListingData!: PrescriptionModel[];
  vitalListingData!: VitalModel[];
  questionAnswers: Array<any> = [];
  displayColumnsQuestions: Array<any> = [
    {
      displayName: "Question",
      key: "questionText",
      isSort: false,
      class: ""
    },
    {
      displayName: "Answer",
      key: "answer",
      isSort: false,
      class: ""
    }

  ];
  isAdmin!: boolean;
  patientId: any;
  allSoapNotes: any;
  clientId: any;
  constructor(
    private signDailog: MatDialog,
    private dialogModal: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private encounterService: EncounterService,
    private notifierService: NotifierService,
    private commonService: CommonService,
    private clientService: ClientsService,

  ) {
    this.submitted = false;
    this.metaDataPre = {};
    this.submittedSign = false;
    this.soapNoteId = 0;
    this.appConfiguration = [];
    this.patientAppointmentDetails = null;
    this.soapNotes = null;
    this.encounterSignature = [];
    this.staffDetails = null;
    this.appointmentStartTime = null;
    this.appointmentEndTime = null;
    this.isGuardianSigned = false;
    this.isClientSigned = false;
    this.isEmployeeSigned = false;
    this.isAllSigned = false;
    this.isSoapCompleted = false;

    this.clientHeaderModel = new ClientHeaderModel();
    const apptId = this.activatedRoute.snapshot.params['apptId']
    this.appointmentId= Number(apptId);
    const patId = this.activatedRoute.snapshot.params['patId']
    this.patientId= Number(patId);
    this.activatedRoute.queryParams.subscribe(params => {

      //this.appointmentId = activatedRoute.snapshot.params.apptId
     // this.encounterId = params.encId == undefined ? 0 : parseInt(params.encId);

      this.getNonBillableEncounterDetails();
      this.GetPatientEncounterDetails();
      this.getSelectedPreviousEncountersData();
      this.GetPatientEncounterNotes();
      this.GetPatientEncounterCheckInNotes();
      this.getSoapNotes();
      this.displayedColumns = [
        { displayName: "date", key: "vitalDate", isSort: true, width: "20%", type: "date" },
        {
          displayName: "Height (Cm)",
          key: "heightIn",
          isSort: true,
          width: "10%",
        },
        { displayName: "weight(Kg)", key: "weightLbs" },
        { displayName: "h_rate", key: "heartRate" },
        { displayName: "bmi", key: "bmi", isSort: true },
        { displayName: "bp_h_l", key: "bpDiastolic" },
        { displayName: "pulse", key: "pulse" },
        { displayName: "resp", key: "respiration" },
        { displayName: "temp(C)", key: "temperature" },
      ];

      
    });
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        if (user.userRoles && user.userRoles.roleName == 'ADMIN') {
          this.isAdmin = true;
        }
      }
    });

    this.soapForm = this.formBuilder.group({
      'nonBillableNotes': [''],
    });
    this.getAppConfigurations();
    this.getVitalByAppointmentId();
    this.getAllRadiologyReferrals();
    this.getMedicationByAppointmentId();
    this.getAllLabReferrals();
    // this.getSoapNotes();
  }
  onPageOrSortChangePre(event: any) {

  }

  delete(id:any){
    
  }

  onTableActionClickLab(actionObj: any) {
    if (actionObj.action == "view") {
      this.openTestDownloadModal(actionObj);
      console.log("open pop up here...");
    }
  }
  openTestDownloadModal(actionObj: any) {
    const modalPopup = this.dialogModal.open(LabTestDownloadPatientComponent, {
      hasBackdrop: true,
      width: "30%",
      data: actionObj.data
    });
    modalPopup.afterClosed().subscribe((result) => {
      console.log("closed pop up");
    });
  }

  getPrescriptionList() {
    this.filterModel = new FilterModel();
    this.clientService
      // .getPrescriptionList(this.patientAppointmentDetails.patientID, this.filterModel, this.appointmentId)
      .getPrescriptionByAppointmentIdList(this.patientAppointmentDetails.patientID, this.filterModel, this.appointmentId)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.prescriptionListingData = response.data;
          this.dataSourcePre.data = this.prescriptionListingData;
          this.prescriptionListingData = (response.data || []).map(
            (obj: any) => {
              obj.createdDate = format(obj.createdDate, 'MM/dd/yyyy');
              obj.startDate != null ? obj.startDate = format(obj.startDate, 'MM/dd/yyyy') : null;
              obj.endDate != null ? obj.endDate = format(obj.endDate, 'MM/dd/yyyy') : null;
              obj.status = obj.isActive ? "ACTIVE" : "INACTIVE";
              return obj;
            }
          );
          this.metaDataPre = response.meta || {};
        } else {
          this.prescriptionListingData = [];
          this.metaDataPre = {};
        }
      });
  }
  getAllRadiologyReferrals() {
    console.log("list referrals here");
    let roleId: number = 329;
    this.clientService.getAllLabReferralsByAppointmentId(roleId, this.appointmentId).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.radiologyReferralList = response.data;
        this.metaDataRadio = response.meta;
      } else {
        this.radiologyReferralList = [];
        this.metaDataRadio = null;
      }
    });
  }

  getMedicationByAppointmentId() {
    this.clientService.getmedicationByAppointmentId(this.appointmentId).subscribe((response: any) => {
      if (response != null) {
        console.log('getmedicationByAppointmentId', response);
        this.medicationList =
          response.data != null
            ? response.data
            : [];

      }
    });
  }

  getAllLabReferrals() {
    console.log("list referrals here");
    let roleId: number = 325;
    this.clientService.getAllLabReferralsByAppointmentId(roleId, this.appointmentId).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.labReferralList = response.data;
        this.metaDataLab = response.meta;
      } else {
        this.labReferralList = [];
        this.metaDataLab = null;
      }
    });
  }

  getImmunizationList() {
    this.clientService
      // .getImmunizationList(this.patientAppointmentDetails.patientID, this.appointmentId)
      .getImmunizationByAppointmentIdList(this.patientAppointmentDetails.patientID, this.appointmentId)
      .subscribe((response: ResponseModel) => {
        if (
          response != null &&
          response.data != null &&
          response.data.length > 0
        ) {
          this.immunizationList = response.data;
        } else {
          this.immunizationList;
        }
      });
  }

  getVitalByAppointmentId() {
    this.clientService.getVitalByAppointmentId(this.appointmentId).subscribe((response: any) => {
      if (response != null) {
        console.log('getVitalByAppointmentId', response);
        this.vitalData =
          response.data != null
            ? response.data
            : [];
        this.vitalListingData = [];
        this.metaData = response.meta;
        response.data.forEach((element: any) => {
          this.vitalListingData.push(element);
        });
        // this.vitalListingData.push(this.vitalData);
      }
    });
  }
  get formControls() {
    return this.soapForm.controls;
  }

  onBackClick() {
    this.router.navigate(['/webadmin/client/clientencounter']);
    //  this.location.back();
  }

  // onNavigate(url: string) {
  //   const clientId = this.patientAppointmentDetails && this.patientAppointmentDetails.patientID;
  //   if (clientId)
  //     this.router.navigate([url], { queryParams: { id: this.commonService.encryptValue(clientId, true) } });
  // }

  checkIsRequiredSigned() {
    let employee_signRequired = false,
      client_signRequired = false,
      guardian_signRequired = false;
    if (this.appConfiguration && this.appConfiguration.length) {
      this.appConfiguration.forEach((Obj) => {
        if (Obj.configType === 1) {
          switch (Obj.key) {
            case 'CLINICIAN_SIGN':
              employee_signRequired = (Obj.value.toString().toLowerCase() === 'true');
              break;
            case 'PATIENT_SIGN':
              client_signRequired = (Obj.value.toString().toLowerCase() === 'true');
              break;
            case 'GUARDIAN_SIGN':
              guardian_signRequired = (Obj.value.toString().toLowerCase() === 'true');
              break;
            default:
              break;
          }
        }
      });
    }
    let employee_Signed = true, client_signed = true, guardian_signed = true;
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
    if (employee_Signed && client_signed && guardian_signed) {
      this.isAllSigned = true;
    } else {
      this.isAllSigned = false;
    }
  }

  openSignDialog() {
    const staffsList = [{
      id: this.staffDetails && this.staffDetails.staffId,
      value: this.staffDetails && this.staffDetails.staffName,
    }]
    const clientDetails = {
      id: this.patientAppointmentDetails && this.patientAppointmentDetails.patientID,
      value: this.patientAppointmentDetails && this.patientAppointmentDetails.patientName
    }
    const modalPopup = this.signDailog.open(SignDialogComponent, {
      hasBackdrop: true,
      data: {
        staffsList,
        clientDetails,
        SignatoryLists: ['Employee']
      }
    });

    modalPopup.afterClosed().subscribe(result => {
      if (result) {
        switch ((result.Signatory || '').toUpperCase()) {
          case 'EMPLOYEE':
            this.employeeSign = {
              ...this.employeeSign,
              date: format(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
              name: result.name,
              bytes: (result.bytes || '').split(',')[1]
            }
            this.isEmployeeSigned = true;
            break;
          case 'CLIENT':
            this.patientSign = {
              ...this.patientSign,
              date: format(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
              name: result.name,
              bytes: (result.bytes || '').split(',')[1]
            }
            this.isClientSigned = true;
            break;
          case 'GUARDIAN':
            this.guardianSign = {
              ...this.guardianSign,
              date: format(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
              name: result.name,
              bytes: (result.bytes || '').split(',')[1]
            }
            this.isGuardianSigned = true;
            break;
        }
        this.checkIsRequiredSigned();
      }
    });
  }


  onSubmitTemplate(event: any) {

    const jsonData = {
      id: this.tempDataId,
      templateData: JSON.stringify(event),
    };
    let postData: Array<any> = [];
    postData.push(jsonData);

    this.onSubmit(postData);
  }
  onSubmit(formioData: any):any {
    if (this.soapForm.invalid) {
      return null;
    }

    const postData = {
      PatientEncounterTemplate: formioData,
    };
    this.savePatientEncounter(postData);
    return
  }
  savePatientEncounter(postData: any, isAdmin: boolean = false) {

    this.encounterService
      .updatePatientEncounter(postData)
      .subscribe((response) => {

        if (response.statusCode == 200) {
          this.notifierService.notify("success", response.message);

        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

  getSoapNotes = () => {
    this.filterModel = new FilterModel();
    console.log(this.filterModel);
    console.log(this.appointmentId);
    console.log(this.patientId);

    this.encounterService
      .GetAllSoapNotes(this.patientId, this.appointmentId, this.filterModel)
      .subscribe((res) => {
        if (res != null && res.data != null && res.statusCode == 200) {
          console.log(res);
          // this.allSoapNotes = res.data.map((x) => {
          // });
          this.allSoapNotes = res.data;
          this.metaData = res.meta;
        } else {
          this.allSoapNotes = [];
          this.metaData = null;
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  };

  onTableActionClickSoap(actionObj: any) {
    ////debugger
    if (actionObj.action == "view") {
      this.openDoctorSoapNoteViewModal(actionObj);
      console.log("open pop up here...");
    }
  }
  openDoctorSoapNoteViewModal(actionObj:any){
    
    const modalPopup = this.dialogModal.open(SoapNoteViewModalComponent, {
      hasBackdrop: true,
      // width: "50%",
      data: actionObj.data
    });
    modalPopup.afterClosed().subscribe((result) => {
      console.log("closed pop up");
    });
  }


  
  getAppConfigurations() {
    this.encounterService.getAppConfigurations()
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.appConfiguration = response.data || [];
          } else {
            this.appConfiguration = [];
          }
          this.checkIsRequiredSigned();
        }
      )
  }

  getNonBillableEncounterDetails() {
    //////debugger;
    this.encounterService.getNonBillableEncounterDetails(this.appointmentId, this.encounterId, false)
      .subscribe(
        response => {
          //////debugger;
          console.log('patientAppointmentDetails', response);
          if (response.statusCode == 200) {
            this.patientAppointmentDetails = response.data.patientAppointment || [];
            this.soapNotes = response.data.nonBillableNotes || null;
            this.encounterSignature = response.data.encounterSignature || [];
            this.isSoapCompleted = (response.data.status || '').toUpperCase() === 'RENDERED';
            this.filterDetails();
            this.getPrescriptionList();
            this.getImmunizationList();
          } else {
            this.patientAppointmentDetails = null;
            this.soapNotes = null;
            this.encounterSignature = [];
            this.isSoapCompleted = false;
          }
        }
      )
  }

  GetPatientEncounterDetails() {

    this.encounterService.GetPatientEncounterDetails(this.appointmentId, this.encounterId, false)
      .subscribe(
        response => {
          //////debugger;
          if (response.statusCode == 200) {
            //////debugger;
            this.PatientEncounterDetails = JSON.parse(response.data.patientEncounterTemplate[0].templateData).data;

            this.tempDataId = JSON.parse(response.data.patientEncounterTemplate[0].id);
          }
        }
      )
  }
  GetPatientEncounterNotes() {
    //////debugger;
    this.encounterService.GetPatientEncounterNotes(this.appointmentId)
      .subscribe(
        response => {
          //////debugger;
          if (response.statusCode == 200) {
            this.PatientEncounterNotes = (response.data[0].encounterNotes);

          }
        }
      )
  }

  GetPatientEncounterCheckInNotes() {
    this.encounterService.GetPatientEncounterCheckInNotes(this.appointmentId)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            let data = response.data.reverse();
            this.PatientEncounterCheckInNotes = (data[0].encounterNotes);
          }
        }
      )
  }

  getSelectedPreviousEncountersData() {
    this.encounterService
      .getPreviousEncountersData(this.encounterId)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.templateFormId =
            (response.data.patientEncounterTemplate &&
              response.data.patientEncounterTemplate[0].masterTemplateId) ||
            0;
          // this.filterDetails();
        }
        if (this.encounterId) {
          this.getTemplateForm(this.templateFormId);
        }

      });
  }
  getTemplateForm(id: number) {
    //////debugger;
    this.encounterService
      .getTemplateForm(this.appointmentId, id)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          //////debugger;
          let formJson:any = { components: [] },
            formData = { data: {} };
          try {
            formJson = JSON.parse(response.data.templateJson);
            formData = JSON.parse(response.data.templateData);
          } catch (err) { }
          //////debugger;
          this.jsonFormData = response.data.templateJson
            ? formJson
            : this.jsonFormData;

          this.initialFormValues = response.data.templateData
            ? formData
            : this.initialFormValues;
          this.templateFormId = id;

        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }
  filterDetails() {
    if (this.patientAppointmentDetails) {
      const { appointmentStaffs, endDateTime, startDateTime } = this.patientAppointmentDetails;
      if (appointmentStaffs && appointmentStaffs.length) {
        this.staffDetails = appointmentStaffs[0];
      }
      this.appointmentStartTime = `${format(startDateTime, 'hh:mm a')}`
      this.appointmentEndTime = `${format(endDateTime, 'hh:mm a')}`

      if (this.patientAppointmentDetails.patientID)
        this.getClientHeaderInfo(this.patientAppointmentDetails.patientID);
    }

    if (this.soapNotes) {
      this.soapForm.patchValue({ nonBillableNotes: this.soapNotes })
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
            name: this.patientAppointmentDetails && this.patientAppointmentDetails.patientName,
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
  }

  saveNonBillableEncounter(postData: any, isAdmin: boolean = false) {
    this.submitted = true;
    this.encounterService.saveNonBillableEncounter(postData, isAdmin)
      .subscribe(
        response => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifierService.notify('success', response.message);
            if (!this.encounterId) {
              this.encounterId = response.data.id || 0;
              this.router.navigate(["/web/encounter/non-billable-soap"], {
                queryParams: {
                  apptId: this.appointmentId,
                  encId: this.encounterId
                }
              });
            }
          } else {
            this.notifierService.notify('error', response.message)
          }
        }
      )
  }

  getClientHeaderInfo(patientID: number) {
    this.encounterService.getClientHeaderInfo(patientID).subscribe((response: any) => {
      if (response != null && response.statusCode == 200) {
        this.clientHeaderModel = response.data;
        this.clientHeaderModel.patientBasicHeaderInfo != null ? this.clientHeaderModel.patientBasicHeaderInfo.dob = format(new Date(this.clientHeaderModel.patientBasicHeaderInfo.dob), 'MM/dd/yyyy') : '';
      }
    });
  }

  getAssesmentQueAnsByApptId() {
    this.clientService.getAssessmentQueAnsByApptId(this.appointmentId).subscribe((response: ResponseModel) => {
      if (response.statusCode === 200) {
        this.questionAnswers = response.data;
      } else {
        this.questionAnswers = [];
      }
    });
  }

  downloadTemplate(event?:any) {
    debugger
    let fileName = 'Template ' + this.clientHeaderModel.patientBasicHeaderInfo.name;
    this.clientService
      .getCheckInTemplatePdfById(this.appointmentId, this.encounterId)
      .subscribe((response: any) => {

        let byteChar = atob(response.data.toString());
        let byteArray = new Array(byteChar.length);
        for (let i = 0; i < byteChar.length; i++) {
          byteArray[i] = byteChar.charCodeAt(i);
        }

        let uIntArray = new Uint8Array(byteArray);
        let file = new Blob([uIntArray], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.target = '_blank';
        a.href = fileURL;
        a.download = fileName;
        a.click();
        a.remove();
      });
  };

  onNavigate(urlType: any = null) {
    const clientId = this.patientAppointmentDetails && this.patientAppointmentDetails.patientID;
    if (clientId) {
      if (urlType == 'Profile') {
        this.router.navigate(["/webadmin/client/my-profile"], { queryParams: { id: this.commonService.encryptValue(clientId, true) } });
      } else {
        if (this.isProvider) {
          this.router.navigate(["/webadmin/my-appointments"], { queryParams: { cId: this.commonService.encryptValue(clientId, true) } });
        } else {
          // this.router.navigate(["/web/client/scheduling"], { queryParams: { cId: this.commonService.encryptValue(this.clientId, true) } });
          this.router.navigate(["/webadmin/client/managelab"]);
        }
      }
    }
  }

  onPageOrSortChange=(event?:any)=>{

  }
}
