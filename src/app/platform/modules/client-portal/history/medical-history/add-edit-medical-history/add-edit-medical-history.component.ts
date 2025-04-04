import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";

@Component({
  selector: "app-add-edit-medical-history",
  templateUrl: "./add-edit-medical-history.component.html",
  styleUrls: ["./add-edit-medical-history.component.css"],
})
export class AddEditMedicalHistoryComponent implements OnInit {
  headerText: string = "Add Medical History";
  medicalHistoryForm: FormGroup;
  statusModel = [
    { id: true, value: "Active" },
    { id: false, value: "Inactive" },
  ];
  dropDownListArray: any;
  constructor(
    private formBuilder: FormBuilder,
    private AddEditMedicalHistory: MatDialogRef<AddEditMedicalHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientService: ClientsService,
    private datePipe: DatePipe
  ) {
    this.medicalHistoryForm = this.formBuilder.group({
      id: [0],
      patientID: [],
      maritalStatus: ["", [Validators.required]],
      childhoodIllness: [],
      AgeOnsetMensuration: null,
      noOfPregnancies: null,
      liveBirths: null,
      medicalStatement: this.formBuilder.array([]),
      otherProblem: "",
    });
  }

  ngOnInit() {
    this.getAllmedicalDropdown();

    console.log(this.data);
    // if (this.data.actionObj != undefined) {
    //   this.updateDataInForm(this.data.actionObj.data);
    // }

    console.log(this.medicalHistoryForm);
  }

  get formAddControls() {
    return this.medicalHistoryForm.controls;
  }

  get medicalStatement(): FormArray {
    return this.medicalHistoryForm.get("medicalStatement") as FormArray;
  }

  newmedicalStatement(): FormGroup {
    return this.formBuilder.group({
      id: 0,
      statement: "",
      details: "",
      statementDate: null,
      isDeleted: false,
    });
  }

  addNewMedicalStatementArray() {
    this.medicalStatement.push(this.newmedicalStatement());
  }

  removeMedicalStatement(i: number) {
    let getStatement = this.medicalStatement.at(i) as FormGroup;
    getStatement.patchValue({
      isDeleted: true,
    });

    // this.medicalStatement.removeAt(i);
  }

  getAllmedicalDropdown = () => {
    this.clientService.GetMedicalHistoryDropdownApi().subscribe((res) => {
      console.log(res);
      this.dropDownListArray = res.data;

      if (this.data.actionObj != undefined) {
        this.updateDataInForm(this.data.actionObj, this.data.medicalStatement);
      } else {
        this.addNewMedicalStatementArray();
      }
    });
  };

  updateDataInForm = (actionObj: any, medicalStatement: any) => {
    if (medicalStatement.length != 0) {
      medicalStatement.map((ele:any) => {
        // this.formBuilder.group({
        //   id: ele.id,
        //   statement: ele.statementId ? ele.statementId : null,
        //   details: "",
        //   statementDate: ele.statementDate ? ele.statementDate : null,
        //   isDeleted: false,
        // });

        // const pushData = {
        //   id: ele.id,
        //   statement: ele.statementId ? ele.statementId : null,
        //   details: "",
        //   statementDate: ele.statementDate ? ele.statementDate : null,
        //   isDeleted: false,
        // };
        this.medicalStatement.push(
          this.formBuilder.group({
            id: ele.id,
            statement: ele.statementId ? ele.statementId : null,
            details: ele.details ? ele.details : null,
            statementDate: ele.statementDate ? ele.statementDate : null,
            isDeleted: false,
          })
        );
      });
    }

    // let tempchild = actionObj.childhoodIllness
    // if(tempchild.length>0){
    //   tempchild=tempchild.toString()

    // }

    this.medicalHistoryForm.patchValue({
      id: actionObj.id,
      patientID: actionObj.patientID,
      maritalStatus: actionObj.maritalStatus,
      childhoodIllness: actionObj.childhoodIllness
        ? [...actionObj.childhoodIllness.split(",")].map((digit) =>
            parseInt(digit)
          )
        : null,
      AgeOnsetMensuration: actionObj.ageOnsetMensuration
        ? actionObj.ageOnsetMensuration
        : null,
      noOfPregnancies: actionObj.noOfPregnancies
        ? actionObj.noOfPregnancies
        : null,
      liveBirths: actionObj.liveBirths ? actionObj.liveBirths : null,
      //medicalStatement: [this.formBuilder.array([])],
      otherProblem: actionObj.otherProblem ? actionObj.otherProblem : null,
    });

    console.log(this.medicalHistoryForm);
  };

  closeDialog(action: string): void {
    this.AddEditMedicalHistory.close(action);
  }

  onSubmit = () => {
    // console.log(this.medicalHistoryForm.value);

    let patientStatement =
      this.medicalHistoryForm.controls["medicalStatement"].value;
    if (patientStatement.length > 0 || patientStatement != null) {
      patientStatement.map((ele: any) => {
        ele.statementDate =
          ele.statementDate == null
            ? null
            : this.datePipe.transform(ele.statementDate, 'MM/dd/yyyy');
      });
    } else {
      patientStatement = null;
    }

    const tempData = {
      id: this.medicalHistoryForm.controls["id"].value,
      patientId: this.data.patientId,
      maritalStatus: this.medicalHistoryForm.controls["maritalStatus"].value,
      childhoodIllness:
        this.medicalHistoryForm.controls["childhoodIllness"].value == null
          ? null
          : this.medicalHistoryForm.controls[
              "childhoodIllness"
            ].value.toString(),
      ageOnsetMensuration:
        this.medicalHistoryForm.controls["AgeOnsetMensuration"].value,
      noOfPregnancies:
        this.medicalHistoryForm.controls["noOfPregnancies"].value,
      liveBirths: this.medicalHistoryForm.controls["liveBirths"].value,
      otherProblem: this.medicalHistoryForm.controls["otherProblem"].value,
      patientMedicalStatement: patientStatement,
    };

    console.log(tempData);

    this.clientService
      .addEditPatientMedicalhistory(tempData)
      .subscribe((res: any) => {
        console.log(res);
        this.closeDialog("save");
      });
  };
}
