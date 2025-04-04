import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MedicationModel } from "./medication.model";
import { ClientsService } from "../clients.service";
import { DialogService } from "../../../../../shared/layout/dialog/dialog.service";
import { MatDialog } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { FilterModel, ResponseModel } from "../../../core/modals/common-model";
import { format } from "date-fns";
import { MedicationModalComponent } from "./medication-modal/medication-modal.component";
import { CommonService } from "../../../core/services";
import { AddPrescriptionComponent } from "../prescription/prescription-addprescription/prescription-addprescription.component";
import { TranslateService } from "@ngx-translate/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { debounce, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Observable, of, timer } from "rxjs";

@Component({
  selector: "app-medication",
  templateUrl: "./medication.component.html",
  styleUrls: ["./medication.component.css"],
})
export class MedicationComponent implements OnInit {
  medicationModel: MedicationModel = new MedicationModel;
  medicationList: Array<MedicationModel> = [];
  clientId!: number;
  addPermission: boolean = false;
  updatePermission: boolean = false;
  deletePermission: boolean = false;
  header: string = "Client Medication";
  tooltipdMessage = "Maximum 7 medications are allowed";
  maxAllowedLimit = 12;
  isHistoryShareable: boolean = false;
  @Input() encryptedPatientId:any;
  @Input() appointmentId: number = 0;
  @ViewChild("tabContent", { read: ViewContainerRef })
  tabContent!: ViewContainerRef;
  MedicationFilterFormGroup!: FormGroup;
  filterModel: FilterModel = new FilterModel;
  constructor(
    private activatedRoute: ActivatedRoute,
    private clientsService: ClientsService,
    private dialogService: DialogService,
    private medicationDialogModal: MatDialog,
    private notifier: NotifierService,
    private commonService: CommonService,
    private cfr: ComponentFactoryResolver,
    private translate: TranslateService,
    private formBuilder: FormBuilder,

  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    if (this.encryptedPatientId == undefined) {
      const apptId = this.activatedRoute.snapshot.paramMap.get("id");
      this.activatedRoute.queryParams.subscribe((params) => {
        this.clientId =
          params["id"] == undefined
            ? this.commonService.encryptValue(apptId, false)
            : this.commonService.encryptValue(params["id"], false);
      });
    } else {
      console.log(this.appointmentId)
      this.clientId = this.commonService.encryptValue(
        this.encryptedPatientId,
        false
      );
    }
    this.MedicationFilterFormGroup = this.formBuilder.group({
      searchKey: "",
    })

    this.filterModel=new FilterModel();
    this.MedicationFilterFormGroup.get("searchKey")!.valueChanges.pipe(
      distinctUntilChanged(),
      debounce(input => input.length <= 3 ? timer(3000) : timer(0)),
      switchMap(searchTerm => this.searchapi())
    ).subscribe();

    //initialization of model
    this.medicationModel = new MedicationModel();
    this.medicationList = [];
    this.getAppointmentDetails();


    if (this.appointmentId && this.appointmentId > 0) {
      // this.getmedicationByAppointmentId();
      this.getMedicationList();
    } else {
      this.getMedicationList();
    }
    this.getUserPermissions();
    // this.showPrescription();
  }


  searchapi(): Observable<any> {

    this.getMedicationList();
    return of(null);
  }

  get m() {
    return this.MedicationFilterFormGroup.controls;
  }  


  getAppointmentDetails() {
    this.commonService.loadingStateSubject.next(true);
    this.clientsService
      .getClientProfileInfo(this.clientId)
      .subscribe((responce) => {
        this.isHistoryShareable =
          responce.data.patientInfo[0].isHistoryShareable;
        this.isHistoryShareable = this.appointmentId == 0 ? this.isHistoryShareable : false;
        this.commonService.loadingStateSubject.next(false);
      });
  }

