import { Component, OnInit, Output, EventEmitter, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClientsService } from "../../clients.service";
import { NotifierService } from "angular-notifier";
import { ReplaySubject, Subject, of, Observable } from "rxjs";
import {
  filter,
  tap,
  takeUntil,
  debounceTime,
  map,
  finalize,
  delay,
  catchError,
} from "rxjs/operators";
import { format } from "date-fns";
import { MedicationModel } from "../../medication/medication.model";
import { PrescriptionModel } from "../prescription.model";
import { TranslateService } from "@ngx-translate/core";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";


class DrugModelData {
  "id"?: number;
  "drugName"?: string;
  "value"?: string;
}

@Component({
  selector: "app-prescription-modal",
  templateUrl: "./prescription-modal.component.html",
  styleUrls: ["./prescription-modal.component.css"],
})
export class PrescriptionModalComponent implements OnInit {
  prescriptionModel: PrescriptionModel[];
  prescriptionForm!: FormGroup;
  submitted: boolean = false;
  headerText: string = "Add Prescription";
  masterFrequencyType: any[] = [];
  masterPrescriptionType: any[] = [];
  patientId: number;
  createdBy: number;
  createdDate: string;
  maxDate = new Date();
  private isEdit: boolean;
  // autocomplete
  filterCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public filteredServerSideprescription: ReplaySubject<any[]> =
    new ReplaySubject<any[]>(1);
  fetchedFilteredServerSideprescription: Array<any> = [];
  selectFilteredServerSideprescription: Array<any>;
  selectstrengthdoseServerSideprescription: Array<any> = [];
  protected _onDestroy = new Subject<void>();
  notesControl!: FormControl;
  PrescriptionNotes: string = '';
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();
  appointmentId: number = 0;
  prescriptionNo!: number;

  //construtor
  constructor(
    private formBuilder: FormBuilder,

    private medicationDialogModalRef: MatDialogRef<PrescriptionModalComponent>,
    private clientService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private translate: TranslateService,
    private dialogService: DialogService
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    console.log("reedata", this.data);
    debugger
    this.prescriptionModel = data.allergy;
    this.refreshGrid.subscribe(data.refreshGrid);
    this.patientId = this.prescriptionModel[0].patientId;

    if (this.prescriptionModel[0].id != null && this.prescriptionModel[0].id > 0) {
      this.headerText = "Edit Prescription";
      this.isEdit = true;

    } else {
      this.headerText = "Add Prescription";
      this.isEdit = false;
    }
    // this.patientId = this.prescriptionModel.patientId;
    console.log("ree", this.patientId);
    debugger
    this.createdBy = this.prescriptionModel[0].createdBy;
    this.createdDate = this.prescriptionModel[0].createdDate;
    debugger
    this.appointmentId = this.prescriptionModel[0].appointmentId;

    this.selectFilteredServerSideprescription = this.prescriptionModel[0].id
      ? [{ id: this.prescriptionModel[0].id, value: this.prescriptionModel[0].id }]
      : [];


  }

  ngOnInit() {
    debugger
    this.prescriptionForm = this.formBuilder.group({
      medication: this.formBuilder.array([]),
    });
    this.notesControl = new FormControl('');
    if (this.prescriptionModel[0].id != null && this.prescriptionModel[0].id > 0) {
      const medicationArray = this.getPrescriptions();
      this.prescriptionNo = this.prescriptionModel[0].prescriptionNo != null ? this.prescriptionModel[0].prescriptionNo : 0;
      this.PrescriptionNotes = this.prescriptionModel[0].notes != null ? this.prescriptionModel[0].notes : "";
      this.notesControl.setValue(this.PrescriptionNotes);
      debugger

      this.prescriptionModel.forEach(element => {
        medicationArray.push(this.createMedicationGroup(element));
      });

    }
    else {
      this.prescriptionNo=0;
      this.addMedication();
    }

    this.getMasterData();

    this._filter("").subscribe(
      (filteredMembers) => {
        this.fetchedFilteredServerSideprescription = filteredMembers;
        this.filteredServerSideprescription.next(filteredMembers);
      },
      (error) => {

      }
    );

    this.filterCtrl.valueChanges
      .pipe(
        tap(() => (this.searching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (search.length > 2 || search.length == 0) {
            return this._filter(search).pipe(finalize(() => (this.searching = false)));
          } else {
            return of([]);
          }
        }),
        delay(500)
      )
      .subscribe(
        (filteredMembers) => {
          this.searching = false;
          filteredMembers.subscribe((res) => {
            this.fetchedFilteredServerSideprescription = res;
            this.filteredServerSideprescription.next(res);
          });
        },
        (error) => {
          this.searching = false;

        }
      );
  }

