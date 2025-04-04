import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { NotifierService } from "angular-notifier";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { ClientsService } from "../../../agency-portal/clients/clients.service";
import { Metadata } from "../../../core/modals/common-model";
import { CommonService } from "../../../core/services";
import { AddEditMedicalHistoryComponent } from "./add-edit-medical-history/add-edit-medical-history.component";

@Component({
  selector: "app-medical-history",
  templateUrl: "./medical-history.component.html",
  styleUrls: ["./medical-history.component.css"],
})
export class MedicalHistoryComponent implements OnInit {
  medicatlHistoryListModel: any;
  metaData: Metadata = new Metadata;
  maxDate: Date = new Date();

  medicatlHistoryColumn = [
    {
      displayName: "Diagnosed Type",
      key: "medicalConditionType",
      class: "",
    },
    {
      displayName: "Diagnosed on",
      key: "diagnoseDate",
      type: "date",
      class: "",
    },
    { displayName: "Status", key: "diagnosisStatus", class: "" },
    {
      displayName: "Discription",
      key: "discription",
    },
    {
      displayName: "Actions",
      key: "Actions",
      class: "",
      width: "15%",
    },
  ];
  medicatlHistoryActionButtons = [
    { displayName: "Edit", key: "edit", class: "fa fa-edit" },
    { displayName: "Delete", key: "delete", class: "fa fa-trash" },
  ];
  pageNumber: any = 1;
  pageSize: any = 10;
  sortOrder: any = null;
  sortColumn: any = null;
  clientId!: number;
  fromUserId: any;
  userId: any;
  locationId: any;

  //==========================

  headerText: string = "Add Medical History";
  medicalHistoryForm: FormGroup;
  statusModel = [
    { id: true, value: "Active" },
    { id: false, value: "Inactive" },
  ];
  dropDownListArray: any;

  constructor(
    translate: TranslateService,
    private dialogModal: MatDialog,
    private commonService: CommonService,
    private dialogService: DialogService,
    private notifier: NotifierService,
    private clientService: ClientsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) {
    // this.route.queryParams.subscribe((params: any) => {
    //   this.clientId = +params["id"];
    // });
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");

    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.clientId = user.id;
        this.fromUserId = user.userID;
        this.userId = user.userID;
        this.locationId = user.locationID;
      }
    });

    this.medicalHistoryForm = this.formBuilder.group({
      id: [0],
      patientID: [],
      maritalStatus: "",
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
    // this.getMedicalHistory();
  }
  getMedicalHistory = () => {
    this.clientService
      .GetPatientMedicalhistory(
        this.clientId,
        this.pageNumber,
        this.pageSize,
        this.sortColumn,
        this.sortOrder
      )
      .subscribe((res: any) => {
        console.log(res);
        if (res.data != null && res.statusCode == 200) {
          this.metaData = res.meta;

          this.updateDataInForm(
            this.dropDownListArray.medicalStatement,
            res.data.medicalStatementResList
          );

          this.medicalHistoryForm.patchValue({
            id: res.data.patientMedicalHistoryList[0].id,
            patientID: res.data.patientMedicalHistoryList[0].patientID,
            maritalStatus: res.data.patientMedicalHistoryList[0].maritalStatus,
            childhoodIllness: res.data.patientMedicalHistoryList[0]
              .childhoodIllness
              ? [
                  ...res.data.patientMedicalHistoryList[0].childhoodIllness.split(
                    ","
                  ),
                ].map((digit) => parseInt(digit))
              : null,
            AgeOnsetMensuration: res.data.patientMedicalHistoryList[0]
              .ageOnsetMensuration
              ? res.data.patientMedicalHistoryList[0].ageOnsetMensuration
              : null,
            noOfPregnancies: res.data.patientMedicalHistoryList[0]
              .noOfPregnancies
              ? res.data.patientMedicalHistoryList[0].noOfPregnancies
              : null,
            liveBirths: res.data.patientMedicalHistoryList[0].liveBirths
              ? res.data.patientMedicalHistoryList[0].liveBirths
              : null,
            otherProblem: res.data.patientMedicalHistoryList[0].otherProblem
              ? res.data.patientMedicalHistoryList[0].otherProblem
              : null,
          });
        }
      });
  };
  get formAddControls() {
    return this.medicalHistoryForm.controls;
  }

  get medicalStatement(): FormArray {
    return this.medicalHistoryForm.get("medicalStatement") as FormArray;
  }

  getAllmedicalDropdown = () => {
    this.clientService.GetMedicalHistoryDropdownApi().subscribe((res) => {
      console.log(res);
      this.dropDownListArray =JSON.parse(JSON.stringify(res.data));
      this.getMedicalHistory();
    });
  };

  updateDataInForm = (medicalStatement: any, medicalStatementObj: any) => {
    let medArray = this.medicalHistoryForm.get("medicalStatement") as FormArray;
    for (let index = 0; index < medArray.length;) {
      medArray.removeAt(0);
    }
    if (medArray.length == 0) {
      if (medicalStatement.length != 0) {
        medicalStatement.map((ele:any) => {
          if (medicalStatementObj.some((medS:any) => medS.statementId == ele.id)) {
            let tempObj: any = [];
            tempObj = medicalStatementObj.filter(
              (a: { statementId: any; }) => a.statementId == ele.id
            );
            this.medicalStatement.push(
              this.formBuilder.group({
                id: tempObj[0].id,
                statement: ele.id ? ele.id : null,
                statementName: ele.statement ? ele.statement : null,
                details: tempObj[0].details,
                statementDate: tempObj[0].statementDate,
                isDeleted: false,
              })
            );
          } else {
            this.medicalStatement.push(
              this.formBuilder.group({
                id: 0,
                statement: ele.id ? ele.id : null,
                statementName: ele.statement ? ele.statement : null,
                details: null,
                statementDate: null,
                isDeleted: false,
              })
            );
          }
        });
      }
    }
  };

  onSubmit = () => {
    if (this.medicalHistoryForm.invalid) {
      this.notifier.notify("error", "Form is invalid");
      return;
    }
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
      patientId: this.clientId,
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
        if (res.statusCode == 200) {
          this.notifier.notify("success", res.message);
          this.getMedicalHistory();
        } else {
          this.notifier.notify("error", res.message);
        }
      });
  };
}