  showPrescription() {
    let factory = this.cfr.resolveComponentFactory(AddPrescriptionComponent);
    this.tabContent.clear();
    let comp: ComponentRef<AddPrescriptionComponent> =
      this.tabContent.createComponent(factory);
    comp.instance.showbuttons = false;
  }

  getMedicationList() {
    debugger
    this.filterModel.searchText =
      this.m["searchKey"].value == null ? "" : this.m["searchKey"].value;
    this.clientsService
      .getMedicationList(this.clientId,this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (
          response != null &&
          response.data != null &&
          response.data.length > 0 &&
          response.statusCode == 200
        ) {
          this.medicationList = response.data;
          this.medicationList = (response.data || []).map((obj: any) => {
            obj.startDate = format(obj.startDate, 'dd/MM/yyyy');
            obj.endDate = format(obj.endDate, 'dd/MM/yyyy');
            return obj;
          });
        } else {
          this.medicationList=[];
        }
      });
  }
 

  getmedicationByAppointmentId() {
    this.clientsService
      .getmedicationByAppointmentId(this.appointmentId)
      .subscribe((response: ResponseModel) => {
        if (
          response != null &&
          response.data != null &&
          response.data.length > 0 &&
          response.statusCode == 200
        ) {
          this.medicationList = response.data;
          this.medicationList = (response.data || []).map((obj: any) => {
            obj.startDate = format(obj.startDate, 'dd/MM/yyyy');
            obj.endDate = format(obj.endDate, 'dd/MM/yyyy');
            return obj;
          });
        } else {
          this.medicationList;
        }
      });
  }

  openDialog(id?: number) {
    console.log(id);
    if (id != null && id > 0) {
      this.clientsService.getmedicationById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.medicationModel = response.data;
          this.createModal(this.medicationModel);
        }
      });
    } else {
      this.medicationModel = new MedicationModel();
      this.createModal(this.medicationModel);
    }
  }

  createModal(medicationModel: MedicationModel) {
    this.medicationModel.patientId = this.clientId;
    this.medicationModel.appointmentId = this.appointmentId;
    let medicationModal;
    medicationModal = this.medicationDialogModal.open(
      MedicationModalComponent,
      {
        data: {
          medication: this.medicationModel,
          refreshGrid: this.refreshGrid.bind(this),
        },
      }
    );
    medicationModal.afterClosed().subscribe((result: string) => {
      if (result == "SAVE") {
        if (this.appointmentId && this.appointmentId > 0) {
          // this.getmedicationByAppointmentId();
          this.getMedicationList();
        } else {
          this.getMedicationList();
        }
      }
    });
  }
  refreshGrid() {
    this.getMedicationList();
  }

  delete(id: number, patientId: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this family history?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientsService
            .deleteMedication(id, patientId)
            .subscribe((response: any) => {
              if (response != null && response.data != null) {
                if (response.statusCode == 200) {
                  this.notifier.notify("success", response.message);
                  this.getMedicationList();
                } else {
                  this.notifier.notify("error", response.message);
                }
              }
            });
        }
      });
  }

  clearFilterMedication(){
    this.MedicationFilterFormGroup.reset({
      searchKey: "",
    })
    this.getMedicationList();
  }

  getUserPermissions() {
    const actionPermissions =
      this.clientsService.getUserScreenActionPermissions(
        "CLIENT",
        "CLIENT_MEDICATION_LIST"
      );
    const {
      CLIENT_MEDICATION_LIST_ADD,
      CLIENT_MEDICATION_LIST_UPDATE,
      CLIENT_MEDICATION_LIST_DELETE,
    } = actionPermissions;

    this.addPermission = CLIENT_MEDICATION_LIST_ADD || false;
    this.updatePermission = CLIENT_MEDICATION_LIST_UPDATE || false;
    this.deletePermission = CLIENT_MEDICATION_LIST_DELETE || false;
  }

  disableButton() {
    return (
      this.medicationList && this.medicationList.length > this.maxAllowedLimit
    );
  }
}