  addMedication() {
    const medicationArray = this.getPrescriptions();
    medicationArray.push(this.createMedicationGroup());

  }

  onprescriptSelect(event?:any){

  }

  createMedicationGroup(prescriptionModel: any = {}): FormGroup {
    return this.formBuilder.group({
      id: [prescriptionModel.id !== undefined ? prescriptionModel.id : null],
      dose: [prescriptionModel.dose !== undefined ? prescriptionModel.dose : null],
      endDate: [prescriptionModel.endDate !== undefined ? prescriptionModel.endDate : null],
      frequencyID: [prescriptionModel.frequencyID !== undefined ? prescriptionModel.frequencyID : null],
      medicine: [prescriptionModel.medicine !== undefined ? prescriptionModel.medicine : null],
      startDate: [prescriptionModel.startDate !== undefined ? prescriptionModel.startDate : null],
      strength: [prescriptionModel.strength !== undefined ? prescriptionModel.strength : null],
      masterMedicationId: [prescriptionModel.masterMedicationId !== undefined ? prescriptionModel.masterMedicationId : null],
      duration: [prescriptionModel.duration !== undefined ? prescriptionModel.duration : null],
      notes: [prescriptionModel.notes !== undefined ? prescriptionModel.notes : null],
      drugID: [prescriptionModel.drugID !== undefined ? prescriptionModel.drugID : null],
      directions: [prescriptionModel.directions !== undefined ? prescriptionModel.directions : null],
      prescriptionNo: [prescriptionModel.prescriptionNo !== undefined ? prescriptionModel.prescriptionNo : null]

    });
  }


  removeMedication(index: number) {
    debugger
    const medications = this.getPrescriptions();
    const medication = medications.at(index);
    if (medication) {
      if (this.prescriptionNo != null && medication.value.id != null) {
        this.deleteDetails(medication.value.id, this.patientId, index);
      }
      else {
        this.getPrescriptions().removeAt(index);
      }
    }
  }

  getPrescriptions(): FormArray {
    return this.prescriptionForm.get('medication') as FormArray;
  }

  _filter(value: string): Observable<any> {
    const filterValue = value.toLowerCase();
    return this.clientService.getMasterPrescriptionDrugsByFilter(filterValue).pipe(
      map((response: any) => {
        if (response.statusCode != 200) return [];
        else
          return (response.data || []).map((dObj: any) => {
            const Obj: DrugModelData = {
              id: dObj.id,
              value: `${dObj.drugName || ""}`,
            };
            return Obj;
          });
      }),
      catchError((_) => {
        return [];
      })
    );
  }


  deleteDetails(id: any, clientId: number, index: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this prescription?")
      .subscribe((result: any) => {
        if (result == true) {
          debugger
          this.clientService
            .deletePrescriptionById(id, clientId)
            .subscribe((response: any) => {
              if (response.statusCode === 200) {
                this.getPrescriptions().removeAt(index);
                this.notifier.notify("success", response.message);

              } else if (response.statusCode === 401) {
                this.notifier.notify("warning", response.message);
              } else {
                this.notifier.notify("error", response.message);
              }
            });
        }
      });
  }

  get getSlectFilteredServerSideMedication() {
    return (this.selectFilteredServerSideprescription || []).filter((x) => {
      if (
        (this.fetchedFilteredServerSideprescription || []).findIndex(
          (y) => y.id == x.id
        ) > -1
      )
        return false;
      else return true;
    });
  }

