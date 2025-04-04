import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../clients.service';
import { ClientProfileModel, PatientInfo, PatientMedicalFamilyHistoryModel } from '../client-profile.model';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';
import { EligibilityEnquiryComponent } from '../eligibility-enquiry/eligibility-enquiry.component';
import { CommonService } from '../../../core/services';
import { ChatHistoryModel } from './chat-history.model';
import { PatientInsuranceModel } from '../insurance.model';
import { DoctorPatientNotesComponent } from '../doctor-patient-notes/doctor-patient-notes.component';
import { ClientsService as ClientPortalService } from '../../../client-portal/clients.service';
import { ClientHeaderModel } from '../client-header.model';
//import * as format from 'date-fns/format';
import { format } from "date-fns";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  clientId!: number;
  clientProfileModel: ClientProfileModel = new ClientProfileModel;
  insuranceModel: PatientInsuranceModel = new PatientInsuranceModel;
  patientMedicalFamilyHistoryModel: PatientMedicalFamilyHistoryModel = new PatientMedicalFamilyHistoryModel;
  insuranceColumns: Array<any> = [];
  actionButtons: Array<any> = [];
  //chat
  userId!: number;
  chatHistoryData: Array<ChatHistoryModel> = [];
  staffId!: number;
  clientHeaderModel: ClientHeaderModel;
  constructor(private chatDialogModal: MatDialog, private activatedRoute: ActivatedRoute, private clientService: ClientsService, private router: Router, private notifier: NotifierService, private eligibilityDialogModal: MatDialog, private commonService: CommonService,
    private clientPortalService: ClientPortalService, private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.clientHeaderModel = new ClientHeaderModel();
  }
  profileTabs: any;
  selectedIndex: number = 0
  isPortalActivate: boolean = true;
  portalPermission: boolean = false;
  editClientPermission: boolean = false;
  statusPermission: boolean = false;
  lockPermission: boolean = false;
  isDataLoading: boolean = false;
  metaData: any = {};
  filterModel: FilterModel = new FilterModel;
  loaderImage = "/assets/loader.gif";

  ngOnInit() {
    //chat
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.userId = user.userID;
        this.staffId = user.id;
      }
    })

    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params['id'] == undefined ? null : this.commonService.encryptValue(params['id'], false);
      this.clientProfileModel = new ClientProfileModel();
      console.log(this.clientId)
      this.getClientProfileInfo();
    });
    // this.profileTabs = ["Diagnosis", "Allergies", "Medication", "Labs", "Family History"];
    this.profileTabs = ["Allergies", "Medication", "Family History", "Insurance"];
    this.getUserPermissions();
  }
  getClientHeaderInfo() {
    this.clientService.getClientHeaderInfo(this.clientId).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.clientHeaderModel = response.data;
        this.clientHeaderModel.patientBasicHeaderInfo.dob = this.clientHeaderModel.patientBasicHeaderInfo.dob
          ? format(new Date(this.clientHeaderModel.patientBasicHeaderInfo.dob), 'MM/dd/yyyy')
          : '';
        const userId = this.clientHeaderModel.patientBasicHeaderInfo && this.clientHeaderModel.patientBasicHeaderInfo.userId;
        this.clientService.updateClientNavigations(this.clientId, userId);
      }
    });
  }

  onNavigate() { }
  getClientProfileInfo() {
    debugger
    this.isDataLoading = true;
    this.clientService.getClientProfileInfo(this.clientId).subscribe((response: ResponseModel) => {
      this.isDataLoading = false;
      if (response != null && response.statusCode == 200) {
        this.clientProfileModel = response.data;
        this.getClientHeaderInfo();
        this.isPortalActivate = this.clientProfileModel.patientInfo[0].isPortalActivate;
        console.log("susmit", this.clientProfileModel.patientInfo[0].address)
        const userId = this.clientProfileModel.patientInfo[0] && this.clientProfileModel.patientInfo[0].userID;
        this.clientService.updateClientNavigations(this.clientId, userId);
        if (this.clientProfileModel) {
          this.getChatHistory();
          this.getDoctorPatientNotes();
        }
      }
    });
  }

  editProfile() {
    this.router.navigate(["web/client"], { queryParams: { id: (this.clientId != null ? this.commonService.encryptValue(this.clientId, true) : null) } });
  }
  loadComponent(event: any) {
    this.selectedIndex = event.index;
    switch (this.selectedIndex) {
      case 0: {
        this.getPatientAllergyList();
        break;
      }
      case 1: {
        this.getClientMedication();
        break;
      }
      case 2: {
        this.getPatientMedicalFamilyHistoryList();
        break;
      }
      // case 3: {
      //   this.getPatientAppointmentList();
      //   break;
      // }
      case 3: {
        this.getPatientInsuranceList();
        break;
      }
    }
  }
  getPatientInsuranceList() {
    this.clientService
      .getPatientInsurance(this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.insuranceModel = response.data.PatientInsurance;
        }
      });
  }
  getPatientMedicalFamilyHistoryList() {
    this.clientService
      .getPatientMedicalFamilyHistoryList(this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.patientMedicalFamilyHistoryModel = response.data;
          console.log(this.patientMedicalFamilyHistoryModel);
        }
      });
  }
  getClientMedication() {
    this.clientService
      .getMedicationList(this.clientId, this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientProfileModel.patientMedicationModel = response.data;
          console.log(this.clientProfileModel.patientMedicationModel);
        }
      });
  }
  getPatientAllergyList() {
    this.clientService
      .getAllergyLists(this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientProfileModel.patientAllergyModel = response.data;
        }
      });
  }
  changeStatus(event: any) {
    this.clientService.updateClientStatus(this.clientId, event.checked).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.notifier.notify('success', response.message);
      }
      else
        this.notifier.notify('error', response.message);
    });
  }

  changeUserStatus(event: any, patientInfo: PatientInfo) {
    if (patientInfo != null && patientInfo.userID > 0) {
      this.clientService.updateUserStatus(patientInfo.userID, event.checked).subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.notifier.notify('success', response.message);
        }
        else
          this.notifier.notify('error', response.message);
      });
    }
  }
  addPatientNotes() {

    const modalPopup = this.chatDialogModal.open(DoctorPatientNotesComponent, {
      hasBackdrop: true,
      width: "30%",
      data: { patientId: this.clientId, providerId: this.staffId }
    });
    modalPopup.afterClosed().subscribe((result) => {
      console.log("get added notes in grid ");
      this.getDoctorPatientNotes();
    });
  }

  downloadingCcda: boolean = false;
  getPatientCCDA() {
    this.downloadingCcda = true;
    this.clientService.getPatientCCDA(this.clientId).subscribe((response: any) => {
      this.clientService.downloadFile(response, 'application/xml', "CCDA.zip");
      if (response) this.downloadingCcda = false;
    });
  }
  updatePatientPortalVisibility(value: boolean, patientInfo: PatientInfo) {
    if (patientInfo != null && patientInfo.userID > 0) {
      this.clientService.updatePatientPortalVisibility(this.clientId, patientInfo.userID, (value == true ? false : true)).subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.notifier.notify('success', response.message);
          this.isPortalActivate = value == true ? false : true;
        }
        else
          this.notifier.notify('error', response.message);
      });
    }
  }

  checkEligibilityModal() {
    let dialogModal;
    dialogModal = this.eligibilityDialogModal.open(EligibilityEnquiryComponent, { data: this.clientId })
    dialogModal.afterClosed().subscribe((result: string) => {
    });
  }

  getUserPermissions() {
    const actionPermissions = this.clientService.getUserScreenActionPermissions('CLIENT', 'CLIENT_PROFILE');
    const { CLIENT_PROFILE_PORTAL, CLIENT_PROFILE_UPDATE, CLIENT_INSURANCE_CHANGESTATUS, CLIENT_INSURANCE_CHANGELOCK } = actionPermissions;

    this.portalPermission = CLIENT_PROFILE_PORTAL || false;
    this.editClientPermission = CLIENT_PROFILE_UPDATE || false;
    this.statusPermission = CLIENT_INSURANCE_CHANGESTATUS || false;
    this.lockPermission = CLIENT_INSURANCE_CHANGELOCK || false;

  }

  //chat
  getChatHistory() {
    this.clientService.getChatHistory(this.userId, this.clientProfileModel.patientInfo[0].userID).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.chatHistoryData = response.data != null && response.data.length > 0 ? response.data : [];
        // this.createModal(this.chatHistoryData);
      }
    });
  }

  getDoctorPatientNotes() {
    this.clientPortalService.getDoctorNotes(this.clientId, this.staffId).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        if (response.data[0] && response.data[0].providerId == this.staffId) {
          this.clientProfileModel.notes = response.data;
        } else {
          this.clientProfileModel.notes = [];
        }
      } else {
        this.clientProfileModel.notes = [];
      }
    });
  }
  getDirection = (address: string) => {
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = "https://www.google.com/maps/place/" + address;
    link.target = "_blank";
    link.click();
  };

}
