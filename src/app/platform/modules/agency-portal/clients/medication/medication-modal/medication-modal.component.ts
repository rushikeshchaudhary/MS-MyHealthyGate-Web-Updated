import { Component, OnInit, Output, EventEmitter, Inject } from "@angular/core";
import { MedicationModel } from "../medication.model";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClientsService } from "../../clients.service";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-medication-modal",
  templateUrl: "./medication-modal.component.html",
  styleUrls: ["./medication-modal.component.css"],
})
export class MedicationModalComponent implements OnInit {
  medicationModel: MedicationModel;
  medicationForm!: FormGroup;
  medicationEditForm!: FormGroup;
  medicationAddForm!: FormGroup;
  submitted: boolean = false;
  headerText: string = "Add Medication";
  masterFrequencyType: any[] = [];
  isEdit: boolean;
  patientId!: number;
  maxDate = new Date();
  appointmentId!: number;
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();
  filtermasterFrequencyTypes: Array<any> = [];
  filterString: any;
  filterFrequencyId: number = 0;
  //construtor
  constructor(
    private formBuilder: FormBuilder,
    private medicationDialogModalRef: MatDialogRef<MedicationModalComponent>,
    private clientService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private datePipe: DatePipe,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.medicationModel = data.medication ? data.medication : data;
    console.log("Medial Data", data);
    //header text updation
    if (this.medicationModel.id == null) {
      console.log("AddFormHIt", this.medicationModel);
      this.isEdit = false;
      this.headerText = "Add Medication";
      this.appointmentId = this.medicationModel.appointmentId ?? 0;
    } else {
      console.log("EditFormHit", this.medicationModel);
      this.isEdit = true;
      this.headerText = "Edit Medication";
      this.medicationModel = this.medicationModel;
    }
  }

  // on initial load
  ngOnInit() {
    this.getMasterData();
    this.medicationAddForm = this.formBuilder.group({
      id: [0],
      patientId: this.medicationModel.patientId,
      dose: [],
      endDate: [],
      frequencyID: [],
      medicine: [],
      startDate: [],
      strength: [],
    });
    this.medicationEditForm = this.formBuilder.group({
      id: [],
      dose: [],
      patientId: this.medicationModel.patientId,
      endDate: [],
      frequencyID: [],
      medicine: [],
      startDate: [],
      strength: [],
    });
    this.setEditForm();
  }
  setEditForm() {
    // const timestamp = "0001-01-01T00:00:00";
    // const date = new Date(timestamp);
    // const medicationStartDate = this.medicationModel.startDate;
    // const medicationEndDate = this.medicationModel.endDate;
    this.filterString = this.medicationModel.frequencyName;
    this.filterFrequencyId = this.medicationModel.frequencyID;
    this.medicationEditForm = this.formBuilder.group({
      id: this.medicationModel.id,
      patientId: this.medicationModel.patientId,
      dose: this.medicationModel.dose,
      endDate: this.medicationModel.endDate,
      frequencyID: this.medicationModel.frequencyName, // this.medicationModel.globalCodeName,
      medicine: this.medicationModel.medicine,
      startDate: this.medicationModel.startDate,
      strength: this.medicationModel.strength,
    });
  }
  //call master data for drop down
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

  frequencyTypeHandler = (e:any) => {
    if (e !== "" && e != undefined) {
      this.filtermasterFrequencyTypes = this.masterFrequencyType.filter(
        (doc) => doc.value.toLowerCase().indexOf(e) != -1
      );
    } else {
      this.filtermasterFrequencyTypes = [];
    }
  };

  onSelectChange(data: { value: any; id: number; }, type: string) {
    if (type == "frequency") {
      this.filterString = data.value;
      this.filterFrequencyId = data.id;
    }
  }
  // get all the controls
  get addFormControls() {
    return this.medicationAddForm.controls;
  }

  get editFormControls() {
    return this.medicationEditForm.controls;
  }

  //submit the form
  onSubmit(event: any) {
    if (!this.medicationAddForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;

      this.medicationModel = this.medicationAddForm.value;
      this.medicationModel.appointmentId = this.appointmentId;
      this.medicationModel.frequencyName =
        this.filterString == null || this.filterString == undefined
          ? ""
          : this.filterString;
      if (
        this.masterFrequencyType.findIndex(
          (d) =>
            d.value.toLowerCase() ==
            this.medicationModel.frequencyName!.toLowerCase()
        ) == -1
      ) {
        this.filterFrequencyId = 0;
      }
      this.medicationModel.frequencyID =
        this.filterFrequencyId == null || this.filterFrequencyId == undefined
          ? 0
          : this.filterFrequencyId;
      // this.patientId = this.medicationModel.patientId;

      this.medicationModel.startDate =
        this.medicationAddForm.controls["startDate"].value != null
          ? this.datePipe.transform(
              this.medicationAddForm.controls["startDate"].value,
              'MM/dd/yyyy'
            )
          : null;

      this.medicationModel.endDate =
      this.medicationAddForm.controls["endDate"].value != null
      ? this.datePipe.transform(
          this.medicationAddForm.controls["endDate"].value,
          'MM/dd/yyyy'
        )
      : null;



        // this.medicationAddForm.controls["endDate"].value != null
        //   ? format(
        //       this.medicationAddForm.controls["endDate"].value,
        //       "yyyy/DD/MM"
        //     )
        //   : null;
      this.medicationModel.patientId = parseInt(
        this.medicationAddForm.controls["patientId"].value
      );

      this.clientService
        .createMedication(this.medicationModel)
        .subscribe((response: any) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            if (clickType == "Save") this.closeDialog("SAVE");
            else if (clickType == "SaveAddMore") {
              this.refreshGrid.next("");
              this.medicationAddForm.reset();
              //this.medicationDialogModalRef.close('SAVE');
            }
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }
  onEditSubmit(event: any) {
    if (!this.medicationEditForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.medicationModel = this.medicationEditForm.value;
      // this.medicationModel.patientId = this.medicationModel.patientId;
      this.medicationModel.frequencyID = this.filterFrequencyId;
      this.medicationModel.frequencyName = this.filterString;
      this.medicationModel.startDate =
      this.medicationEditForm.controls["startDate"].value != null
        ? this.datePipe.transform(
            this.medicationEditForm.controls["startDate"].value,
            'MM/dd/yyyy'
          )
        : null;

    this.medicationModel.endDate =
    this.medicationEditForm.controls["endDate"].value != null
    ? this.datePipe.transform(
        this.medicationEditForm.controls["endDate"].value,
        'MM/dd/yyyy'
      )
    : null;

      this.medicationModel.patientId = parseInt(
        this.medicationEditForm.controls["patientId"].value
      );
      this.clientService
        .createMedication(this.medicationModel)
        .subscribe((response: any) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            if (clickType == "Save") this.closeDialog("SAVE");
            else if (clickType == "SaveAddMore") {
              this.refreshGrid.next("");
              this.medicationEditForm.reset();
              //this.medicationDialogModalRef.close('SAVE');
            }
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }
  //to close popup
  closeDialog(action: string): void {
    this.medicationDialogModalRef.close(action);
  }
}