  getMasterData() {
    let data = "FREQUENCYTYPE";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterFrequencyType =
          response.masterFrequencyType != null
            ? response.masterFrequencyType
            : [];
        this.masterPrescriptionType =
          response.masterPrescriptionDrugs != null
            ? response.masterPrescriptionDrugs
            : [];
      }
    });
  }

  get formControls() {
    return this.prescriptionForm.controls;
  }

  getFormGroupControl(index: number, controlName: string) {
    return (this.getPrescriptions().at(index) as FormGroup).get(controlName);
  }

  // onSubmit(event: any) {
  //   if (!this.prescriptionForm.invalid) {
  //     let clickType = event.currentTarget.name;
  //     this.submitted = true;
  //     this.prescriptionModel = this.prescriptionForm.value;
  //     this.prescriptionModel.patientId = this.patientId;
  //     this.prescriptionModel.createdBy = this.createdBy;
  //     this.prescriptionModel.createdDate = this.createdDate;
  //     this.prescriptionModel.appointmentId = this.appointmentId;
  //     this.prescriptionModel.startDate != null
  //       ? (this.prescriptionModel.startDate = format(
  //           this.prescriptionModel.startDate,
  //           "yyyy-MM-dd"
  //         ))
  //       : (this.prescriptionModel.startDate = null),
  //       this.prescriptionModel.endDate != null
  //         ? (this.prescriptionModel.endDate = format(
  //             this.prescriptionModel.endDate,
  //             "yyyy-MM-dd"
  //           ))
  //         : (this.prescriptionModel.endDate = null),
  //       this.clientService
  //         .createPrescription(this.prescriptionModel)
  //         .subscribe((response: any) => {
  //           this.submitted = false;
  //           if (response.statusCode == 200) {
  //             this.notifier.notify("success", response.message);
  //             if (clickType == "Save") this.closeDialog("SAVE");
  //             else if (clickType == "SaveAddMore") {
  //               this.refreshGrid.next();
  //               this.prescriptionForm.reset();
  //             }
  //           } else {
  //             this.notifier.notify("error", response.message);
  //           }
  //         });

  //   }
  // }


  onSubmit(event: any) {
    if (!this.prescriptionForm.invalid && this.getPrescriptions().length > 0) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      debugger
      console.log("ree", this.appointmentId);
      this.updatePrescriptionesNotes();
      if (this.prescriptionNo != null) {
        this.updatePrescriptionNumbers();
      }

      const prescriptions = this.prescriptionForm.value.medication.map((med: any) => {
        return {
          ...med,
          patientId: this.patientId,
          createdBy: med.id != null ? this.createdBy : null,
          createdDate: med.id != null ? this.createdDate : null,
          appointmentId: this.appointmentId,
          startDate: med.startDate ? format(med.startDate, "yyyy-MM-dd") : null,
          endDate: med.endDate ? format(med.endDate, "yyyy-MM-dd") : null,

        };
      });


      this.clientService.createPrescription(prescriptions).subscribe(
        (response: any) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            if (clickType == "Save") {
              this.closeDialog("SAVE");
            } else if (clickType == "SaveAddMore") {
              this.refreshGrid.next("");
              this.prescriptionForm.reset();
            }
          } else {
            this.notifier.notify("error", response.message);
          }
        },
        (error: any) => {
          this.submitted = false;
          this.notifier.notify("error", "Error occurred while saving prescriptions.");
          console.error("Error:", error);
        }
      );
    }
  }

  updatePrescriptionNumbers(): void {
    const medications = this.getPrescriptions();
    // medications.controls.forEach((medControl: FormGroup) => {
      medications.controls.forEach((control: AbstractControl) => {
        const medControl = control as FormGroup;
        const prescriptionNoControl = medControl.get('prescriptionNo');
      if (prescriptionNoControl && prescriptionNoControl.value == null) {
        prescriptionNoControl.setValue(this.prescriptionNo != null ? this.prescriptionNo : null);
      }
    });
  }

  updatePrescriptionesNotes(): void {
    const medications = this.getPrescriptions();
    medications.controls.forEach((control: AbstractControl) => {
      const medControl = control as FormGroup;
      const prescriptionNotesControl = medControl.get('notes') as FormControl;
      if (prescriptionNotesControl) {
        prescriptionNotesControl.setValue(this.notesControl.value);
      }
    });
  }


  closeDialog(action: string): void {
    this.medicationDialogModalRef.close(action);
    this.isEdit = false;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}

