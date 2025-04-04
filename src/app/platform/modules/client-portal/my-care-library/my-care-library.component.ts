import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { ClientsService } from "../clients.service";
import {
  ClientProfileModel,
  PatientInsuranceModel,
  PatientAllergyModel,
  PatientImmunization,
  PatientMedicationModel,
  PatientAppointmentListModel,
  PatientAuthorizationModel,
  PatientMedicalFamilyHistoryModel,
  ChatHistoryModel,
  Metadata,
  LabListModel,
  UserDocumentReq,
} from "../client-profile.model";
import { SelectionModel } from "@angular/cdk/collections";
import { NotifierService } from "angular-notifier";
import { FilterModel, ResponseModel } from "../../core/modals/common-model";
import { Observable, Subscription, of, timer } from "rxjs";
import { CommonService } from "../../core/services/common.service";
import { addDays, format } from "date-fns";
import {
  PrescriptionModel,
  PrescriptionDownloadModel,
  PrescriptionDistinctModel,
} from "../../agency-portal/clients/prescription/prescription.model";
import { ClientsService as AgencyClientsService } from "../../agency-portal/clients/clients.service";
import { Meta } from "@angular/platform-browser";

import { GenerateClaimDialogComponent } from "../../agency-portal/billing/claims/generate-claim-dialog/generate-claim-dialog.component";
import { PharmacyDialogComponent } from "../pharmacy-dialog/pharmacy-dialog.component";
import { Width } from "ngx-owl-carousel-o/lib/services/carousel.service";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { DocumentModalComponent } from "../documents/document-modal/document-modal.component";
import { ImmunizationModel } from "../../agency-portal/clients/immunization/immunization.model";
import { ImmunizationModalComponent } from "../../agency-portal/clients/immunization/immunization-modal/immunization-modal.component";
import { MedicationModel } from "../../agency-portal/clients/medication/medication.model";
import { MedicationModalComponent } from "../../agency-portal/clients/medication/medication-modal/medication-modal.component";
import { AllergiesModalComponent } from "../../agency-portal/clients/allergies/allergies-modal/allergies-modal.component";
import { AllergyModel } from "../../agency-portal/clients/allergies/allergies.model";
import {
  AuthModel,
  AuthorizationModel,
} from "../../agency-portal/clients/authorization/authorization.model";
import { AuthorizationModalComponent } from "../../agency-portal/clients/authorization/authorization-modal/authorization-modal.component";
import { FamilyHistoryModelComponent } from "../../agency-portal/clients/family-history/family-history-model/family-history-model.component";
import { InsuranceModalComponent } from "../../agency-portal/clients/insurance/insurance-modal/insurance-modal.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { debounce, debounceTime, distinctUntilChanged, filter, switchMap, tap } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";

class AuthorizationFilterModel extends FilterModel {
  authType: any = null;
}
@Component({
  selector: "app-my-profile",
  templateUrl: "./my-care-library.component.html",
  styleUrls: ["./my-care-library.component.css"],
})
export class MyCareLibraryComponent implements OnInit {
  clientId!: number;
  stringprescriptionIds!: string;
  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource<any>();
  authorizationModel!: AuthorizationModel[];
  authModel!: AuthModel;
  authorizationFilterModel!: AuthorizationFilterModel;
  allergyData!: AllergyModel;
  allergyListingData!: AllergyModel[];
  medicationModel!: MedicationModel;
  medicationList: Array<MedicationModel> = [];
  immunizationModel!: ImmunizationModel;
  immunizationList: Array<ImmunizationModel> = [];
  tooltipdMessage = "Maximum 7 immunization are allowed";
  maxAllowedLimit = 7;
  addPermission!: boolean;
  updatePermission!: boolean;
  deletePermission!: boolean;
  public prescriptionIds: string[] = [];
  displayedColumns: string[] = [
    "select",
    "medicine",
    "dose",
    // "strength",
    "startDate",
    "endDate",
    "actions",
  ];
  displayedActionColumns: string[] = ["edit", "delete"];
  displayedColumnsPrescription: string[] = [
    "select",
    // "drugName",
    // "strength",
    // "directions",
    // "startDate",
    // "endDate",
    "prescriptionNo",
    "creatorName",
    "createdDate",
    "drugNames",
    "Actions",
  ];
  


