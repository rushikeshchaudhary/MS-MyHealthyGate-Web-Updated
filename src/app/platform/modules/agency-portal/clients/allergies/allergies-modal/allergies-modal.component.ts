import { Component, OnInit, Output, EventEmitter, Inject } from "@angular/core";
import { AllergyModel } from "../allergies.model";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClientsService } from "../../clients.service";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-allergies-modal",
  templateUrl: "./allergies-modal.component.html",
  styleUrls: ["./allergies-modal.component.css"],
})
export class AllergiesModalComponent implements OnInit {
  maxDate = new Date();
  patientId!: number;
  allergyModel: AllergyModel;
  isEditForm: boolean;
  allergyForm!: FormGroup;
  allergyAddForm!: FormGroup;
  allergyEditForm!: FormGroup;
  submitted: boolean = false;
  headerText: string = "Add Client Allergies";
  //master models
  masterAllergies!: any[];
  masterReaction!: any[];
  statusModel: any[];
  appointmentId = 1;
  //////////////////
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private allergyDialogModalRef: MatDialogRef<AllergiesModalComponent>,
    private clientService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    //assign data
    this.allergyModel = data.allergy;
    console.log(data.allergy);
    // this.refreshGrid.subscribe(data.refreshGrid);
    // this.patientId = this.allergyModel.patientId;
    //update header text

    if (data.allergy.id) {
      this.isEditForm = true;
      this.headerText = "Edit Client Allergies";
      this.allergyModel = data.allergy;
      console.log("Edit", this.allergyModel);
    } else {
      this.isEditForm = false;
      this.headerText = "Add Client Allergies";
      this.patientId = data.allergy.patientId;
      this.appointmentId = data.allergy.appointmentId;
    }
    this.statusModel = [
      { id: true, value: "Active" },
      { id: false, value: "Inactive" },
    ];
  }

  //on initial load
  ngOnInit() {
    // this.allergyForm = this.formBuilder.group({
    //   id: [this.allergyModel.id],
    //   patientID: [this.allergyModel.patientId],
    //   allergen: [this.allergyModel.allergen],
    //   allergyTypeId: [this.allergyModel.allergyTypeId],
    //   createdDate: [this.allergyModel.createdDate],
    //   isActive: [this.allergyModel.isActive],
    //   note: [this.allergyModel.note],
    //   reactionID: [this.allergyModel.reactionID]
    // });

    //page load calling master data for dropdowns
    this.getMasterData();
    this.allergyAddForm = this.formBuilder.group({
      id: [],
      patientID: [],
      allergen: [],
      allergyTypeId: [],
      createdDate: [],
      isActive: [],
      note: [],
      reactionID: [],
    });
    this.allergyEditForm = this.formBuilder.group({
      id: [],
      patientID: [],
      allergen: [],
      allergyTypeId: [],
      createdDate: [],
      isActive: [],
      note: [],
      reactionID: [],
    });
    if (this.allergyModel != null) {
      this.setEditForm();
    }
  }

  //get the form controls on html page
  get formAddControls() {
    return this.allergyAddForm.controls;
  }
  get formEditControls() {
    return this.allergyEditForm.controls;
  }

  //set data for edit form
  setEditForm() {
    console.log(
      "this.allergyModel.createdDate :",
      this.allergyModel.createdDate
    );
    this.allergyEditForm = this.formBuilder.group({
      id: this.allergyModel.id,
      patientID: this.allergyModel.patientId,
      allergen: this.allergyModel.allergen,
      allergyTypeId: this.allergyModel.allergyTypeId,
      createdDate: this.allergyModel.createdDate,
      isActive: this.allergyModel.isActive,
      note: this.allergyModel.note,
      reactionID: this.allergyModel.reactionID,
    });
  }
  //submit for create update of vitals
  onSubmit(event: any) {
    if (!this.allergyAddForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.allergyModel = this.allergyAddForm.value;
      this.allergyModel.patientId = this.patientId;
      this.allergyModel.appointmentId = this.appointmentId;
      this.allergyModel.createdDate=format(this.allergyAddForm.controls['createdDate'].value,'MM/dd/yyyy')

      this.clientService
        .createAllergy(this.allergyModel)
        .subscribe((response: any) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            if (clickType == "Save") this.closeDialog("save");
            else if (clickType == "SaveAddMore") {
              this.refreshGrid.next("");
              this.allergyAddForm.reset();
            }
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }
  //submit for Edit form
  onEditFormSubmit(event: any) {
    if (!this.allergyEditForm.invalid) {
      ////debugger;
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.allergyModel = this.allergyEditForm.value;
      this.allergyModel.patientId = this.patientId;
      this.allergyModel.appointmentId = this.appointmentId;
      this.allergyModel.createdDate=format(this.allergyEditForm.controls['createdDate'].value,'yyyy-MM-dd')
      this.clientService
        .createAllergy(this.allergyModel)
        .subscribe((response: any) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            if (clickType == "Save") this.closeDialog("save");
            else if (clickType == "SaveAddMore") {
              this.refreshGrid.next("");
              this.allergyEditForm.reset();
            }
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }
  //close popup
  closeDialog(action: string): void {
    this.allergyDialogModalRef.close(action);
  }

  //call master data api
  getMasterData() {
    let data = "MASTERALLERGIES,MASTERREACTION";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        console.log(response);
        this.masterAllergies =
          response.masterAllergies != null ? response.masterAllergies : [];
        this.masterAllergies.sort((a, b) => a.id - b.id);
        this.masterReaction =
          response.masterReaction != null ? response.masterReaction : [];
      }
    });
  }
}