  locationId!: number;
  subscription!: Subscription;
  clientProfileModel!: ClientProfileModel;
  clientImmunizationModel!: PatientImmunization | any;
  clientLabListModel!: LabListModel;
  clientMedicationModel!: PatientMedicationModel;
  clientAppointmentListModel!: PatientAppointmentListModel;
  userId!: number;
  categoryTypeId!: any;
  documentCategoryList!: any[];
  documentList: any = [];
  filterDocumentList: any = [];
  filterString: any;
  selectedCategory: any;
  clientAllergyListModel!: PatientAllergyModel | any;
  clientInsuranceListModel: PatientInsuranceModel;
  clientInsuranceList: Array<PatientInsuranceModel> = [];
  patientMedicalFamilyHistoryModel: PatientMedicalFamilyHistoryModel;
  patientMedicalFamilyHistoryList: Array<PatientMedicalFamilyHistoryModel> = [];
  clientAthorizationListModel!: PatientAuthorizationModel | any;
  metaData: Metadata;
  pastAppointmentList: Array<any> = [];
  todaysAppointmentList: Array<any> = [];
  UpcomingAppointmentList: Array<any> = [];
  cancelAppointmentList: Array<any> = [];
  immunizationColumns: Array<any>;
  prescriptionColumns: Array<any>;
  documentsColumns: Array<any>;
  showLoader = false;
  medicationColumns: Array<any>;
  allergyColumns: Array<any>;
  insuranceColumns: Array<any>;
  labColumns!: Array<any>;
  authorizationColumns: Array<any>;
  actionButtons: Array<any> = [];
  docActionButtons: Array<any> = [];
  insuranceActionButtons: Array<any> = [];
  immunizationActionButtons: Array<any> = [];
  allergyActionButtons: Array<any> = [];
  medicationActionButtons: Array<any> = [];
  //chat
  fromUserId!: number;
  chatHistoryData: Array<ChatHistoryModel> = [];
  clientPrescriptionModel!: PrescriptionModel[];
  clientPrescriptionDistinctModel!: PrescriptionDistinctModel[];
  prescriptiondownloadmodel = new PrescriptionDownloadModel();
  filterModel: FilterModel;
  metaDataPrescription: Metadata;
  metaDataMedication: Metadata;
  //share prescription
  disabled: boolean = true;
  maxDate: any;
  fromDateSort: any;
  toDateSort: any;
  searchBox: boolean = true;
  userDocRequest: UserDocumentReq;
  testFormGroup!: FormGroup;
  MedicationFilterFormGroup!:FormGroup;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private formBuilder: FormBuilder,
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
    // this.route.queryParams.subscribe((params: ParamMap) => {
    //   this.clientId = +params["id"];
    //   this.fromUserId = +params["userID"];
    //   this.locationId = +params["locationID"];
    //   this.getClientProfileInfo();
    //  // this.getClientMedication(this.filterModel);
    //  // this.getClientImmunization(this.filterModel);
    //   //this.getPatientAllergyList(this.filterModel);
    // });
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.clientId = +params.get("id")!;
      this.fromUserId = +params.get("userID")!;
      this.locationId = +params.get("locationID")!;
      this.getClientProfileInfo();
      // this.getClientMedication(this.filterModel);
      // this.getClientImmunization(this.filterModel);
      // this.getPatientAllergyList(this.filterModel);
    });
    
    
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.immunizationColumns = [
      {
        displayName: "immunization",
        key: "vaccineName",
        class: "",
      },
      {
        displayName: "amount",
        key: "amountAdministered",
        class: "",
        type: "decimal",
      },
      {
        displayName: "administered_date",
        key: "administeredDate",
        class: "",
        type: "date",
      },
      {
        displayName: "route_of_administration",
        key: "routeOfAdministration",
      },
      {
        displayName: "actions",
        key: "Actions",
        class: "",
        width: "15%",
      },
      //{ displayName: 'IMMUNITY STATUS', key: 'immunityStatusID', width: '15%' }
    ];
    this.immunizationActionButtons = [
      { displayName: "Edit", key: "edit", class: "fa fa-edit" },
      // { displayName: "View", key: "view", class: "fa fa-eye" },
      { displayName: "Delete", key: "delete", class: "fa fa-trash" },
    ];
    this.medicationColumns = [
      { displayName: "medication", key: "medicine", class: "", width: "20%" },
      { displayName: "dose", key: "dose", class: "", width: "20%" },
      // { displayName: "strength", key: "strength", class: "", width: "20%" },
      {
        displayName: "start_date",
        key: "startDate",
        width: "20%",
        type: "date",
      },
      { displayName: "end_date", key: "endDate", width: "20%", type: "date" },
      {
        displayName: "status",
        key: "isActive",
        width: "10%",
        type: ["Active", "Inactive"],
      },
      {
        displayName: "actions",
        key: "actions",
        class: "",
        width: "15%",
      },
    ];
    this.medicationActionButtons = [
      { displayName: "Edit", key: "edit", class: "fa fa-edit" },
      // { displayName: "View", key: "view", class: "fa fa-eye" },
      { displayName: "Delete", key: "delete", class: "fa fa-trash" },
    ];
    this.allergyColumns = [
      {
        displayName: "allergy_type",
        key: "allergyType",
        class: "",
      },
      { displayName: "allergen", key: "allergen", class: "" },
      { displayName: "note", key: "note", class: "" },
      { displayName: "reaction", key: "reaction" },
      {
        displayName: "created_date",
        key: "createdDate",
        type: "date",
      },
      {
        displayName: "status",
        key: "isActive",
        type: ["Active", "Inactive"],
      },
      {
        displayName: "actions",
        key: "Actions",
        class: "",
        width: "15%",
      },
    ];
    this.allergyActionButtons = [
      { displayName: "Edit", key: "edit", class: "fa fa-edit" },
      // { displayName: "View", key: "view", class: "fa fa-eye" },
      { displayName: "Delete", key: "delete", class: "fa fa-trash" },
    ];
    this.insuranceColumns = [
      {
        displayName: "insurance_company",
        key: "insuranceCompanyName",
        class: "",
      },
      {
        displayName: "insurance_issue_date",
        key: "cardIssueDate",
        class: "",
        type: "date",
      },
      {
        displayName: "insurance_id_number",
        key: "insuranceIDNumber",
        class: "",
      },
      { displayName: "insurance_plan_name", key: "insurancePlanName" },
      // {
      //   displayName: "insurance_photopath_back",
      //   key: "insurancePhotoPathBack",
      //   type: "img",
      //   class: "",
      // },
      // {
      //   displayName: "insurance_photopath_front",
      //   key: "insurancePhotoPathFront",
      //   type: "img",
      //   class: "",
      // },
      /*{
        displayName: "insurance_photopath_thumbback",
        key: "insurancePhotoPathThumbBack",
        type: "img",
        class: "",
      },
      {
        displayName: "insurance_photopath_thumbfront",
        key: "insurancePhotoPathThumbFront",
        type: "img",
        class: "",
      },*/
      {
        displayName: "insurance_company_address",
        key: "insuranceCompanyAddress",
      },
      {
        displayName: "Actions",
        key: "Actions",
        class: "",
        width: "20%",
      },
    ];
    this.insuranceActionButtons = [
      { displayName: "Edit", key: "edit", class: "fa fa-edit" },
      // { displayName: "View", key: "view", class: "fa fa-eye" },
      { displayName: "Delete", key: "delete", class: "fa fa-trash" },
    ];
    this.authorizationColumns = [
      {
        displayName: "auth#",
        key: "authorizationNumber",
        class: "",
        width: "20%",
      },
      {
        displayName: "title",
        key: "authorizationTitle",
        class: "",
        width: "20%",
      },
      {
        displayName: "insurance_company",
        key: "payerName",
        class: "",
        width: "20%",
      },
      {
        displayName: "start_date",
        key: "startDate",
        width: "15%",
        type: "date",
      },
      { displayName: "end_date", key: "endDate", width: "15%", type: "date" },
      {
        displayName: "Actions",
        key: "Actions",
        class: "",
        width: "10%",
      },
    ];
    this.prescriptionColumns = [
      {
        displayName: "drug_name",
        key: "drugName",
        class: "",
        width: "20%",
      },
      {
        displayName: "strength",
        key: "strength",
        class: "",
        width: "12%",
      },
      {
        displayName: "directions",
        key: "directions",
        class: "",
        width: "38%",
      },
      {
        displayName: "start_date",
        key: "startDate",
        width: "15%",
        type: "date",
      },
      {
        displayName: "end_date",
        key: "endDate",
        width: "15%",
        type: "date",
      },
    ];
    this.documentsColumns = [
      {
        displayName: "document_name",
        key: "documentTitle",
        isSort: true,
        class: "",
      },
      {
        displayName: "category",
        key: "documentTypeName",
        isSort: true,
        class: "",
      },
      {
        displayName: "uploaded_date",
        key: "createdDate",
        isSort: true,
        class: "",
      },
      // {
      //   displayName: "expiration_date",
      //   key: "expiration",
      //   isSort: true,
      //   class: "",
      //   width: "15%",
      // },
      {
        displayName: "uploaded_by",
        key: "creatorName",
        class: "",
      },
      {
        displayName: "extension",
        type: "img",
        key: "extenstion",
        class: "",
      },
      {
        displayName: "actions",
        key: "Actions",
        class: "",
      },
    ];

    this.docActionButtons = [
      { displayName: "Download", key: "download", class: "fa fa-download" },
      { displayName: "View", key: "view", class: "fa fa-eye" },
      { displayName: "Delete", key: "delete", class: "fa fa-trash" },
    ];
    // this.labColumns = [
    //   { displayName: "lab_name", key: "labName", class: "", width: "40%" },
    //   { displayName: "Photo", key: "labPhotoThumbnailPath", class: "", width: "40%" },
    //   { displayName: "Lab Id", key: "labId", width: "40%", class: "" }
    // ];
    this.filterModel = new FilterModel();
    this.metaData = new Metadata();
    this.metaDataPrescription = new Metadata();
    this.metaDataMedication = new Metadata();
    this.userDocRequest = new UserDocumentReq();
    this.patientMedicalFamilyHistoryModel =
      new PatientMedicalFamilyHistoryModel();
    this.clientInsuranceListModel = new PatientInsuranceModel();
  }
  profileTabs: any;
  historyTabs: any;
  selectedIndex: number = 0;
  selectedIndexForHistoryTabs: number = 0;
  showupcomingappts: boolean = false;
  showlastappts: boolean = false;
  tab: number = 0;
  ngOnInit() {

    this.MedicationFilterFormGroup = this.formBuilder.group({
      searchKey: [''],
    });
    this.dataSource.sort = this.sort;
    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          this.clientId = user.id;
          this.fromUserId = user.userID;
          this.userId = user.userID;
          this.locationId = user.locationID;
          //this.getClientProfileInfo();
          this.getClientMedication(this.filterModel);
         // this.getClientImmunization(this.filterModel);
         // this.getPatientAllergyList(this.filterModel);
          var today = new Date().toLocaleDateString();
          var dateArray = today.split("/");
          this.maxDate = new Date(Date.now());
          this.getPatientMedicalFamilyHistoryList();
          //this.getPatientInsuranceList();
        }
      }
    );
    // this.profileTabs = [
    //   "Immunization",0
    //   "Medication",1
    //   "Prescriptions",2
    //   "Allergies",3
    //   "Insurance",4
    //   "Health Plan Coverage",5
    //   "History",6
    //   "Documents",7
    // ];

    this.profileTabs = [
      "Medication",
      "Prescriptions",
      "Documents",
      "Immunization",
      "Allergies",
      "Insurance",
      "Health Plan Coverage",
      "History",
      
    ];

    // this.historyTabs = ["allergies", "Insurance", "Authorizations", "history"];
    this.testFormGroup = this.formBuilder.group({
      searchKey: "",
      rangeStartDate: null,
      rangeEndDate: null,
    });

    this.MedicationFilterFormGroup=this.formBuilder.group({
      searchKey: "",
    })

    this.filterModel = new FilterModel();
    this.testFormGroup.get("searchKey")!.valueChanges.pipe(
      distinctUntilChanged(),
      debounce(input => input.length <= 3 ? timer(3000):timer(0)),
      switchMap(searchTerm => this.searchapi(false))
    ).subscribe();

    this.MedicationFilterFormGroup.get("searchKey")!.valueChanges.pipe(
      distinctUntilChanged(),
      debounce(input => input.length <= 3 ? timer(3000):timer(0)),
      switchMap(searchTerm => this.searchapi(true))
    ).subscribe();

    this.getPrescriptionList(this.filterModel);
  }

  searchapi(isMedication: boolean): Observable<any> {
    if(isMedication){
      this.getClientMedication(this.filterModel);
    }
    else{
      this.getPrescriptionList(this.filterModel);
    }
   
    return of(null);
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
  getClientImmunization(filterModel: FilterModel) {
    this.clientService
      .getImmunizationList(this.clientId, filterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientImmunizationModel = response.data;
          if (response.meta) {
            this.metaData = response.meta;
          } else {
            this.metaData = new Metadata();
          }
        } else {
          this.clientImmunizationModel;
        }
      });
  }
  getClientMedication(filterModel: FilterModel) {
    ////debugger
    filterModel.searchText =
      this.m['searchKey'].value == null ? "" : this.m['searchKey'].value;
    this.clientService
      .getMedicationList(this.clientId, filterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientMedicationModel = response.data;
          this.dataSource.data = response.data;
          if (response.meta) this.metaDataMedication = response.meta;
          this.metaData = this.metaDataMedication;
        }
        else{
          this.metaData=new Metadata();
          this.dataSource.data = [];
        }
      });
  }

  getMasterData() {
    this.clientService
      .getMasterData("MASTERDOCUMENTTYPES")
      .subscribe((response: any) => {
        if (response != null)
          this.documentCategoryList = response.masterDocumentTypes =
            response.masterDocumentTypes != null
              ? response.masterDocumentTypes
              : [];
      });
  }

  getPatientAppointmentList() {
    this.clientService
      .getPatientAppointmentList(this.locationId, this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientAppointmentListModel = response.data;
        }
      });
  }
  getClientLabList = () => {
    const filter = {
      patientId: this.clientId,
      status: "Invitation_Accepted",
    };
    this.clientService
      .GetFilterLabAppointmentByPatientId(filter)
      .subscribe((res: ResponseModel) => {
        if (res != null && res.statusCode == 200) {
          this.clientLabListModel = res.data[0].appointmentLab;
          // console.log(res.data);
          console.log(res.data[0].appointmentLab[0]);
        }
      });
  };
  getPatientAllergyList(filterModel:any) {
    this.clientService
      .getAllergyList(this.clientId, this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientAllergyListModel = response.data;
          this.clientAllergyListModel = (response.data || []).map(
            (obj: any) => {
              obj.createdDate = format(obj.createdDate, "MM/dd/yyyy");
              obj.status = obj.isActive ? "ACTIVE" : "INACTIVE";
              return obj;
            }
          );
          if (response.meta) this.metaData = response.meta;
        } else {
          this.allergyListingData = [];
          this.metaData = new Metadata();
        }
      });
  }
  getPatientInsuranceList(filter: FilterModel) {
    this.clientService
      .getPatientInsurance(this.clientId, filter)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          //this.clientInsuranceListModel = response.data.PatientInsurance;
          this.clientInsuranceList = response.data.PatientInsurance;
          this.dataSource.data = response.data;
          this.metaData = response.meta;
          this.showLoader = false;
        } else {
          this.clientInsuranceList;
        }
      });
  }
  getPatientAuthorizationList() {
    this.clientService
      .getAllAuthorization(this.clientId, this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientAthorizationListModel = response.data.Authorization;
          this.metaData = response.meta;
        }
        console.log(response.data.Authorization);
      });
  }
  getPatientMedicalFamilyHistoryList() {
    this.clientService
      .getPatientMedicalFamilyHistoryList(this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          //this.patientMedicalFamilyHistoryModel = response.data;
          this.patientMedicalFamilyHistoryList = response.data;
        }
      });
  }
  getUserDocuments() {
    this.showLoader = true;
    if (this.userId != null) {
      if (this.categoryTypeId != null) {
        this.userDocRequest.FirstCall = false;
      } else {
        this.userDocRequest.FirstCall = true;
        this.userDocRequest.documentType = null;
      }
      this.clientService
        .getFilterUserDocuments(this.userDocRequest)
        .subscribe((response: ResponseModel) => {
          console.log(response);
          if (response != null) {
            if (response.meta) this.metaData = response.meta;
            this.documentList =
              response.data != null && response.data.length > 0
                ? response.data
                : [];
            this.filterDocumentList =
              response.data != null && response.data.length > 0
                ? response.data
                : [];

            this.documentList.map((ele:any) => {
              ele.createdDate = format(ele.createdDate, "dd-MM-yyyy");
            });
            this.documentList.map(
              (element:any) =>
              (element.documentTypeName =
                element.documentTypeNameStaff != null
                  ? element.documentTypeNameStaff
                  : element.documentTypeName != null
                    ? element.documentTypeName
                    : element.otherDocumentType)
            );

            this.filterDocumentList.map(
              (element:any) =>
              (element.documentTypeName =
                element.documentTypeNameStaff != null
                  ? element.documentTypeNameStaff
                  : element.documentTypeName != null
                    ? element.documentTypeName
                    : element.otherDocumentType)
            );
            this.documentList.map((element:any) => {
              if (element.extenstion == ".png") {
                element.extenstion = "../../../../../../assets/img/jpg.png";
              } else if (
                element.extenstion == ".jpg" ||
                element.extenstion == ".jpeg"
              ) {
                element.extenstion = "../../../../../../assets/img/jpg.png";
              } else if (element.extenstion == ".txt") {
                element.extenstion = "../../../../../../assets/img/txt.png";
              } else if (
                element.extenstion == ".xls" ||
                element.extenstion == ".xlsx"
              ) {
                element.extenstion = "../../../../../../assets/img/excel.png";
              } else if (
                element.extenstion == ".ppt" ||
                element.extenstion == ".pptx"
              ) {
                element.extenstion = "../../../../../../assets/img/ppt.png";
              } else if (
                element.extenstion == ".doc" ||
                element.extenstion == ".docx"
              ) {
                element.extenstion = "../../../../../../assets/img/doc.png";
              } else if (element.extenstion == ".pdf") {
                element.extenstion = "../../../../../../assets/img/pdf.png";
              }
            });
            this.filterDocumentList.map((element:any) => {
              if (element.extenstion == ".png") {
                element.extenstion = "../../../../../../assets/img/jpg.png";
              } else if (
                element.extenstion == ".jpg" ||
                element.extenstion == ".jpeg"
              ) {
                element.extenstion = "../../../../../../assets/img/jpg.png";
              } else if (element.extenstion == ".txt") {
                element.extenstion = "../../../../../../assets/img/txt.png";
              } else if (
                element.extenstion == ".xls" ||
                element.extenstion == ".xlsx"
              ) {
                element.extenstion = "../../../../../../assets/img/excel.png";
              } else if (
                element.extenstion == ".ppt" ||
                element.extenstion == ".pptx"
              ) {
                element.extenstion = "../../../../../../assets/img/ppt.png";
              } else if (
                element.extenstion == ".doc" ||
                element.extenstion == ".docx"
              ) {
                element.extenstion = "../../../../../../assets/img/doc.png";
              } else if (element.extenstion == ".pdf") {
                element.extenstion = "../../../../../../assets/img/pdf.png";
              }
            });
            this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
            this.showLoader = false;
          } else {
            this.documentList = [];
            this.filterDocumentList = [];
            this.metaData = new Metadata();
            this.showLoader = false;
          }
          this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
        });
    }
  }
  setIntialValues() {
    var date = new Date();
    this.userDocRequest.userId = this.userId;
    this.userDocRequest.CreatedBy = "Patient";
    this.userDocRequest.documentType =
      this.categoryTypeId != null ? this.categoryTypeId : null;

    console.log("Set:", this.userDocRequest.documentType);
    let startDate = new Date(date.getFullYear(), date.getMonth() - 10, 1);
    //let endDate = new Date().toLocaleDateString();
    let endDate = new Date(date.setDate(date.getDate() + 1));
    this.userDocRequest.fromDate = this.datePipe.transform(
      new Date(startDate),
      "MM/dd/yyyy"
    );
    this.userDocRequest.toDate = this.datePipe.transform(
      new Date(endDate),
      "MM/dd/yyyy"
    );

    this.getUserDocuments();
  }
  // addDateEvent = (type: string, event: MatDatepickerInputEvent<Date>) => {
  //   if (type == "to") {
  //     this.userDocRequest.toDate = this.datePipe.transform(
  //       new Date(event.value),
  //       "MM/dd/yyyy"
  //     );
  //     console.log();
  //   } else {
  //     this.userDocRequest.fromDate = this.datePipe.transform(
  //       new Date(event.value),
  //       "MM/dd/yyyy"
  //     );
  //   }
  // };
  addDateEvent = (type: string, event: MatDatepickerInputEvent<Date>) => {
    const dateValue = event.value ? new Date(event.value) : null;
  
    if (dateValue) {
      const formattedDate = this.datePipe.transform(dateValue, "MM/dd/yyyy");
  
      if (type === "to") {
        this.userDocRequest.toDate = formattedDate;
      } else {
        this.userDocRequest.fromDate = formattedDate;
      }
    } else {
      // Handle the case where the date is null, if necessary
      console.log("Date value is null");
    }
  };
  
  searchBydate = () => {
    this.getUserDocuments();
  };
  searchHandlar = (e:any) => {
    this.userDocRequest.searchCriteria = e;
    this.getUserDocuments();
  };

  onCategorySelectionChange(event: any) {
    this.categoryTypeId = event.value;
    this.selectedCategory = event.value;
    console.log(this.categoryTypeId);
    this.userDocRequest.pageNumber = 1;
    this.setIntialValues();
  }
  createModal(type:any, documentData:any) {
    if (this.userId != null) {
      let allData = {
        id: this.userId,
        type: type,
        documentData: documentData,
      };
      let documentModal;
      documentModal = this.dialogModal.open(DocumentModalComponent, {
        data: allData,
      });
      documentModal.afterClosed().subscribe((result: string) => {
        if (result == "save") this.getUserDocuments();
      });
    } else this.notifier.notify("error", "Please select user");
  }
  getDocumentDownloaded(value:any) {
    let key = "userdoc";
    if (value.data.key.toLowerCase() === "refferal") {
      key = "refferal";
    }

    this.clientService
      .getDocumentForDownlod(value.data.id, key)
      .subscribe((response: any) => {
        console.log(response);

        if (response.statusCode == 200) {
          var fileType:any = "";
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
              fileType = null;
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
  viewDocument = (act:any) => {
    // window.open(act.data.url, '_blank')
    let key = "userdoc";
    if (act.data.key.toLowerCase() === "refferal") {
      key = "refferal";
    }
    this.clientService
      .getDocumentForDownlod(act.data.id, key)
      .subscribe((response: any) => {
        console.log(response);

        if (response.statusCode == 200) {
          var fileType:any = "";
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
              fileType = null;
          }
          var binaryString = atob(response.data.base64);
          var bytes = new Uint8Array(binaryString.length);
          for (var i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          var newBlob = new Blob([bytes], {
            type: fileType,
          });

          const nav = window.navigator as any;
          if (nav && nav.msSaveOrOpenBlob) {
            nav.msSaveOrOpenBlob(newBlob);
            return;
          }
          const data = window.URL.createObjectURL(newBlob);
          var link = document.createElement("a");
          document.body.appendChild(link);
          link.href = data;
          link.target = "_blank";
          link.click();

          setTimeout(function () {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(data);
          }, 100);
        } else {

          this.notifier.notify("error", response.message);
        }
      });
  };
  deleteUserDocument(act: any) {
    let key = "userdoc";
    if (act.data.key.toLowerCase() === "refferal") {
      key = "refferal";
    }
    this.dialogService
      .confirm("Are you sure you want to delete this document?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deleteUserDocument(act.data.id, key)
            .subscribe((response: ResponseModel) => {
              if (response != null) {
                this.notifier.notify("success", response.message);
                this.getUserDocuments();
              } else {
                this.notifier.notify("error", "error occured");
              }
            });
        }
      });
  }
  onHealthPlanCoverageTableActionClick(event?: any) {
    ////debugger
    switch ((event.action || "").toUpperCase()) {
      case "EDIT":
        this.openAuthorizationDialog(event.data.authorizationId);
        break;
      case "DELETE":
        this.deleteAuthorizationDetails(event.data.authorizationId);
        break;
      default:
        break;
    }
  }
  onTableActionClick(actionObj?: any) {
    console.log(actionObj);
    switch ((actionObj.action || "").toUpperCase()) {
      case "DOWNLOAD":
        this.getDocumentDownloaded(actionObj);
        break;
      case "VIEW":
        this.viewDocument(actionObj);
        break;
      case "DELETE":
        this.deleteUserDocument(actionObj);
        break;
      default:
        break;
    }
  }
  onPageOrSortChangeDocument = (actObj:any) => {
    console.log("her", actObj);
    this.userDocRequest.pageNumber = actObj.pageNumber;
    this.userDocRequest.pageSize = actObj.pageSize;
    this.userDocRequest.sortOrder = actObj.order;
    this.userDocRequest.sortColumn = actObj.sort;
    this.getUserDocuments();
  };
  changeSearchHandler = (type: string) => {
    type === "toDate" ? (this.searchBox = false) : (this.searchBox = true);
    this.setIntialValues();
  };
  loadComponent(event: any) {
    this.filterModel.pageNumber = 1;
    this.metaData = new Metadata();
    this.prescriptionIds = [];
    this.stringprescriptionIds = "";
    this.dataSource.data = [];
    this.selectedIndex = event.index;

    switch (this.selectedIndex) {
      case 0: {
        this.tab = 0;
        this.getClientMedication(this.filterModel);
        break;
      
      }
      case 1: {
        this.tab = 1;
        this.clearFiltersPrescription();
        this.getPrescriptionList(this.filterModel);
        break;
     
      }
      case 2: {
        this.tab = 2;
        this.userDocRequest.FirstCall = true;
        console.log(this.userDocRequest.FirstCall);
        this.getMasterData();
        //  this.userDocRequest.pageNumber=1
        this.setIntialValues();
        // this.userDocRequest.FirstCall=false;
        //this.getUserDocuments();
        break;
       
      }
      case 3: {
        this.tab = 3;
        this.getClientImmunization(this.filterModel);
        break;
       
      }
      case 4: {
        this.tab = 4;
        this.getPatientAllergyList(this.filterModel);
        break;
      
      }
      case 5: {
        this.tab = 5;
        this.getPatientInsuranceList(this.filterModel);
        break;
        
      }
      case 6: {
        this.tab = 6;
        this.getPatientAuthorizationList();
        break;
       
      }
      case 7: {
        this.tab = 7;
        this.getPatientMedicalFamilyHistoryList();
        break;
        
      }
    }
  }
  DownloadPrescription(isMedication: any) {
    if (this.stringprescriptionIds) {
      this.prescriptiondownloadmodel.PrescriptionId =
        this.stringprescriptionIds;
      this.prescriptiondownloadmodel.patientId = this.clientId;
      this.prescriptiondownloadmodel.Issentprescription = false;
      this.prescriptiondownloadmodel.IsMedicationDownload = isMedication;

      this.clientsAgencyService
        .DownloadPrescription(this.prescriptiondownloadmodel)
        .subscribe((response: any) => {
          const files = Array.isArray(response) ? response : [response];
          files.forEach(file => {
            const byteArray = new Uint8Array(atob(file.fileContent).split("").map(char => char.charCodeAt(0)));
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const nav = window.navigator as any;
            this.clientsAgencyService.downLoadFile(
              blob,
              "application/pdf",
              `PrescriptionReport`
            );
          })
        });
    } else {
      this.notifier.notify("warning", "Please select Medication");
    }
  }

  ViewPrescription(isMedication: any, id?:any) {

    let valueset = false;
    if (isMedication) {
      if (this.stringprescriptionIds) {
        this.prescriptiondownloadmodel.PrescriptionId =
          this.stringprescriptionIds;
        this.prescriptiondownloadmodel.patientId = this.clientId;
        this.prescriptiondownloadmodel.Issentprescription = false;
        this.prescriptiondownloadmodel.IsMedicationDownload = isMedication;
        valueset = true;
      } else {
        this.notifier.notify("warning", "Please select Medication");
        valueset = false;
      }
    }
    else {
      this.prescriptiondownloadmodel.PrescriptionId =
        id;
      this.prescriptiondownloadmodel.patientId = this.clientId;
      this.prescriptiondownloadmodel.Issentprescription = false;
      this.prescriptiondownloadmodel.IsMedicationDownload = isMedication;
      valueset = true;
    }


    if (valueset)
      this.clientsAgencyService
        .DownloadPrescription(this.prescriptiondownloadmodel)
        .subscribe((response: any) => {

       ////   debugger

          const files = Array.isArray(response) ? response : [response];
          files.forEach(file => {
            const byteArray = new Uint8Array(atob(file.fileContent).split("").map(char => char.charCodeAt(0)));
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const nav = window.navigator as any;
            if (nav && nav.msSaveOrOpenBlob) {
              nav.msSaveOrOpenBlob(blob);
              return;
            }
            const data = window.URL.createObjectURL(blob);
            var link = document.createElement("a");
            document.body.appendChild(link);
            link.href = data;
            link.target = "_blank";
            link.click();

            setTimeout(function () {
              document.body.removeChild(link);
              window.URL.revokeObjectURL(data);
            }, 100);
          });
        });
  }


  toggle(event:any, row:any) {
    ////debugger
    let name = row.id;
    if (event.checked) {
      if (this.prescriptionIds.indexOf(name) === -1) {
        this.prescriptionIds.push(name);
        this.selection.select(row);
        this.disabled = false;
      }
    } else {
      const index = this.prescriptionIds.indexOf(name);
      if (index > -1) {
        this.prescriptionIds.splice(index, 1);
        this.selection.deselect(row);
      }
    }

    console.log(this.prescriptionIds);
    this.stringprescriptionIds = this.prescriptionIds.toString();
    console.log(this.stringprescriptionIds);
  }
  loadComponentForHistoryTabs(event: any) {
    this.selectedIndexForHistoryTabs = event.index;

    switch (this.selectedIndexForHistoryTabs) {
      case 0: {
        this.getPatientAllergyList(this.filterModel);
        break;
      }
      case 1: {
        this.getPatientInsuranceList(this.filterModel);
        break;
      }
      case 2: {
        this.getPatientAuthorizationList();
        break;
      }
      case 3: {
        this.getPatientMedicalFamilyHistoryList();
        break;
      }
    }
  }

  downloadingCcda: boolean = false;
  getPatientCCDA() {
    this.downloadingCcda = true;
    this.clientService
      .getPatientCCDA(this.clientId)
      .subscribe((response: any) => {
        this.clientService.downloadFile(
          response,
          "application/xml",
          "CCDA.zip"
        );
        if (response) this.downloadingCcda = false;
      });
  }
  //chat
  getChatHistory() {
    if (this.clientProfileModel.patientInfo.length > 0) {
      this.clientService
        .getChatHistory(
          this.fromUserId,
          this.clientProfileModel.patientInfo[0].renderingProviderId
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
  // editProfile(event: any) {
  //   this.router.navigate(["/web/client/client-profile"], {
  //     queryParams: {
  //       id:
  //         this.clientId != null
  //           ? this.commonService.encryptValue(this.clientId, true)
  //           : null
  //     }
  //   });
  // }

  // pastAppoinment() {
  //   this.router.navigate(["/web/client/clientencounter"], {
  //     queryParams: {
  //       id:
  //         this.clientId != null
  //           ? this.commonService.encryptValue(this.clientId, true)
  //           : null
  //     }
  //   });
  // }
  formatDate(date: Date): string {
    if (!date) {
      return "";
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    return formattedDate;
  }

  get f() {
    return this.testFormGroup.controls;
  }

  get m(){
    return this.MedicationFilterFormGroup.controls;
  }

  getPrescriptionList(filterModel:any) {
   //// debugger
    this.filterModel.fromDate = this.formatDate(
      this.f['rangeStartDate'].value
    );
    this.filterModel.toDate = this.formatDate(
      this.f['rangeEndDate'].value
    );
    this.filterModel.searchText =
      this.f['searchKey'].value == null ? "" : this.f['searchKey'].value;
    this.clientsAgencyService
      .getPrescriptionList(this.clientId, this.filterModel, 0)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.clientPrescriptionDistinctModel = (response.data || []).map(
            (obj: any) => {
              obj.createdDate = format(obj.createdDate, "MM/dd/yyyy");
              // obj.startDate = format(obj.startDate, "MM/dd/yyyy");
              // obj.endDate = format(obj.endDate, "MM/dd/yyyy");
              // obj.status = obj.isActive ? "ACTIVE" : "INACTIVE";
              return obj;
            }
          );
        ////  debugger
         // this.dataSource.data = this.clientPrescriptionDistinctModel;
          this.metaDataPrescription = response.meta || new Metadata();
          this.metaData = this.metaDataPrescription;
        } else {
          this.clientPrescriptionModel = [];
          this.dataSource.data = [];
          this.metaDataPrescription = new Metadata();
          this.metaData = new Metadata();
        }
      });
  }

  onPageOrSortChangeAllergy(changeState?: any) {
    changeState.pageNumber = changeState.pageIndex + 1;
    this.setPaginatorModel(
      changeState.pageNumber,
      this.filterModel.pageSize,
      "",
      "",
      this.filterModel.searchText
    );
    // this.getPrescriptionList(this.filterModel);
  }
  onPageOrSortChange(changeState?: any) {
    changeState.pageNumber = changeState.pageIndex + 1;
    this.setPaginatorModel(
      changeState.pageNumber || this.filterModel.pageNumber,
      changeState.pageSize ||this.filterModel.pageSize,
      changeState.active||"",
      changeState.direction||"",
      this.filterModel.searchText
    );
    if (this.tab == 0) this.getClientMedication(this.filterModel);
    else if (this.tab == 1) this.getPrescriptionList(this.filterModel);
    else if (this.tab == 2) {
       this.userDocRequest.pageNumber = this.metaData.currentPage;
       this.setIntialValues();
     }
    else if (this.tab == 3) this.getClientImmunization(this.filterModel);
    else if (this.tab == 4) this.getPatientAllergyList(this.filterModel);
    else if (this.tab == 5) this.getPatientInsuranceList(this.filterModel);
    else if (this.tab == 6) this.getPatientAuthorizationList();
  }
  onPageOrSortChangeMedication(changeState?: any) {
    changeState.pageNumber = changeState.pageIndex + 1;
    this.setPaginatorModel(
      changeState.pageNumber,
      this.filterModel.pageSize,
      "",
      "",
      this.filterModel.searchText
    );
    this.getClientMedication(this.filterModel);
  }

  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    searchText: string
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle(ev:any) {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row:any) => {
        this.selection.select(row);
      });

    this.prescriptionIds = [];
    this.dataSource.data.forEach((row:any) => {
      if (this.selection.isSelected(row)) {
        this.prescriptionIds.push(row.id);
      }
    });
    //console.log(this.prescriptionIds);
    this.stringprescriptionIds = this.prescriptionIds.toString();
    //console.log(this.stringprescriptionIds);
  }
  openDialog = () => { };
  deleteDetails(prescriptionNo: string, clientId: number) {
    //console.log("clientid");
    console.log("delete", prescriptionNo, clientId);
    this.dialogService
      .confirm("Are you sure want to delete this prescription?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientsAgencyService
            .deletePrescription(prescriptionNo, clientId)
            .subscribe((res: any) => {
              if (res != null && res.data != null) {
                if (res.statusCode == 200) {
                  this.notifier.notify("success", res.message);
                  //window.location.reload();
                  this.getPrescriptionList(this.filterModel);
                } else {
                  this.notifier.notify("error", res.message);
                }
              }
            });
        }
      });
  }

  sharePrescriptionToPharmacy() {
    const dialog = this.pharmacyDialog.open(PharmacyDialogComponent, {
      width: "150px",
      data: {
        prescriptionId: this.prescriptionIds,
        patientId: this.clientId,
      },
    });
  }
  disableButton() {
    return (
      this.immunizationList &&
      this.immunizationList.length > this.maxAllowedLimit
    );
  }
  //open popup and map model on popup for Immunization
  openImmunizationDialog(immu?: any) {
    console.log("Immunization", immu);
    if (immu != null) {
      this.createImmunizationModal(immu.data);
    } else {
      let immu = new PatientImmunization();
      immu.patientID = this.clientId;
      immu.id = 0;
      this.createImmunizationModal(immu);
    }
    // if (id != null && id > 0) {
    //   this.clientService.getImmunizationById(id).subscribe((response: any) => {
    //     if (response != null && response.data != null) {
    //       this.immunizationModel = response.data;
    //       this.createImmunizationModal(this.immunizationModel);
    //     }
    //   });
    // }
    // else {
    //   this.immunizationModel = new ImmunizationModel();
    //   this.createImmunizationModal(this.immunizationModel);
    // }
  }
  //create modal popup of immunization for create or update
  createImmunizationModal(immunizationmodel: PatientImmunization) {
    var immunizationModal = this.dialogModal.open(ImmunizationModalComponent, {
      hasBackdrop: true,

      data: {
        immunization: immunizationmodel,
      }
    });
    immunizationModal.afterClosed().subscribe((result: string) => {
      if (result == "save") {
        this.getClientImmunization(this.filterModel);
        //this.showLoader= true;
      }
    });
  }
  //delete immunization
  deleteImmunization(id: number, clientId: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this immunization?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deleteImmunization(id, clientId)
            .subscribe((response: any) => {
              if (response != null && response.data != null) {
                if (response.statusCode == 200) {
                  this.notifier.notify("success", response.message);
                  this.getClientImmunization(this.filterModel);
                } else {
                  this.notifier.notify("error", response.message);
                }
              }
            });
        }
      });
  }
  onImmunizationTableActionClick(actionObj?: any) {
    switch ((actionObj.action || "").toUpperCase()) {
      case "EDIT":
        this.openImmunizationDialog(actionObj);
        break;
      case "DELETE":
        this.deleteImmunization(actionObj.data.id, this.clientId);
        break;
      default:
        break;
    }
  }
  // getUserPermissions() {
  //   const actionPermissions = this.clientService.getUserScreenActionPermissions('CLIENT', 'CLIENT_IMMUNIZATION_LIST');
  //   const { CLIENT_IMMUNIZATION_LIST_ADD, CLIENT_IMMUNIZATION_LIST_UPDATE, CLIENT_IMMUNIZATION_LIST_DELETE } = actionPermissions;

  //   this.addPermission = CLIENT_IMMUNIZATION_LIST_ADD || false;
  //   this.updatePermission = CLIENT_IMMUNIZATION_LIST_UPDATE || false;
  //   this.deletePermission = CLIENT_IMMUNIZATION_LIST_DELETE || false;

  // }
  get hasRecords(): boolean {
    return this.metaData?.totalRecords > 0;
}
  //// Medication
  openMedicationDialog(medi?: any) {
    console.log("Open Modal Hit", medi);
    if (medi != null) {
      this.createMedicationModal(medi);
      console.log(medi);
    } else {
      this.medicationModel = new MedicationModel();
      this.medicationModel.patientId = this.clientId;
      this.createMedicationModal(this.medicationModel);
    }
    // if (id != null && id > 0) {
    //   this.clientService.getmedicationById(id).subscribe((response: any) => {
    //     if (response != null && response.data != null) {
    //       this.medicationModel = response.data;
    //       this.createMedicationModal(this.medicationModel);
    //     }
    //   });
    // } else {
    //   this.medicationModel = new MedicationModel();
    //   this.createMedicationModal(this.medicationModel);
    // }
  }
  createMedicationModal(medicationModel: MedicationModel) {
    medicationModel.patientId = this.clientId;
    console.log("CreateModal Hit:", medicationModel);
    var medicationModal = this.dialogModal.open(MedicationModalComponent, {
      hasBackdrop: true,
      data: medicationModel || new MedicationModel(),
    });
    medicationModal.afterClosed().subscribe((result: string) => {
      if (result == "SAVE") this.getClientMedication(this.filterModel);
    });
  }

  deleteMedication(id: number, clientId: number) {
    console.log("clientid");
    console.log("delete", id, clientId);
    this.dialogService
      .confirm("Are you sure you want to delete this family history?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deleteMedication(id, clientId)
            .subscribe((response: any) => {
              if (response != null && response.data != null) {
                if (response.statusCode == 200) {
                  this.notifier.notify("success", response.message);
                  this.getClientMedication(this.filterModel);
                } else {
                  this.notifier.notify("error", response.message);
                }
              }
            });
        }
      });
  }

  ////Allergy
  openAllergyDialog(allergy?: AllergyModel | any) {
   ///
    if (allergy != null) {
      allergy.patientId = this.clientId;
      this.createAllergyModel(allergy);
    } else {
      let allergyObj = new AllergyModel();
      allergyObj.patientId = this.clientId;
      allergyObj.id = 0;
      this.createAllergyModel(allergyObj);
    }
    // if (id != null && id > 0) {
    //   this.clientService.getAllergyById(id).subscribe((response: any) => {
    //     if (response != null && response.data != null) {
    //       this.allergyData = response.data;
    //       this.createAllergyModel(this.allergyData);
    //     }
    //   });
    // } else {
    //   this.allergyData = new AllergyModel();
    //   this.createAllergyModel(this.allergyData);
    // }
  }

  //create modal
  createAllergyModel(allergyData: AllergyModel) {
    const modalPopup = this.dialogModal.open(AllergiesModalComponent, {
      hasBackdrop: true,
      // data: allergyData,
      data: { allergy: allergyData },
    });

    modalPopup.afterClosed().subscribe((result:any) => {
      if (result === "save") {
        this.getPatientAllergyList(this.filterModel);
      }
    });
  }
  deleteAllergyDetails(id: number, clientId: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this allergy?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deleteAllergy(id, clientId)
            .subscribe((response: any) => {
              if (response.statusCode === 200) {
                this.notifier.notify("success", response.message);
                this.getPatientAllergyList(this.filterModel);
              } else if (response.statusCode === 401) {
                this.notifier.notify("warning", response.message);
              } else {
                this.notifier.notify("error", response.message);
              }
            });
        }
      });
  }
  onAllergyTableActionClick(actionObj?: any) {
    switch ((actionObj.action || "").toUpperCase()) {
      case "EDIT":
        this.openAllergyDialog(actionObj);
        break;
      case "DELETE":
        this.deleteAllergyDetails(actionObj.data.id, this.clientId);
        break;
      default:
        break;
    }
  }
  //// Authorization
  //open popup
  openAuthorizationDialog(id?: any) {
    if (id != null && id > 0) {
      this.clientService.getAuthorizationById(id).subscribe((response: any) => {
        if (
          response != null &&
          response.statusCode == 200 &&
          response.data != null
        ) {
          this.authModel = response.data;
          this.createAuthorizationModel(this.authModel);
        }
      });
    } else {
      this.authModel = new AuthModel();
      this.authModel.patientID = this.clientId;
      this.createAuthorizationModel(this.authModel);
    }
  }

  //create modal
  createAuthorizationModel(authModel: AuthModel) {
    authModel.patientID = this.clientId;
    const modalPopup = this.dialogModal.open(AuthorizationModalComponent, {
      hasBackdrop: true,
      data: authModel || new AuthModel(),
    });

    modalPopup.afterClosed().subscribe((result:any) => {
      if (result === "save") {
        this.authorizationFilterModel = new AuthorizationFilterModel();
        //listing of all authorization
        this.getPatientAuthorizationList();
      }
    });
  }

  deleteAuthorizationDetails(id: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this authorization?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deleteAuthorization(id)
            .subscribe((response: any) => {
              if (response.statusCode == 200 || response.statusCode == 204) {
                this.notifier.notify("success", response.message);
                this.authorizationFilterModel = new AuthorizationFilterModel();
                //listing of all authorization
                this.getPatientAuthorizationList();
              } else if (response.statusCode === 401) {
                this.notifier.notify("warning", response.message);
              } else {
                this.notifier.notify("error", response.message);
              }
            });
        }
      });
  }

  ////History
  openHistoryDialog(id?: number) {
    if (id != null && id > 0) {
      this.clientService
        .getPatientMedicalFamilyHistoryById(id)
        .subscribe((response: any) => {
          if (response != null && response.data != null) {
            this.patientMedicalFamilyHistoryModel = response.data;
            this.createHistoryModal(this.patientMedicalFamilyHistoryModel);
          }
        });
    } else {
      this.patientMedicalFamilyHistoryModel =
        new PatientMedicalFamilyHistoryModel();
      this.createHistoryModal(this.patientMedicalFamilyHistoryModel);
    }
  }

  createHistoryModal(
    patientMedicalFamilyHistoryModel: PatientMedicalFamilyHistoryModel
  ) {
    this.patientMedicalFamilyHistoryModel.patientID = this.clientId;
    let historyModal;
    historyModal = this.dialogModal.open(FamilyHistoryModelComponent, {
      data: patientMedicalFamilyHistoryModel,
    });
    console.log(historyModal);
    historyModal.afterClosed().subscribe((result: string) => {
      if (result == "SAVE") this.getPatientMedicalFamilyHistoryList();
    });
  }

  deleteHistory(id: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this family history?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deletePatientMedicalFamilyHistory(id)
            .subscribe((response: any) => {
              if (response != null && response.data != null) {
                if (response.statusCode == 204) {
                  this.notifier.notify("success", response.message);
                  this.getPatientMedicalFamilyHistoryList();
                } else {
                  this.notifier.notify("error", response.message);
                }
              }
            });
        }
      });
  }
  ////Insurance
  openInsuranceDialog(insu?: any) {
    console.log("Id", insu);
    if (insu != null) {
      this.createInsuranceModal(insu.data);
    } else {
      this.createInsuranceModal(null);
    }
  }
  createInsuranceModal(clientInsuranceListModel: PatientInsuranceModel | any) {
    var insuranceModal = this.dialogModal.open(InsuranceModalComponent, {
      hasBackdrop: true,
      data: clientInsuranceListModel != null ? clientInsuranceListModel : { patientID: this.clientId, id: 0 },
    });

    insuranceModal.afterClosed().subscribe((result: string) => {
      if (result === "Save") {
        this.getPatientInsuranceList(this.filterModel);
        this.showLoader = true;
      }
    });
  }
  deleteInsurance(id: number, clientId: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this insurance?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deletePatientInsurance(id, clientId)
            .subscribe((response: any) => {
              if (response != null && response.data != null) {
                if (response.statusCode == 204) {
                  this.notifier.notify("success", response.message);
                  this.getPatientInsuranceList(this.filterModel);
                } else {
                  this.notifier.notify("error", response.message);
                }
              }
            });
        }
      });
  }
  // onInsuranceTableActionClick(actionObj?: any) {
  //   switch ((actionObj.action || "").toUpperCase()) {
  //     case "EDIT":
  //       this.openInsuranceDialog(actionObj);
  //       break;
  //     case "DELETE":
  //       this.deleteInsurance(actionObj.data.id, this.clientId);
  //     default:
  //       break;
  //   }
  // }

  onInsuranceTableActionClick(actionObj?: any) {
    const action = (actionObj?.action || "").toUpperCase();
  
    switch (action) {
      case "EDIT":
        this.openInsuranceDialog(actionObj);
        break;
      case "DELETE":
        if (actionObj?.data?.id && this.clientId) {
          this.deleteInsurance(actionObj.data.id, this.clientId);
        }
        break;
      default:
        // Handle unknown actions or do nothing
        break;
    }
  }
  

  historyTabChange = (event:any) => {
    console.log(event);
    this.selectedIndexForHistoryTabs = event.index;
  };

  applyEndDateFilter(event: MatDatepickerInputEvent<Date>) {
    const endDate = event.value;
   //// debugger
   if(event.value){
    this.f['rangeEndDate'].setValue(new Date(event.value));
    this.getPrescriptionList(this.filterModel);
   }
    
  }

  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    const startDate = event.value;
   //// debugger
   if(event.value)
    this.f['rangeStartDate'].setValue(new Date(event.value));
    this.getPrescriptionList(this.filterModel);
  }

  clearFilters(): void {

    this.filterString = null;
    this.categoryTypeId = null;
    this.userDocRequest.pageNumber = 1;
    this.userDocRequest.pageSize = 5;
    this.selectedCategory = null;
    this.userDocRequest.documentType = null;
    this.userDocRequest.FirstCall = true;
    this.userDocRequest.searchCriteria = "";
    this.setIntialValues();
  }

  clearFiltersPrescription() {
    this.testFormGroup.reset({
      searchKey: "",
      rangeStartDate: null,
      rangeEndDate: null,
    });
    this.getPrescriptionList(this.filterModel);
  }

  clearFilterMedication(){
    this.MedicationFilterFormGroup.reset({
      searchKey: "",
    })
    this.getClientMedication(this.filterModel);
  }
}






